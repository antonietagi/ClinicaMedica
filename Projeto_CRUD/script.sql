CREATE DATABASE IF NOT EXISTS clinica;
USE clinica;

DROP TABLE IF EXISTS frota;
DROP TABLE IF EXISTS equipamentos;
DROP TABLE IF EXISTS pacientes;
DROP TABLE IF EXISTS funcionarios;
DROP TABLE IF EXISTS medicamentos;

CREATE TABLE IF NOT EXISTS frota (
    frota_id INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(10) NOT NULL UNIQUE,
    tipo_veiculo VARCHAR(50) NOT NULL,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    ano INT NOT NULL,
    km INT NOT NULL
);
INSERT INTO frota (placa, tipo_veiculo, marca, modelo, ano, km) VALUES
    ('ABC1D23', 'Veículos_pac', 'Toyota', 'Corolla', 2020, 15000),
    ('XYZ4E56', 'Veículos_admin', 'Volvo', 'FH16', 2018, 200000),
    ('LMN7O89', 'Moto', 'Honda', 'CB500F', 2021, 5000),
    ('PQR0S12', 'Ambulâncias', 'Mercedes-Benz', 'Sprinter', 2019, 30000);
/*======================================================================================================================================*/
CREATE TABLE IF NOT EXISTS equipamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    marca VARCHAR(100),
    modelo VARCHAR(100),
    numero_serie VARCHAR(100),
    data_aquisicao DATE,
    status ENUM('ativo', 'inativo', 'manutencao') DEFAULT 'ativo'
);
insert into equipamentos (nome, descricao, marca, modelo, numero_serie, data_aquisicao, status)
values ('Estetoscópio', 'Escuta sons corporais', 'Littman', 'Classic', '1234', '2025-03-04', 'ativo');
select * from equipamentos;
/*======================================================================================================================================*/
CREATE TABLE IF NOT EXISTS medicamentos (
    cod_med INT AUTO_INCREMENT PRIMARY KEY,
    nome_med VARCHAR(50) NOT NULL,
    cod_anvisa INT NOT NULL,
    lote_med INT NOT NULL,
    validade DATE NOT NULL,
    tarja VARCHAR(50),
    comp TEXT,
    dosagem TEXT NOT NULL,
    indic TEXT,
    contra_indic TEXT,
    efeitos_adv TEXT NOT NULL,
    cond_armaz TEXT
);

INSERT INTO medicamentos (cod_med, nome_med, cod_anvisa, lote_med, validade, tarja, comp, dosagem, indic, contra_indic, efeitos_adv, cond_armaz) 
VALUES (12345, 'Medicamento Teste', 54321, 12345, '2045-08-05', 'Vermelha', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A');
select * from medicamentos;
/*======================================================================================================================================*/
CREATE TABLE IF NOT EXISTS funcionarios (
    id INT AUTO_INCREMENT PRIMARY KEY,      
    nome VARCHAR(100),                      
    data_nasc DATE,                       
    cpf VARCHAR(14),                        
    cargo VARCHAR(50),                      
    celular VARCHAR(20)                     
);

INSERT INTO funcionarios (nome, data_nasc, cpf, cargo, celular)
VALUES('Giovanna Antonieta', '2005-02-18', '123.626.272-07', 'Dentista', '(11) 99899-1802');
/*======================================================================================================================================*/

CREATE TABLE IF NOT EXISTS pacientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    rg varchar (14)NOT NULL UNIQUE,
    celular VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL,
    nascimento DATE NOT NULL,
    sexo ENUM('masculino', 'feminino', 'outro') NOT NULL,
    convenio VARCHAR(50) NOT NULL
);
INSERT INTO pacientes (nome, cpf, rg, celular, email, nascimento, sexo, convenio)
VALUES ('Ana Paula Martins', '123.456.789-00','522743766', '(11) 91234-5678', 'ana.martins@gmail.com', '1987-05-10', 'feminino', 'Unimed'),
    ('Carlos Eduardo Lima', '987.654.321-00', '38235848X', '(21) 99876-5432', 'carlos.lima@hotmail.com', '1992-09-25', 'masculino', 'Bradesco Saúde'),
    ('Marina dos Santos', '456.789.123-00', '54574197X', '(31) 91111-2222', 'marina.santos@yahoo.com', '2000-12-15', 'feminino', 'SulAmérica');
select * from pacientes;
/*======================================================================================================================================*/