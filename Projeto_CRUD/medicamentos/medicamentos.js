const API_URL = 'http://localhost:3000/medicamentos';
let medicamentos  = [];
let medicamentoAtual = null;
//============================ Renderizar tabela ====================================
function renderizarTabela() {
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Dados recebidos:', data);
            medicamentos = data;
            const corpoTab = document.getElementById('corpoTab');
            corpoTab.innerHTML = '';
            
            if (!data || data.length === 0) {
                corpoTab.innerHTML = '<tr><td colspan="8">Nenhum medicamento cadastrado</td></tr>';
                return;
            }
            
            data.forEach(medicamento => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${medicamento.cod_med || ''}</td>
                    <td>${medicamento.nome_med || ''}</td>
                    <td>${medicamento.cod_anvisa || ''}</td>
                    <td>${medicamento.lote_med || ''}</td>
                    <td>${formatarData(medicamento.validade)}</td>
                    <td>${medicamento.tarja || ''}</td>
                    <td><button class="edit" onclick="editarMedicamento(${medicamento.cod_med})">Editar</button></td>
                    <td><button class="error" onclick="deletarMedicamento(${medicamento.cod_med})">Deletar</button></td>
                `;
                corpoTab.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar medicamentos:', error);
            document.getElementById('corpoTab').innerHTML = 
                '<tr><td colspan="8">Erro ao carregar dados: ' + error.message + '</td></tr>';
        });
}

// Função auxiliar para formatar data
function formatarData(dataString) {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}

//================================ Editar medicamento  ====================================
function editarMedicamento(cod_med) {
    medicamentoAtual = cod_med;
    document.getElementById("cadastrar").innerText = "Atualizar";
    document.getElementById("cancelBtn").style.display = "block";
    
    const medicamento = medicamentos.find(m => m.cod_med == cod_med);
    
    document.getElementById('cod_med').value = medicamento.cod_med;
    document.getElementById('nome_med').value = medicamento.nome_med;
    document.getElementById('cod_anvisa').value = medicamento.cod_anvisa;
    document.getElementById('lote_med').value = medicamento.lote_med;
    document.getElementById('validade').value = medicamento.validade;
    document.getElementById('tarja').value = medicamento.tarja;
    document.getElementById('comp').value = medicamento.comp;
    document.getElementById('dosagem').value = medicamento.dosagem;
    document.getElementById('indic').value = medicamento.indic;
    document.getElementById('contra_indic').value = medicamento.contra_indic;
    document.getElementById('efeitos_adv').value = medicamento.efeitos_adv;
    document.getElementById('cond_armaz').value = medicamento.cond_armaz;
}
//============================== Cadastrar medicamento (POST)  ============================
//============================= Atualizar medicamento (UPDATE) ============================

document.getElementById("medForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Prepare the data object matching backend expectations
    let dadosFormulario = {
        nome_med: document.getElementById('nome_med').value,
        cod_anvisa: document.getElementById('cod_anvisa').value,
        lote_med: document.getElementById('lote_med').value,
        validade: document.getElementById('validade').value,
        tarja: document.getElementById('tarja').value,
        comp: document.getElementById('comp').value || null, // Optional field
        dosagem: document.getElementById('dosagem').value,
        indic: document.getElementById('indic').value || null, // Optional field
        contra_indic: document.getElementById('contra_indic').value,
        efeitos_adv: document.getElementById('efeitos_adv').value,
        cond_armaz: document.getElementById('cond_armaz').value
    };

    // Validate required fields
    if (!dadosFormulario.nome_med || !dadosFormulario.cod_anvisa || 
        !dadosFormulario.lote_med || !dadosFormulario.validade || 
        !dadosFormulario.dosagem || !dadosFormulario.contra_indic || 
        !dadosFormulario.efeitos_adv || !dadosFormulario.cond_armaz) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }

    const url = medicamentoAtual ? `${API_URL}/${medicamentoAtual}` : API_URL;
    const method = medicamentoAtual ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(dadosFormulario)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        console.log('Sucesso:', data);
        renderizarTabela();
        document.getElementById('medForm').reset();
        if (medicamentoAtual) {
            medicamentoAtual = null;
            document.getElementById("cancelBtn").style.display = "none";
            document.getElementById("cadastrar").innerText = "Cadastrar";
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert(`Erro: ${error.error || 'Ocorreu um erro'}.\nDetalhes: ${error.details || error.message}`);
    });
});
    
    //============================ Cancelar edição ==========================
document.getElementById("cancelBtn").addEventListener("click", (event) => {
    event.preventDefault();
    if (!medicamentoAtual) {
        document.getElementById("medForm").reset();
    } else {
        medicamentoAtual = null;
        document.getElementById("medForm").reset();
        document.getElementById("cancelBtn").style.display = "none";
        document.getElementById("cadastrar").innerText = "Cadastrar";
    }
});
renderizarTabela();

//============================ Deletar medicamento (DELETE) ==========================
async function deletarMedicamento(cod_med) {
    if (!confirm('Tem certeza que deseja deletar este medicamento?')) return;
    
    try {
        const response = await fetch(`${API_URL}/${cod_med}`, { 
            method: 'DELETE' 
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Falha ao deletar');
        }
        
        renderizarTabela();
        alert('Medicamento deletado com sucesso!');
    } catch (error) {
        console.error('Erro ao deletar medicamento:', error);
        alert(`Erro ao deletar: ${error.message}`);
    }
}

// Inicializar tabela
renderizarTabela();
