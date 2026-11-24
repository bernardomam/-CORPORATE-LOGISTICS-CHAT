# API Callzup — documentação técnica

Contrato da main, com 33 operações HTTP. Base local: `http://localhost:3001`. Em produção utilize a URL do backend na Vercel configurada pela equipe.

## Arquitetura e autenticação

Express → rotas → middlewares → controllers → services → Prisma → Supabase. O JWT HS256 dura 8 horas. Envie `Authorization: Bearer TOKEN` nas rotas protegidas. A empresa e o perfil são obtidos da sessão validada no servidor. Login usa `senha`; cadastro usa `password`. Login, envio de mensagens e operações de solicitação de conversa são permitidos das 08:00 às 18:00 (exclusive), horário de Brasília. Histórico e reações não têm essa restrição.

## Configuração

Na pasta backend, instale as dependências existentes com `npm ci` (se houver lockfile) ou `npm install`, configure `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL` e `PORT` (opcional, padrão 3001). `APP_DATABASE_URL` e `USAR_CONEXAO_RLS` pertencem à configuração RLS, não ativar sem validação. Execute `npm run dev`. Não versione segredos.

## Endpoints

### GET /

Disponibilidade HTTP. Rota pública.

Resposta 200: `sucesso`, `mensagem`, `horarioServidor`, `fusoHorario`.

Erros possíveis: 500 Erro interno.

### GET /api/status

Disponibilidade com banco. Rota pública.

Resposta 200: `sucesso`, `mensagem`, `bancoDeDados`, `horarioServidor`, `fusoHorario`.

Erros possíveis: 500 Erro interno; 503 Banco indisponível.

### POST /api/auth/login

Entrar. Rota pública. Disponível das 08:00 às 18:00 (exclusivo), America/Sao_Paulo. JWT HS256 válido por 8 horas; envie Authorization: Bearer TOKEN nas rotas protegidas.

Campos obrigatórios: `email`, `senha`. Campos aceitos: `email` (email), `senha` (password).

```json
{
  "email": "usuario@example.com",
  "senha": "senha-exemplo-123"
}
```

Resposta 200: `sucesso`, `mensagem`, `token`, `usuario`.

Erros possíveis: 400 Dados inválidos; 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 413 Corpo excede 100 KB; 429 Limite de tentativas; 500 Erro interno.

### GET /api/auth/me

Usuário atual. Exige usuário e empresa ativos.

Resposta 200: `sucesso`, `usuario`.

Erros possíveis: 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 500 Erro interno.

### GET /api/companies

Listar própria empresa. Exige perfil IT_ADMIN.

Resposta 200: `sucesso`, `total`, `empresas`.

Erros possíveis: 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 500 Erro interno.

### GET /api/companies/{id}

Consultar própria empresa. Exige perfil IT_ADMIN.

Parâmetros de caminho: `id` (ID obrigatório).

Resposta 200: `sucesso`, `empresa`.

Erros possíveis: 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 404 Recurso não encontrado; 500 Erro interno.

### PUT /api/companies/{id}

Atualizar nome da empresa. Exige perfil IT_ADMIN.

Parâmetros de caminho: `id` (ID obrigatório).

Campos obrigatórios: `name`. Campos aceitos: `name` (string).

```json
{
  "name": "Nome de exemplo"
}
```

Resposta 200: `sucesso`, `mensagem`, `empresa`.

Erros possíveis: 400 Dados inválidos; 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 404 Recurso não encontrado; 409 Conflito; 413 Corpo excede 100 KB; 500 Erro interno.

### GET /api/users

Listar usuários. Exige perfil IT_ADMIN.

Resposta 200: `sucesso`, `total`, `usuarios`.

Erros possíveis: 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 500 Erro interno.

### POST /api/users

Cadastrar usuário. Exige perfil IT_ADMIN.

Campos obrigatórios: `name`, `email`, `password`. Campos aceitos: `name` (string, máximo 150), `email` (email), `password` (password, máximo 1024), `departmentId` (uuid, aceita null), `role` (string).

```json
{
  "name": "Nome de exemplo",
  "email": "usuario@example.com",
  "password": "senha-exemplo-123",
  "departmentId": "00000000-0000-4000-8000-000000000001",
  "role": "USER"
}
```

Resposta 201: `sucesso`, `mensagem`, `usuario`.

Erros possíveis: 400 Dados inválidos; 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 404 Recurso não encontrado; 409 Conflito; 413 Corpo excede 100 KB; 500 Erro interno.

