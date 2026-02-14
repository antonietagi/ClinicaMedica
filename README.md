# 🏥 Clínica Médica - Sistema CRUD de Gestão

Projeto desenvolvido para a disciplina de *Linguagem de Programação (JavaScript), no **2º semestre* da graduação. Criado com o objetivo de aplicar e consolidar conhecimentos em desenvolvimento web, utilizando *HTML, CSS, JavaScript* e *SQL*.

O sistema realiza operações CRUD relacionadas à gestão de *frota, **funcionários, **equipamentos, **medicamentos* e *pacientes* em uma clínica médica.

---

## 📁 Estrutura do Projeto

- /frontend – Interface desenvolvida com HTML, CSS e JavaScript.  
- /backend-node – Servidor Node.js responsável pelas requisições e comunicação com o banco de dados MySQL.

---

## ⚠️ Observação

Para evitar erros ao realizar requisições fetch, recomenda-se executar o front-end em um servidor local (como a extensão *Live Server* no VS Code), evitando bloqueios do navegador.

---

## 🧶 Instalação

Os pacotes e a pasta node_modules *não estão incluídos no repositório*, pois são gerados automaticamente ao instalar as dependências do projeto Node.js.


Para rodar o servidor Node.js, siga os passos abaixo no terminal:

```bash
cd backend-node
npm init -y
npm install express mysql2 cors
node server.js
