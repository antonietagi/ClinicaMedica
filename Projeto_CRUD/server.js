const mysql = require('mysql2');// npm i mysql2
const express = require('express');// npm i express
const app= express();
const cors = require('cors');// npm i cors

app.use(cors()); 
app.use(express.json()); 

// Configuração da conexão
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@Lee.2110Ferreira',
    database: 'clinica',
    port: 3306
});

// Conectar ao banco de dados
connection.connect(error => {
    if (error) {
        console.error('Erro ao conectar:', error.stack);
        return;
    }
    console.log('Conectado com o ID ' + connection.threadId);
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


//============================= (FROTA - GABRIEL) =================================//
//================================ Criar (POST) ===================================//

app.post('/frota', (req, res) => {
    const user = req.body;
    console.log(user)
    const query = 'INSERT INTO frota SET ?';
    connection.query(query, user, (error, results) => {
        if (error) {
            console.error('Erro ao inserir o veículo:', error);
            return res.status(500).json({ error: 'Erro ao inserir o veículo' });
        }

        console.log('Veículo inserido com sucesso! ID:', results.insertId);
        res.status(201).json({ id: results.insertId });
    });
});
//================================ Ler (GET) ========================================//
app.get('/frota', (req, res) => {
    const query = 'SELECT * FROM frota';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Erro ao buscar veículos:', error);
            return res.status(500).json({ error: 'Erro ao buscar veículos' });
        }

        res.status(200).json(results);
    });
});
//================================ Atualizar (PUT) ===================================//
app.put('/frota/:id', (req, res) => {
    const id = req.params.id;
    const veiculo = req.body;

    const query = 'UPDATE frota SET ? WHERE id = ?';
    connection.query(query, [veiculo, id], (error) => {
        if (error) {
            console.error('Erro ao atualizar o veículo:', error);
            return res.status(500).json({ error: 'Erro ao atualizar o veículo' });
        }

        res.status(200).json({ message: 'Veículo atualizado com sucesso' });
    });
});
//================================ Deletar (DELETE) ===================================//
app.delete('/frota/:id', (req, res) => {
    const id = req.params.id;

    const query = 'DELETE FROM frota WHERE id = ?';
    connection.query(query, id, (error, results) => {
        if (error) {
            console.error('Erro ao deletar o veículo:', error);
            return res.status(500).json({ error: 'Erro ao deletar o veículo' });
        }
        res.status(200).json({ message: 'Veículo deletado com sucesso' });
    });
});
//=====================================================================================//

//===================================== (LETÍCIA) =====================================//

// Função para tratar o campo data_aquisicao, enviando null se estiver vazio ou indefinido
function tratarDataAquisicao(equipamento) {
    if (equipamento.data_aquisicao === '' || equipamento.data_aquisicao === undefined) {
        equipamento.data_aquisicao = null;
    }
}

// Função para validar e padronizar o campo status
function tratarStatus(equipamento) {
    const statusValido = ['ativo', 'inativo', 'manutencao'];
    if (!statusValido.includes(equipamento.status)) {
        equipamento.status = 'ativo'; // Define um valor padrão se o status não for válido
    }
}

// ========================= ROTAS DO CRUD =============================

// Rota POST - Cadastrar um novo equipamento
app.post('/equipamentos', (req, res) => {
    const equipamento = req.body; // Pega os dados enviados no corpo da requisição (JSON)

    tratarDataAquisicao(equipamento); // Trata data nula
    tratarStatus(equipamento);        // Trata status inválido

    const query = 'INSERT INTO equipamentos SET ?'; // Query SQL de inserção
    connection.query(query, equipamento, (error, results) => {
        if (error) {
            console.error('Erro ao inserir equipamento:', error);
            return res.status(500).json({ error: 'Erro ao inserir equipamento' });
        }

        res.status(201).json({ id: results.insertId }); // Retorna o ID do novo equipamento
    });
});