### PATCH /api/users/{id}/desativar

Desativar usuário. Exige perfil IT_ADMIN. Não permite desativar a própria conta.

Parâmetros de caminho: `id` (ID obrigatório).

Resposta 200: `sucesso`, `mensagem`, `usuario`.

Erros possíveis: 400 Dados inválidos; 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 404 Recurso não encontrado; 409 Conflito; 413 Corpo excede 100 KB; 500 Erro interno.

### GET /api/groups

Listar grupos. Exige perfil IT_ADMIN.

Resposta 200: `sucesso`, `total`, `grupos`.

Erros possíveis: 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 500 Erro interno.

### POST /api/groups

Criar grupo. Exige perfil IT_ADMIN.

Campos obrigatórios: `name`. Campos aceitos: `name` (string, máximo 150), `memberIds` (array).

```json
{
  "name": "Nome de exemplo",
  "memberIds": []
}
```

Resposta 201: `sucesso`, `mensagem`, `grupo`.

Erros possíveis: 400 Dados inválidos; 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 404 Recurso não encontrado; 409 Conflito; 413 Corpo excede 100 KB; 500 Erro interno.

### PATCH /api/groups/{id}

Renomear grupo. Exige perfil IT_ADMIN.

Parâmetros de caminho: `id` (ID obrigatório).

Campos obrigatórios: `name`. Campos aceitos: `name` (string, máximo 150).

```json
{
  "name": "Nome de exemplo"
}
```

Resposta 200: `sucesso`, `mensagem`, `grupo`.

Erros possíveis: 400 Dados inválidos; 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 404 Recurso não encontrado; 409 Conflito; 413 Corpo excede 100 KB; 500 Erro interno.

### POST /api/groups/{id}/members

Adicionar integrante. Exige perfil IT_ADMIN.

Parâmetros de caminho: `id` (ID obrigatório).

Campos obrigatórios: `userId`. Campos aceitos: `userId` (uuid).

```json
{
  "userId": "00000000-0000-4000-8000-000000000001"
}
```

Resposta 201: `sucesso`, `mensagem`, `grupo`.

Erros possíveis: 400 Dados inválidos; 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 404 Recurso não encontrado; 409 Conflito; 413 Corpo excede 100 KB; 500 Erro interno.

### DELETE /api/groups/{id}/members/{userId}

Remover integrante. Exige perfil IT_ADMIN.

Parâmetros de caminho: `id` (ID obrigatório), `userId` (ID obrigatório).

Resposta 200: `sucesso`, `mensagem`, `resultado`.

Erros possíveis: 400 Dados inválidos; 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 404 Recurso não encontrado; 409 Conflito; 413 Corpo excede 100 KB; 500 Erro interno.

### PATCH /api/groups/{id}/desativar

Desativar grupo. Exige perfil IT_ADMIN.

Parâmetros de caminho: `id` (ID obrigatório).

Resposta 200: `sucesso`, `mensagem`, `grupo`.

Erros possíveis: 400 Dados inválidos; 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 404 Recurso não encontrado; 409 Conflito; 413 Corpo excede 100 KB; 500 Erro interno.

### GET /api/my-groups/{id}

Consultar histórico. Exige usuário e empresa ativos. Exige participação na conversa ou grupo. Sem paginação na versão atual.

Parâmetros de caminho: `id` (ID obrigatório).

Resposta 200: `sucesso`, `total`, `mensagens`.

Erros possíveis: 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 404 Recurso não encontrado; 500 Erro interno.

### POST /api/my-groups/{id}

Enviar mensagem ou resposta. Exige usuário e empresa ativos. Disponível das 08:00 às 18:00 (exclusivo), America/Sao_Paulo. Somente texto. A mensagem respondida deve pertencer à mesma conversa ou grupo.

Parâmetros de caminho: `id` (ID obrigatório).

Campos obrigatórios: `content`. Campos aceitos: `content` (string, máximo 10000), `replyToId` (uuid, aceita null).

```json
{
  "content": "Olá!",
  "replyToId": "00000000-0000-4000-8000-000000000001"
}
```

Resposta 201: `sucesso`, `mensagem`, `dados`.

Erros possíveis: 400 Dados inválidos; 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 404 Recurso não encontrado; 409 Conflito; 413 Corpo excede 100 KB; 500 Erro interno.

### POST /api/my-groups/{id}/messages/{mensagemId}/reactions

