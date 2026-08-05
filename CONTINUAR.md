# CONTINUAR.md — contexto e próximos passos

> Documento de handoff. Contém tudo que foi feito, por quê, o que falta e
> como verificar. Não depende de nenhuma conversa anterior.
> Apague este arquivo quando o projeto estiver entregue.

---

## 1. O que é este projeto

Sistema de gestão comercial (área **Enterprise**) para escuderias do
programa **F1 in Schools**. É o Projeto Integrador do Curso Técnico em
Desenvolvimento de Sistemas — SESI/SENAI.

Domínio: captação de patrocínio. Empresas são cadastradas e acompanhadas
num funil de vendas (CRM) até virarem parceiras. Depois entram controle
orçamentário e contrapartidas de marketing.

---

## 2. Por que a estrutura mudou

Numa atividade anterior da disciplina foi construído um projeto-modelo
(**almoxarifado de ferramentas**) com esta estrutura:

- pastas separadas `api/` e `web/`
- um arquivo de tipos compartilhado entre back e front
- CRUD completo na API
- tela React consumindo a API
- `.gitignore`, README explicando o projeto, commits com mensagem clara

O professor pediu para levar essa mesma estrutura para o PI, escolhendo
um recurso do domínio e refazendo: **interface de tipos → rotas na API →
tela no React**, começando pela listagem e depois o cadastro.

**Recurso escolhido: patrocinador.** É o núcleo do domínio Enterprise e
já tinha tabela pronta no `banco.sql`.

Antes, o PI tinha `server.js` e `src/` soltos na raiz, sem front nenhum.

---

## 3. Por que tem JavaScript e TypeScript no mesmo repositório

Essa mistura é intencional e **não** é um erro de organização.

`api/` e `web/` são dois projetos Node independentes. Cada um tem seu
próprio `package.json` e seu próprio `node_modules`. Eles não compartilham
código — conversam por HTTP (`fetch`). Nada impede que cada um use uma
linguagem diferente, e isso é comum no mercado.

- **`api/` continua em JavaScript** porque é o backend que já existia.
  Reescrever em TypeScript significaria refazer trabalho já entregue e
  arriscar quebrar o que funcionava.
- **`web/` é TypeScript** porque foi criado agora com o template
  React + Vite, que é o mesmo do projeto-modelo do professor.

**Sobre "interface de tipos":** o modelo usa `interface` do TypeScript.
JavaScript não tem `interface`. A solução foi declarar os mesmos tipos com
**JSDoc** em `api/src/tipos.js` (`@typedef`). O VS Code entrega o mesmo
autocomplete e o mesmo aviso de erro. O `web/src/tipos.ts` é o espelho em
TypeScript.

⚠️ **Os dois arquivos precisam andar juntos.** Mudou um campo em
`api/src/tipos.js`, mude em `web/src/tipos.ts` também.

Se o professor exigir uma linguagem só, a conversão mais barata é levar o
front para JavaScript puro: renomear `.tsx` → `.jsx`, `.ts` → `.js`,
apagar as anotações de tipo e os `tsconfig*.json`. O caminho contrário
(API para TS) é bem mais trabalhoso.

---

## 4. Estrutura atual

```
ds_f1_enterprise/
├── .gitignore              # node_modules, dist, .env
├── README.md               # documentação do projeto (para o professor)
├── CONTINUAR.md            # este arquivo (apagar na entrega)
├── banco.sql               # NÃO FOI ALTERADO
├── api/                    # backend Fastify + PostgreSQL (JavaScript)
│   ├── .env.example        # copiar para .env
│   ├── package.json
│   ├── referencias.http
│   ├── server.js
│   └── src/
│       ├── tipos.js                              # tipos do domínio (JSDoc)
│       ├── controllers/
│       │   ├── usuariosControllers.js            # ORIGINAL, não tocado
│       │   └── patrocinadoresControllers.js      # NOVO
│       ├── middlewares/
│       │   ├── errorHandler.js                   # ORIGINAL, não tocado
│       │   ├── jwtVerify.js                      # ORIGINAL, não tocado
│       │   ├── usuariosValidate.js               # ORIGINAL, não tocado
│       │   └── patrocinadoresValidate.js         # NOVO
│       └── routes/
│           ├── usuarios.js                       # ORIGINAL, não tocado
│           └── patrocinadores.js                 # NOVO
└── web/                    # frontend React + TypeScript + Vite (NOVO)
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig*.json
    └── src/
        ├── main.tsx
        ├── App.tsx         # tela de patrocinadores
        ├── App.css
        ├── index.css
        └── tipos.ts        # espelho de api/src/tipos.js
```

