CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TYPE status_kanban AS ENUM ( 'Prospecção', 'Contato Realizado', 'Proposta Enviada', 'Em Negociação', 'Parceria Fechada', 'Não Sucedida', 'Ex-Parceiro' );

CREATE TABLE patrocinadores (
    id SERIAL PRIMARY KEY,
    razao_social VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    nome_contato VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    telefone VARCHAR(20),
    nicho VARCHAR(255),
    area_colaboracao VARCHAR(100),
    status_crm status_kanban DEFAULT 'Prospecção',
   	usuario_id INT REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE financeiro_meta (
    id SERIAL PRIMARY KEY,
    custo_estimado NUMERIC(10,2) NOT NULL,
    meta_arrecadacao NUMERIC(10,2) NOT NULL,
    ano_temporada INT NOT NULL
);

CREATE TABLE contrato_valor (
    id SERIAL PRIMARY KEY,
    valor_dinheiro NUMERIC(10,2) DEFAULT 0,
    valor_permuta NUMERIC(10,2) DEFAULT 0,
    patrocinador_id INT UNIQUE REFERENCES patrocinadores(id) ON DELETE CASCADE
);

CREATE TYPE status_tarefa AS ENUM ('Pendente', 'Em Produção', 'Aguardando Aprovação', 'Entregue');

CREATE TABLE contrapartida_tarefa (
    id SERIAL PRIMARY KEY,
    descricao_tarefa TEXT NOT NULL,
    status_entrega VARCHAR(50) DEFAULT 'Pendente',
    patrocinador_id INT REFERENCES patrocinadores(id) ON DELETE CASCADE
);