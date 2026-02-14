const API_URL = 'http://localhost:3000/pacientes';
let pacientes = [];
let pacienteAtual = null;

//============================ Renderizar tabela ====================================
function renderizarTabela() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            pacientes = data;
            const corpoTab = document.getElementById('corpoTab');
            corpoTab.innerHTML = '';
            data.forEach((paciente) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${paciente.nome}</td>
                    <td>${paciente.cpf}</td>
                    <td>${paciente.rg}</td>
                    <td>${paciente.nascimento}</td>
                    <td>${paciente.sexo}</td>
                    <td>${paciente.celular}</td>
                    <td>${paciente.email}</td>
                    <td>${paciente.convenio}</td>
                    <td><button class="edit" onclick="editarPaciente(${paciente.id})">Editar</button></td>
                    <td><button class="error" onclick="deletarPaciente(${paciente.id})">Deletar</button></td>
                `;
                corpoTab.appendChild(tr);
            });
        })
        .catch(error => console.error('Erro ao buscar pacientes:', error));
}

//================================ Editar paciente  ====================================
function editarPaciente(id) {
    pacienteAtual = id;
    document.getElementById("cancelBtn").style.display = "inline-block";
    document.getElementById("cadastrar").innerText = "Atualizar";

    const paciente = pacientes.find(p => p.id === id);

    document.getElementById('nome').value = paciente.nome;
    document.getElementById('cpf').value = paciente.cpf;
    document.getElementById('rg').value = paciente.rg;
    document.getElementById('celular').value = paciente.celular;
    document.getElementById('email').value = paciente.email;
    document.getElementById('convenio').value = paciente.convenio;
}

//============================== Cadastrar/Atualizar paciente ============================
document
    .getElementById("pacientesForm")
    .addEventListener("submit", function (event) {
        event.preventDefault();
        let dadosFormulario = {
            nome: document.getElementById('nome').value,
            cpf: document.getElementById('cpf').value,
            rg: document.getElementById('rg').value,
            nascimento: document.getElementById('nascimento').value,
            sexo: document.querySelector('input[name="sexo"]:checked').value,
            celular: document.getElementById('celular').value,
            email: document.getElementById('email').value,
            convenio: document.getElementById('convenio').value
        };

        if (pacienteAtual) {
            fetch(`${API_URL}/${pacienteAtual}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosFormulario)
            })
                .then(() => {
                    renderizarTabela();
                    pacienteAtual = null;
                    document.getElementById('pacientesForm').reset();
                    document.getElementById("cancelBtn").style.display = "none";
                    document.getElementById("cadastrar").innerText = "Cadastrar";
                })
                .catch(error => console.error('Erro ao atualizar paciente:', error));
        } else {
            fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosFormulario)
            })
                .then(response => response.json())
                .then(() => {
                    renderizarTabela();
                    document.getElementById("pacientesForm").reset();
                })
                .catch(error => console.error('Erro ao cadastrar paciente:', error));
        }
    });

document.getElementById("cancelBtn").addEventListener("click", (event) => {
    event.preventDefault();
    pacienteAtual = null;
    document.getElementById("pacientesForm").reset();
    document.getElementById("cancelBtn").style.display = "none";
    document.getElementById("cadastrar").innerText = "Cadastrar";
});

//============================ Deletar paciente (DELETE) ==========================
async function deletarPaciente(id) {
    if (!confirm('O paciente será deletado permanentemente. Tem certeza?')) return;
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(() => renderizarTabela())
        .catch(error => console.error('Erro ao deletar paciente:', error));
}

// Inicializar tabela
renderizarTabela();