const API_URL = 'http://localhost:3000/frota';
let veiculos  = [];
let frotaAtual = null;
//============================ Renderizar tabela ====================================
function renderizarTabela() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            veiculos=data;
            const corpoTab = document.getElementById('corpoTab');
            corpoTab.innerHTML = '';
            data.forEach((veiculo) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${veiculo.placa}</td>
                    <td>${veiculo.tipo_veiculo}</td>
                    <td>${veiculo.marca}</td>
                    <td>${veiculo.modelo}</td>
                    <td>${veiculo.ano}</td>
                    <td>${veiculo.km}</td>
                    <td><button class="edit" onclick="editarVeiculo(${veiculo.id})">Editar</button></td>
                    <td><button class="error" onclick="deletarVeiculo(${veiculo.id})">Deletar</button></td>
                `;
                corpoTab.appendChild(tr);
            });
        })
        .catch(error => console.error('Erro ao buscar veículos:', error));
}

//================================ Editar veículo  ====================================
function editarVeiculo(id) {
    frotaAtual = id;
    
    document.getElementById("cancelBtn").style.display = "inline-block";
    document.getElementById("cadastrar").innerText= "Atualizar";
    
    const veiculo = veiculos.find(v => v.id === id);
    
    document.getElementById('placa').value = veiculo.placa;
    document.querySelector(`input[name="tipo"][value="${veiculo.tipo}"]`);
    document.getElementById('marca').value = veiculo.marca;
    document.getElementById('modelo').value = veiculo.modelo;
    document.getElementById('ano').value = veiculo.ano;
    document.getElementById('km').value = veiculo.km;
}
//============================== Cadastrar veículo (POST)  ============================
//============================= Atualizar veículo (UPDATE) ============================
document
    .getElementById("frotaForm")
    .addEventListener("submit", function (event) {
        event.preventDefault();
        let dadosFormulario = {
            placa: document.getElementById('placa').value,
            tipo_veiculo: document.querySelector('input[name="tipo"]:checked').value,
            marca: document.getElementById('marca').value,
            modelo: document.getElementById('modelo').value,
            ano: document.getElementById('ano').value,
            km: document.getElementById('km').value
        };

        if(frotaAtual){
        fetch(`${API_URL}/${frotaAtual}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosFormulario)
        })
            .then(() => {
                renderizarTabela();
                frotaAtual = null;
                document.getElementById('frotaForm').reset();
                document.getElementById("cancelBtn").style.display = "none";
                document.getElementById("cadastrar").innerText = "Cadastrar";
            })
            .catch(error => console.error('Erro ao atualizar veículo:', error));
        }else{
            fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosFormulario)
        })
            .then(response => response.json())
            .then(() => {
                renderizarTabela();
                document.getElementById("frotaForm").reset();
            })
            .catch(error => console.error('Erro ao cadastrar veículo:', error));
    }
});
document.getElementById("cancelBtn").addEventListener("click", (event)=>{
    event.preventDefault();
    frotaAtual = null;
    document.getElementById("frotaForm").reset();
    document.getElementById("cancelBtn").style.display = "none";
    document.getElementById("cadastrar").innerText= "Cadastrar";
});
renderizarTabela();

//============================ Deletar veículo (DELETE) ==========================
async function deletarVeiculo(id) {
    if (!confirm('O veículo será deletado permanetemente. Tem certeza?')) return;
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(() => renderizarTabela())
        .catch(error => console.error('Erro ao deletar veículo:', error));
}
// Inicializar tabela
renderizarTabela();