### O único arquivo original modificado: `api/server.js`

Três mudanças, todas aditivas:

1. registro do `@fastify/cors` — sem isso o navegador bloqueia as chamadas
   do React (que roda em `localhost:5173`) para a API (`localhost:3000`);
2. registro de `rotasPatrocinador`;
3. credenciais do banco lidas de variável de ambiente, com os mesmos
   valores antigos como padrão (`localhost` / `postgres` / `senai` / `5432`).

Todo o resto do código original está **byte a byte idêntico**. `banco.sql`
também.

---

## 5. Tarefa 1 — verificar se está tudo funcionando

Uma rodada de testes já foi feita contra um Postgres real e revelou dois
problemas, **ambos já corrigidos** no código (ver "pontos de atenção"
abaixo). O que **não** foi feito: re-testar depois da correção, e abrir o
front no navegador. Rode e corrija o que aparecer antes de seguir para o
item 6.

### 5.1 Banco

```bash
createdb ds_f1_enterprise
psql -d ds_f1_enterprise -f banco.sql
```

Confirme que existem as tabelas `usuarios`, `patrocinadores`,
`financeiro_meta`, `contrato_valor`, `contrapartida_tarefa` e os tipos
`status_kanban` e `status_tarefa`.

### 5.2 API

```bash
cd api
cp .env.example .env      # ajuste usuário/senha do seu Postgres
npm install
npm run dev
```

Esperado no terminal: `API no ar em http://localhost:3000`

### 5.3 Testar os endpoints

Use o `api/referencias.http` (extensão REST Client do VS Code) ou `curl`.
Confira **status code e corpo** de cada caso:

| # | Requisição | Esperado |
|---|-----------|----------|
| 1 | `GET /patrocinadores` | 200, array (vazio no começo) |
| 2 | `POST /patrocinadores` com `razao_social` + `cnpj` | 201, objeto criado com `status_crm: "Prospecção"` |
| 3 | `POST /patrocinadores` só com `cnpj` | 400, `{ erro: "O campo razao_social é obrigatório." }` |
| 4 | `POST /patrocinadores` com `status_crm: "Quase la"` | 400, mensagem listando as etapas válidas |
| 5 | `GET /patrocinadores/1` | 200, o objeto |
| 6 | `GET /patrocinadores/999` | 404, `{ erro: "Patrocinador não encontrado." }` |
| 7 | `PUT /patrocinadores/1` com `{"status_crm":"Proposta Enviada"}` | 200, objeto com o status novo e **os demais campos preservados** |
| 8 | `GET /patrocinadores?status=Prospecção` | 200, só os dessa etapa |
| 9 | `DELETE /patrocinadores/1` | 204, sem corpo |
| 10 | `DELETE /patrocinadores/1` de novo | 404 |
| 11 | `GET /usuario` sem token | 401 |

**Ponto crítico de atenção — o ENUM `status_kanban`.** A coluna
`status_crm` é um ENUM do Postgres, não texto. Quando o valor chega por
parâmetro (`$8`), o driver manda como `text` e o Postgres recusa com
`column "status_crm" is of type status_kanban but expression is of type text`.
Por isso as queries usam `$8::status_kanban` e `$1::status_kanban`. Se
aparecer erro parecido em alguma query nova, o cast é a solução.

Os valores do ENUM **têm acento** (`Prospecção`, `Em Negociação`,
`Não Sucedida`). Precisam bater exatamente entre `banco.sql`,
`api/src/tipos.js` e `web/src/tipos.ts`.

**Segundo ponto de atenção — CORS.** O `@fastify/cors` por padrão libera
só `GET`, `HEAD` e `POST`. Como a tela usa `PUT` e `DELETE`, o `server.js`
lista os métodos explicitamente. Se o navegador reclamar de CORS em
alguma rota nova, confira essa lista.

