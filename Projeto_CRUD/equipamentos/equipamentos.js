const API_URL = 'http://localhost:3000/equipamentos';
let equipamentos = [];
let equipamentoAtual = null;

//============================ Renderizar tabela ====================================
function renderizarTabela() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            equipamentos = data;
            const corpoTab = document.getElementById('corpoTab');
            corpoTab.innerHTML = '';
            data.forEach((equipamento) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${equipamento.nome}</td>
                    <td>${equipamento.descricao || ''}</td>
                    <td>${equipamento.marca || ''}</td>
                    <td>${equipamento.modelo || ''}</td>
                    <td>${equipamento.numero_serie || ''}</td>
                    <td>${equipamento.data_aquisicao || ''}</td>
                    <td>${equipamento.status}</td>
                    <td><button class="edit" onclick="editarEquipamento(${equipamento.id})">Editar</button></td>
                    <td><button class="error" onclick="deletarEquipamento(${equipamento.id})">Deletar</button></td>
                `;
                corpoTab.appendChild(tr);
            });
        })
        .catch(error => console.error('Erro ao buscar equipamentos:', error));
}

//================================ Editar equipamento  ====================================
function editarEquipamento(id) {
    equipamentoAtual = id;

    document.getElementById("cancelBtn").style.display = "inline-block";
    document.getElementById("cadastrar").innerText = "Atualizar";

    const equipamento = equipamentos.find(e => e.id === id);

    document.getElementById('nome').value = equipamento.nome;
    document.getElementById('descricao').value = equipamento.descricao || '';
    document.getElementById('marca').value = equipamento.marca || '';
    document.getElementById('modelo').value = equipamento.modelo || '';
    document.getElementById('numero_serie').value = equipamento.numero_serie || '';
    document.getElementById('data_aquisicao').value = equipamento.data_aquisicao || '';

    // Ajuste para status (select no HTML, então value direto)
    document.getElementById('status').value = equipamento.status;
}

//============================== Cadastrar/Atualizar equipamento ============================
document.getElementById("equipamentoForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let statusSelecionado = document.getElementById('status').value;

    // Garante que status seja sempre uma string válida
    if (!statusSelecionado) {
        statusSelecionado = "ativo"; // ou qualquer padrão desejado
    }

    let dadosFormulario = {
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        marca: document.getElementById('marca').value,
        modelo: document.getElementById('modelo').value,
        numero_serie: document.getElementById('numero_serie').value,
        data_aquisicao: document.getElementById('data_aquisicao').value || null,
        status: statusSelecionado
    };

    if (equipamentoAtual) {
        fetch(`${API_URL}/${equipamentoAtual}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosFormulario)
        })
        .then(() => {
            renderizarTabela();
            equipamentoAtual = null;
            document.getElementById('equipamentoForm').reset();
            document.getElementById("cancelBtn").style.display = "none";
            document.getElementById("cadastrar").innerText = "Cadastrar";
        })
        .catch(error => console.error('Erro ao atualizar equipamento:', error));
    } else {
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosFormulario)
        })
        .then(response => response.json())
        .then(() => {
            renderizarTabela();
            document.getElementById("equipamentoForm").reset();
        })
        .catch(error => console.error('Erro ao cadastrar equipamento:', error));
    }
});

document.getElementById("cancelBtn").addEventListener("click", (event) => {
    event.preventDefault();
    equipamentoAtual = null;
    document.getElementById("equipamentoForm").reset();
    document.getElementById("cancelBtn").style.display = "none";
    document.getElementById("cadastrar").innerText = "Cadastrar";
});

//============================ Deletar equipamento ==========================
async function deletarEquipamento(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(() => renderizarTabela())
        .catch(error => console.error('Erro ao deletar equipamento:', error));
}

// Inicializar tabela
renderizarTabela();