Adicionar ou atualizar reação. Exige usuário e empresa ativos.

Parâmetros de caminho: `id` (ID obrigatório), `mensagemId` (ID obrigatório).

Campos obrigatórios: `emoji`. Campos aceitos: `emoji` (string, máximo 32).

```json
{
  "emoji": "👍"
}
```

Resposta 200: `sucesso`, `mensagem`, `dados`.

Erros possíveis: 400 Dados inválidos; 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 404 Recurso não encontrado; 409 Conflito; 413 Corpo excede 100 KB; 500 Erro interno.

### DELETE /api/my-groups/{id}/messages/{mensagemId}/reactions

Remover própria reação. Exige usuário e empresa ativos.

Parâmetros de caminho: `id` (ID obrigatório), `mensagemId` (ID obrigatório).

Resposta 200: `sucesso`, `mensagem`, `dados`.

Erros possíveis: 400 Dados inválidos; 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 404 Recurso não encontrado; 409 Conflito; 413 Corpo excede 100 KB; 500 Erro interno.

### GET /api/group-messages/{id}

Consultar histórico. Exige usuário e empresa ativos. Exige participação na conversa ou grupo. Sem paginação na versão atual.

Parâmetros de caminho: `id` (ID obrigatório).

Resposta 200: `sucesso`, `total`, `mensagens`.

Erros possíveis: 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 404 Recurso não encontrado; 500 Erro interno.

### POST /api/group-messages/{id}

Enviar mensagem ou resposta. Exige usuário e empresa ativos. Disponível das 08:00 às 18:00 (exclusivo), America/Sao_Paulo. Somente texto. A mensagem respondida deve pertencer à mesma conversa ou grupo.

Parâmetros de caminho: `id` (ID obrigatório).

Campos obrigatórios: `content`. Campos aceitos: `content` (string, máximo 10000), `replyToId` (uuid, aceita null).

```json
{
  "content": "Olá!",
  "replyToId": "00000000-0000-4000-8000-000000000001"
}
```

Resposta 201: `sucesso`, `mensagem`, `dados`.

Erros possíveis: 400 Dados inválidos; 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 404 Recurso não encontrado; 409 Conflito; 413 Corpo excede 100 KB; 500 Erro interno.

### POST /api/group-messages/{id}/messages/{mensagemId}/reactions

Adicionar ou atualizar reação. Exige usuário e empresa ativos.

Parâmetros de caminho: `id` (ID obrigatório), `mensagemId` (ID obrigatório).

Campos obrigatórios: `emoji`. Campos aceitos: `emoji` (string, máximo 32).

```json
{
  "emoji": "👍"
}
```

Resposta 200: `sucesso`, `mensagem`, `dados`.

Erros possíveis: 400 Dados inválidos; 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 404 Recurso não encontrado; 409 Conflito; 413 Corpo excede 100 KB; 500 Erro interno.

### DELETE /api/group-messages/{id}/messages/{mensagemId}/reactions

Remover própria reação. Exige usuário e empresa ativos.

Parâmetros de caminho: `id` (ID obrigatório), `mensagemId` (ID obrigatório).

Resposta 200: `sucesso`, `mensagem`, `dados`.

Erros possíveis: 400 Dados inválidos; 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 404 Recurso não encontrado; 409 Conflito; 413 Corpo excede 100 KB; 500 Erro interno.

### GET /api/private-chats

Listar conversas privadas. Exige usuário e empresa ativos.

Resposta 200: `sucesso`, `total`, `conversas`.

Erros possíveis: 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 500 Erro interno.

### GET /api/private-chats/{id}/messages

Consultar histórico. Exige usuário e empresa ativos. Exige participação na conversa ou grupo. Sem paginação na versão atual.

Parâmetros de caminho: `id` (ID obrigatório).

Resposta 200: `sucesso`, `total`, `mensagens`.

Erros possíveis: 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 404 Recurso não encontrado; 500 Erro interno.

### POST /api/private-chats/{id}/messages

Enviar mensagem ou resposta. Exige usuário e empresa ativos. Disponível das 08:00 às 18:00 (exclusivo), America/Sao_Paulo. Somente texto. A mensagem respondida deve pertencer à mesma conversa ou grupo.

Parâmetros de caminho: `id` (ID obrigatório).

Campos obrigatórios: `content`. Campos aceitos: `content` (string, máximo 10000), `replyToId` (uuid, aceita null).

```json
{
  "content": "Olá!",
  "replyToId": "00000000-0000-4000-8000-000000000001"
}
```