// Rota GET - Buscar todos os equipamentos
app.get('/equipamentos', (req, res) => {
    const query = 'SELECT * FROM equipamentos'; // Query SQL para buscar todos os registros

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Erro ao buscar equipamentos:', error);
            return res.status(500).json({ error: 'Erro ao buscar equipamentos' });
        }

        res.status(200).json(results); // Retorna os dados dos equipamentos
    });
});

// Rota PUT - Atualizar equipamento por ID
app.put('/equipamentos/:id', (req, res) => {
    const id = req.params.id;        // Pega o ID enviado na URL
    const equipamento = req.body;    // Pega os dados novos enviados no corpo da requisição

    tratarDataAquisicao(equipamento); // Trata data nula
    tratarStatus(equipamento);        // Trata status inválido

    const query = 'UPDATE equipamentos SET ? WHERE id = ?'; // Query SQL para atualizar

    connection.query(query, [equipamento, id], (error, results) => {
        if (error) {
            console.error('Erro ao atualizar equipamento:', error);
            return res.status(500).json({ error: 'Erro ao atualizar equipamento' });
        }

        res.status(200).json({ message: 'Equipamento atualizado com sucesso' });
    });
});

// Rota DELETE - Remover equipamento por ID
app.delete('/equipamentos/:id', (req, res) => {
    const id = req.params.id; // Pega o ID enviado na URL

    const query = 'DELETE FROM equipamentos WHERE id = ?'; // Query SQL para deletar

    connection.query(query, id, (error, results) => {
        if (error) {
            console.error('Erro ao deletar equipamento:', error);
            return res.status(500).json({ error: 'Erro ao deletar equipamento' });
        }

        res.status(200).json({ message: 'Equipamento deletado com sucesso' });
    });
});
//=====================================================================================//

//==================================== (GIOVANNA) =====================================//

// Rota POST - Cadastrar um novo funcionário
app.post('/funcionarios', (req, res) => {
    const funcionario = req.body; // Pega os dados enviados no corpo da requisição (JSON)

    const query = 'INSERT INTO funcionarios SET ?'; // Query SQL de inserção
    connection.query(query, funcionario, (error, results) => {
        if (error) {
            // Se der erro, exibe no console e retorna erro 500 para o cliente
            console.error('Erro ao inserir funcionário:', error);
            return res.status(500).json({ error: 'Erro ao inserir funcionário' });
        }

        // Se der certo, responde com o ID do novo funcionário criado
        res.status(201).json({ id: results.insertId });
    });
});

// Rota GET - Buscar todos os funcionários
app.get('/funcionarios', (req, res) => {
    const query = 'SELECT * FROM funcionarios'; // Query SQL para buscar todos os registros

    connection.query(query, (error, results) => {
        if (error) {
            // Se der erro ao buscar, exibe o erro e responde com erro 500
            console.error('Erro ao buscar funcionários:', error);
            return res.status(500).json({ error: 'Erro ao buscar funcionários' });
        }

        // Se der certo, retorna os dados em formato JSON
        res.status(200).json(results);
    });
});

// Rota PUT - Atualizar funcionário por ID
app.put('/funcionarios/:id', (req, res) => {
    const id = req.params.id;        // Pega o ID enviado na URL
    const funcionario = req.body;    // Pega os dados novos enviados no corpo da requisição

    const query = 'UPDATE funcionarios SET ? WHERE id = ?'; // Query SQL para atualizar

    connection.query(query, [funcionario, id], (error, results) => {
        if (error) {
            // Se der erro na atualização, exibe e retorna erro 500
            console.error('Erro ao atualizar funcionário:', error);
            return res.status(500).json({ error: 'Erro ao atualizar funcionário' });
        }

        // Retorna mensagem de sucesso
        res.status(200).json({ message: 'Funcionário atualizado com sucesso' });
    });
});