### 5.4 Front

```bash
cd web
npm install
npm run dev
```

Abre em `http://localhost:5173`. Verifique no navegador:

- a lista carrega (com a API no ar);
- com a API desligada, aparece a mensagem de erro, não uma tela branca;
- cadastrar adiciona o item na lista sem precisar recarregar;
- cadastrar sem razão social mostra a mensagem de erro vinda da API;
- trocar a etapa no `select` de um card persiste (recarregue a página);
- remover pede confirmação e some da lista;
- o filtro por etapa refaz a busca;
- o console do navegador está limpo.

---

## 6. Tarefa 2 — corrigir bugs no código de usuários

Três problemas que já existiam no código original e **não** foram
alterados, para não misturar assuntos. Todos em
`api/src/controllers/usuariosControllers.js`. Faça em commit separado.

1. **Senha gravada em texto puro.** `post_u` insere `body.senha_hash`
   direto no banco. O `bcrypt` está importado mas nunca é usado no
   cadastro. Deve ser `await bcrypt.hash(senha, 10)` antes do INSERT.
   O mesmo vale para o `put_u`.

2. **Login nunca funciona.** `login_u` compara `body.senha`, mas o
   middleware `validarLogin` exige `body.senha_hash`. Os dois lados
   precisam usar o mesmo nome de campo — o mais correto é o cliente
   mandar `senha` (texto puro) e o banco guardar o hash.

3. **`put_u` quebra em ID inexistente.** Depois do
   `reply.status(404).send(...)` falta um `return`. A execução continua e
   estoura em `resultado.rows[0].nome`.

---

## 7. Tarefa 3 — próximas telas

Nesta ordem, um commit por etapa:

1. **Tela de login** no front, guardando o token JWT.
2. **Proteger as rotas de patrocinadores.** Hoje estão abertas de
   propósito — a tela React ainda não faz login, e travar antes disso
   quebraria a listagem. Em `api/src/routes/patrocinadores.js` existe um
   import comentado de `verificarJWT` e a instrução de como ligar. Depois
   do login pronto, ative e mande o header
   `Authorization: Bearer <token>` nos `fetch` do front.
3. **Dashboard financeiro** — tabelas `financeiro_meta` e
   `contrato_valor`, meta x arrecadado.
4. **Contrapartidas de marketing** — tabela `contrapartida_tarefa`,
   geradas quando um patrocinador chega em `Parceria Fechada`.
5. **Visão Kanban** do funil, no lugar da lista simples.

Para cada recurso novo, siga o mesmo caminho: tipo em `tipos.js` +
`tipos.ts` → controller → validate → routes → registrar no `server.js` →
tela no React.

---

## 8. Padrão de código a manter

- Controllers exportam um objeto (`patrocinadoresController`) com um
  método por operação; a rota só chama o método e repassa o `sql`.
- Validação fica em middleware `preHandler`, nunca dentro do controller.
- Erro de cliente: `{ erro: "mensagem" }` com 400 ou 404.
  Sucesso: 200, 201 no POST, 204 no DELETE.
- Query sempre parametrizada (`$1`, `$2`), nunca concatenando string.
- `UPDATE` usa `COALESCE` para permitir atualização parcial.
- Nomes em português, seguindo o resto do projeto.

---

## 9. Commits sugeridos

Se ainda não commitou a reorganização:

```
chore: reorganiza projeto em api/ e web/
feat(api): adiciona tipos do dominio em tipos.js
feat(api): adiciona CRUD de patrocinadores
feat(api): libera CORS para o front
feat(web): inicializa React com Vite e TypeScript
feat(web): tela de listagem de patrocinadores
feat(web): formulario de cadastro de patrocinador
docs: atualiza README com estrutura e endpoints
```

Depois:

```
fix(api): aplica hash bcrypt na senha do usuario
fix(api): corrige campo de senha no login
fix(api): adiciona return apos 404 no update de usuario
```

Confirme que `.env` e `node_modules/` **não** estão sendo versionados
(`git status` limpo depois do `npm install`). O `.env.example` vai para o
repositório; o `.env` não.
