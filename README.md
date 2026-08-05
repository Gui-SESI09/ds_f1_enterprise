# Sistema de Gestão Enterprise — F1 in Schools

Sistema full stack de gestão comercial para escuderias do programa
**F1 in Schools**. Centraliza a captação de patrocínio: cadastro de
empresas, acompanhamento do funil de vendas (CRM), controle
orçamentário e contrapartidas de marketing.

Desenvolvido como Projeto Integrador do Curso Técnico em
Desenvolvimento de Sistemas — SESI/SENAI.

---

## Problema vs. Solução

- **O gargalo:** captação manual e descentralizada, perda de contatos
  comerciais e esquecimento de contrapartidas de marketing.
- **A solução:** uma única plataforma com rastreabilidade das
  negociações, controle do teto orçamentário e automação de tarefas.

---

## Tecnologias

- **Backend:** Node.js, Fastify, PostgreSQL
- **Frontend:** React, TypeScript, Vite
- **Autenticação:** JWT (`@fastify/jwt`) e bcrypt
- **Controle de versão:** Git e GitHub

---

## Estrutura do repositório

```
ds_f1_enterprise/
├── api/                 # Backend (Fastify + PostgreSQL)
│   ├── src/
│   │   ├── controllers/ # Regra de cada recurso
│   │   ├── middlewares/ # Validação, JWT, tratamento de erro
│   │   ├── routes/      # Definição das rotas
│   │   └── tipos.js     # Tipos do domínio (JSDoc)
│   ├── server.js
│   └── referencias.http # Requisições prontas para testar
├── web/                 # Frontend (React + TypeScript)
│   └── src/
│       ├── tipos.ts     # Espelho de api/src/tipos.js
│       └── App.tsx      # Tela de patrocinadores
├── banco.sql            # Script de criação das tabelas
└── README.md
```

---

## Como rodar

Pré-requisitos: Node.js 20 ou superior e PostgreSQL.

**1. Banco de dados**

```bash
createdb ds_f1_enterprise
psql -d ds_f1_enterprise -f banco.sql
```

**2. Backend**

```bash
cd api
cp .env.example .env    # ajuste usuário e senha do Postgres
npm install
npm run dev
```

A API sobe em http://localhost:3000

**3. Frontend** (em outro terminal)

```bash
cd web
npm install
npm run dev
```

A tela abre em http://localhost:5173

---

## Endpoints da API

### Patrocinadores

| Método | Rota                 | Descrição                              |
|--------|----------------------|----------------------------------------|
| GET    | /patrocinadores      | Lista todos (filtro `?status=`)        |
| GET    | /patrocinadores/:id  | Busca um patrocinador                  |
| POST   | /patrocinadores      | Cadastra um patrocinador               |
| PUT    | /patrocinadores/:id  | Atualiza (usado para mover no funil)   |
| DELETE | /patrocinadores/:id  | Remove um patrocinador                 |

### Usuários

| Método | Rota            | Descrição                          |
|--------|-----------------|------------------------------------|
| POST   | /api/auth/login | Autentica e devolve o token JWT    |
| GET    | /usuario        | Lista usuários (requer token)      |
| POST   | /usuario        | Cadastra usuário (requer token)    |
| PUT    | /usuario/:id    | Atualiza usuário (requer token)    |
| DELETE | /usuario/:id    | Remove usuário (requer token)      |

### Etapas do funil (`status_crm`)

`Prospecção` · `Contato Realizado` · `Proposta Enviada` ·
`Em Negociação` · `Parceria Fechada` · `Não Sucedida` · `Ex-Parceiro`

---

## Estado atual

- [x] Autenticação com JWT
- [x] CRUD de patrocinadores na API
- [x] Tela de listagem de patrocinadores
- [x] Tela de cadastro de patrocinadores
- [ ] Tela de login no front
- [ ] Dashboard financeiro (meta x arrecadado)
- [ ] Contrapartidas de marketing