// Rota DELETE - Remover funcionário por ID
app.delete('/funcionarios/:id', (req, res) => {
    const id = req.params.id; // Pega o ID enviado na URL

    const query = 'DELETE FROM funcionarios WHERE id = ?'; // Query SQL para deletar

    connection.query(query, id, (error, results) => {
        if (error) {
            // Se der erro, exibe no console e responde com erro 500
            console.error('Erro ao deletar funcionário:', error);
            return res.status(500).json({ error: 'Erro ao deletar funcionário' });
        }

        // Retorna mensagem de sucesso
        res.status(200).json({ message: 'Funcionário deletado com sucesso' });
    });
});
//Query = um pedido feito ao banco de dados
//=====================================================================================//

//==================================== (CAIO) =========================================//

//=============================== Criar (POST) =====================================//
app.post('/pacientes', (req, res) => {
    const paciente = req.body;
    const query = 'INSERT INTO pacientes SET ?';
    connection.query(query, paciente, (error, results) => {
        if (error) {
            console.error('Erro ao inserir paciente:', error);
            return res.status(500).json({ error: 'Erro ao inserir paciente' });
        }
        res.status(201).json({ id: results.insertId });
    });
});

//=============================== Ler (GET) ========================================//
app.get('/pacientes', (req, res) => {
    const query = 'SELECT * FROM pacientes';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Erro ao buscar pacientes:', error);
            return res.status(500).json({ error: 'Erro ao buscar pacientes' });
        }
        res.status(200).json(results);
    });
});

//=============================== Atualizar (PUT) ==================================//
app.put('/pacientes/:id', (req, res) => {
    const id = req.params.id;
    const paciente = req.body;
    const query = 'UPDATE pacientes SET ? WHERE id = ?';
    connection.query(query, [paciente, id], (error) => {
        if (error) {
            console.error('Erro ao atualizar paciente:', error);
            return res.status(500).json({ error: 'Erro ao atualizar paciente' });
        }
        res.status(200).json({ message: 'Paciente atualizado com sucesso' });
    });
});

//=============================== Deletar (DELETE) =================================//
app.delete('/pacientes/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM pacientes WHERE id = ?';
    connection.query(query, id, (error, results) => {
        if (error) {
            console.error('Erro ao deletar paciente:', error);
            return res.status(500).json({ error: 'Erro ao deletar paciente' });
        }
        res.status(200).json({ message: 'Paciente deletado com sucesso' });
    });
});
//==================================================================================//
//================================ (ADRIANO) =======================================//

//=============================== Ler (GET) ========================================//
app.get('/medicamentos', (req, res) => {
  connection.query('SELECT * FROM medicamentos', (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro no banco de dados' });
    res.json(results);
  });
});

//=============================== Criar (POST) =====================================//
app.post('/medicamentos', (req, res) => {
  const requiredFields = ['nome_med', 'cod_anvisa', 'lote_med', 'validade', 'dosagem', 'efeitos_adv', 'cond_armaz'];
  const missingFields = requiredFields.filter(field => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({ 
      error: "Campos obrigatórios faltando",
      missingFields
    });
  }

  const sql = `INSERT INTO medicamentos SET ?`;
  connection.query(sql, req.body, (err, results) => {
    if (err) return res.status(500).json({ error: "Erro no banco de dados" });
    res.status(201).json({ 
      success: true,
      id: results.insertId
    });
  });
});

//=============================== Atualizar (PUT) ==================================//
app.put('/medicamentos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  connection.query(
    'UPDATE medicamentos SET ? WHERE cod_med = ?',
    [req.body, id],
    (error, results) => {
      if (error) return res.status(500).json({ error: "Erro no banco de dados" });
      if (results.affectedRows === 0) return res.status(404).json({ error: "Medicamento não encontrado" });
      res.json({ success: true });
    }
  );
});

//=============================== Deletar (DELETE) =================================//
app.delete('/medicamentos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  connection.query(
    'DELETE FROM medicamentos WHERE cod_med = ?',
    [id],
    (error, results) => {
      if (error) return res.status(500).json({ error: "Erro no banco de dados" });
      if (results.affectedRows === 0) return res.status(404).json({ error: "Medicamento não encontrado" });
      res.json({ success: true });
    }
  );
});

//=====================================================================================//
