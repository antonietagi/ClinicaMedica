// Definindo a URL da API onde os dados dos funcionários estão armazenados
const API_URL = 'http://localhost:3000/funcionarios';

// Inicializando a lista de funcionários (vazia) e a variável para armazenar o id do funcionário atual
let funcionarios = [];
let funcionarioAtual = null;

//============================ Renderizar Tabela ====================================
// Renderizar signfica gerar a lista de funcionarios na tela do navegador
// Função para renderizar a tabela de funcionários na tela
function renderizarTabela() {
    // Fazendo uma requisição GET para a API para obter os dados dos funcionários
    fetch(API_URL)
        .then(response => response.json())  // Converte a resposta para JSON
        .then(data => {
            funcionarios = data;  // Atribui os dados recebidos à variável funcionarios
            const corpoTab = document.getElementById('corpoTab');  // Obtém o corpo da tabela HTML
            corpoTab.innerHTML = '';  // Limpa o conteúdo da tabela antes de renderizar os novos dados
            // Itera sobre os funcionários e adiciona uma linha na tabela para cada um
            data.forEach((funcionario) => {
                const tr = document.createElement('tr');  // Cria uma nova linha da tabela
                tr.innerHTML = `
                    <td>${funcionario.nome}</td>
                    <td>${funcionario.data_nasc || ''}</td>
                    <td>${funcionario.cpf || ''}</td>
                    <td>${funcionario.cargo || ''}</td>
                    <td>${funcionario.celular || ''}</td>
                    <td><button class="edit" onclick="editarFuncionario(${funcionario.id})">Editar</button></td>
                    <td><button class="error" onclick="deletarFuncionario(${funcionario.id})">Deletar</button></td>
                `;
                corpoTab.appendChild(tr);  // Adiciona a linha à tabela
            });
        })
        .catch(error => console.error('Erro ao buscar funcionários:', error));  // Em caso de erro na requisição, exibe no console
}

//============================== Editar Funcionário ====================================
// Função para editar um funcionário específico
function editarFuncionario(id) {
    funcionarioAtual = id;  // Armazena o id do funcionário que será editado

    // Exibe o botão de cancelamento e altera o texto do botão de "Cadastrar" para "Atualizar"
    document.getElementById("cancelBtn").style.display = "inline-block";
    document.getElementById("cadastrar").innerText = "Atualizar";

    // Encontra o funcionário a ser editado usando o id
    const funcionario = funcionarios.find(f => f.id === id);

    // Preenche os campos do formulário com as informações do funcionário
    document.getElementById('nome').value = funcionario.nome;
    document.getElementById('data_nasc').value = funcionario.data_nasc || '';
    document.getElementById('cpf').value = funcionario.cpf || '';
    document.getElementById('cargo').value = funcionario.cargo || '';
    document.getElementById('celular').value = funcionario.celular || '';
}

//============================== Cadastrar/Atualizar Funcionário ============================
// Adiciona um evento no formulário para quando ele for enviado (cadastrar ou atualizar um funcionário)
document.getElementById("funcionarioForm").addEventListener("submit", function (event) {
    event.preventDefault();  // Impede o envio padrão do formulário (recarregar a página)

    // Coleta os dados do formulário
    let dadosFormulario = {
        nome: document.getElementById('nome').value,
        data_nasc: document.getElementById('data_nasc').value || null,
        cpf: document.getElementById('cpf').value,
        cargo: document.getElementById('cargo').value,
        celular: document.getElementById('celular').value
    };

    // Se existir um id de funcionário atual, é uma atualização (PUT), caso contrário, é um cadastro novo (POST)
    if (funcionarioAtual) {
        // Requisição PUT para atualizar o funcionário
        fetch(`${API_URL}/${funcionarioAtual}`, {
            method: 'PUT',  // Usando o método PUT para atualizar
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosFormulario)  // Envia os dados do funcionário em formato JSON
        })
        .then(() => {
            renderizarTabela();  // Atualiza a tabela após a atualização
            funcionarioAtual = null;  // Limpa o id do funcionário atual
            document.getElementById('funcionarioForm').reset();  // Limpa o formulário
            document.getElementById("cancelBtn").style.display = "none";  // Esconde o botão de cancelar
            document.getElementById("cadastrar").innerText = "Cadastrar";  // Altera o texto do botão de volta para "Cadastrar"
        })
        .catch(error => console.error('Erro ao atualizar funcionário:', error));  // Em caso de erro, exibe no console
    } else {
        // Requisição POST para cadastrar um novo funcionário
        fetch(API_URL, {
            method: 'POST',  // Usando o método POST para cadastrar
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosFormulario)  // Envia os dados do novo funcionário
        })
        .then(response => response.json())  // Converte a resposta da API em JSON
        .then(() => {
            renderizarTabela();  // Atualiza a tabela após o cadastro
            document.getElementById("funcionarioForm").reset();  // Limpa o formulário
        })
        .catch(error => console.error('Erro ao cadastrar funcionário:', error));  // Em caso de erro, exibe no console
    }
});

//============================ Cancelar Edição ==========================
// Função para cancelar a edição de um funcionário
document.getElementById("cancelBtn").addEventListener("click", (event) => {
    event.preventDefault();  // Impede o comportamento padrão de clique
    funcionarioAtual = null;  // Limpa o id do funcionário atual
    document.getElementById("funcionarioForm").reset();  // Limpa os campos do formulário
    document.getElementById("cancelBtn").style.display = "none";  // Esconde o botão de cancelamento
    document.getElementById("cadastrar").innerText = "Cadastrar";  // Restaura o texto do botão de cadastrar
});

//============================ Deletar Funcionário ==========================
// Função para deletar um funcionário específico
function deletarFuncionario(id) {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })  // Requisição DELETE para excluir o funcionário com o id fornecido
        .then(() => renderizarTabela())  // Atualiza a tabela após deletar o funcionário
        .catch(error => console.error('Erro ao deletar funcionário:', error));  // Em caso de erro, exibe no console
}

//============================ Inicializa a Tabela ==========================
// Chama a função para renderizar a tabela de funcionários quando a página é carregada
renderizarTabela();