Resposta 201: `sucesso`, `mensagem`, `dados`.

Erros possíveis: 400 Dados inválidos; 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 404 Recurso não encontrado; 409 Conflito; 413 Corpo excede 100 KB; 500 Erro interno.

### POST /api/private-chats/{id}/messages/{mensagemId}/reactions

Adicionar ou atualizar reação. Exige usuário e empresa ativos.

Parâmetros de caminho: `id` (ID obrigatório), `mensagemId` (ID obrigatório).

Campos obrigatórios: `emoji`. Campos aceitos: `emoji` (string, máximo 32).

```json
{
  "emoji": "👍"
}
```

Resposta 201: `sucesso`, `mensagem`, `dados`.

Erros possíveis: 400 Dados inválidos; 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 404 Recurso não encontrado; 409 Conflito; 413 Corpo excede 100 KB; 500 Erro interno.

### DELETE /api/private-chats/{id}/messages/{mensagemId}/reactions

Remover própria reação. Exige usuário e empresa ativos.

Parâmetros de caminho: `id` (ID obrigatório), `mensagemId` (ID obrigatório).

Resposta 200: `sucesso`, `removida`, `mensagem`.

Erros possíveis: 400 Dados inválidos; 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 404 Recurso não encontrado; 409 Conflito; 413 Corpo excede 100 KB; 500 Erro interno.

### POST /api/chat-requests

Solicitar conversa. Exige usuário e empresa ativos. Disponível das 08:00 às 18:00 (exclusivo), America/Sao_Paulo.

Campos obrigatórios: `requestedUserId`. Campos aceitos: `requestedUserId` (uuid).

```json
{
  "requestedUserId": "00000000-0000-4000-8000-000000000001"
}
```

Resposta 201: `sucesso`, `mensagem`, `solicitacao`.

Erros possíveis: 400 Dados inválidos; 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 404 Recurso não encontrado; 409 Conflito; 413 Corpo excede 100 KB; 500 Erro interno.

### GET /api/chat-requests

Listar solicitações. Exige perfil IT_ADMIN. Disponível das 08:00 às 18:00 (exclusivo), America/Sao_Paulo.

Resposta 200: `sucesso`, `total`, `solicitacoes`.

Erros possíveis: 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 500 Erro interno.

### PATCH /api/chat-requests/{id}/aprovar

Aprovar solicitação. Exige perfil IT_ADMIN. Disponível das 08:00 às 18:00 (exclusivo), America/Sao_Paulo. Não permite aprovar a própria solicitação.

Parâmetros de caminho: `id` (ID obrigatório).

Resposta 200: `sucesso`, `mensagem`, `solicitacaoId`, `conversa`, `conversaReutilizada`.

Erros possíveis: 400 Dados inválidos; 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 404 Recurso não encontrado; 409 Conflito; 413 Corpo excede 100 KB; 500 Erro interno.

### PATCH /api/chat-requests/{id}/rejeitar

Rejeitar solicitação. Exige perfil IT_ADMIN. Disponível das 08:00 às 18:00 (exclusivo), America/Sao_Paulo.

Parâmetros de caminho: `id` (ID obrigatório).

Resposta 200: `sucesso`, `mensagem`, `solicitacao`.

Erros possíveis: 400 Dados inválidos; 401 Não autenticado ou credenciais inválidas; 403 Acesso negado ou fora do horário, quando aplicável; 404 Recurso não encontrado; 409 Conflito; 413 Corpo excede 100 KB; 500 Erro interno.

## Exemplos de integração

```js
const resposta = await fetch(`${API_URL}/api/auth/login`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({email, senha}) });
const dados = await resposta.json();
if (!resposta.ok) throw new Error(dados.mensagem);
const token = dados.token;
const grupos = await fetch(`${API_URL}/api/private-chats`, {headers:{Authorization:`Bearer ${token}`}});
```

Erro típico: `{"sucesso":false,"mensagem":"Acesso negado."}`. O middleware de horário também pode retornar `codigo: FORA_DO_HORARIO`. Não exponha tokens em logs.

## Limitações e manutenção

A API atual aceita mensagens de texto, sem paginação. Objetos aninhados variam conforme a consulta; esta referência documenta os envelopes, não todos os campos internos. PR #110 altera middleware de horário; #111 trata RLS; #112 adiciona GET /api/health e GET /api/my-groups. Atualizar este documento após merge. Não executar testes de escrita em produção.
