# API Callzup — documentação técnica

Contrato proposto pelas PRs de desenvolvimento, com 50 operações HTTP. Não representa a versão publicada na main. Base local: `http://localhost:3001`. Em produção utilize a URL do backend na Vercel configurada pela equipe.

## Arquitetura e autenticação

Express → rotas → middlewares → controllers → services → Prisma → Supabase. O JWT HS256 dura até 8 horas, exige sub UUID, iat, exp e versão de sessão vinculada à senha. Alterar a senha invalida tokens anteriores; tokens emitidos antes desta atualização exigem novo login. O limite de autenticação é de 10 tentativas por janela de 15 minutos, persistido no PostgreSQL após migração. Envie `Authorization: Bearer TOKEN` nas rotas protegidas. A empresa e o perfil são obtidos da sessão validada no servidor. Login usa `senha`; cadastro usa `password`. Login, envio de mensagens e operações de solicitação de conversa são permitidos das 08:00 às 18:00 (exclusive), horário de Brasília. Histórico e reações não têm essa restrição.

## Configuração

Na pasta backend, instale as dependências existentes com `npm ci` (se houver lockfile) ou `npm install`, configure `DATABASE_URL`, `JWT_SECRET` (chave aleatória forte, mínimo 32 bytes), `FRONTEND_URL` e `PORT` (opcional, padrão 3001). `APP_DATABASE_URL` e `USAR_CONEXAO_RLS` pertencem à configuração RLS, não ativar sem validação. Execute `npm run dev`. Não versione segredos.

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

Campos obrigatórios: `name`, `email`, `password`. Campos aceitos: `name` (string, máximo 150), `email` (email), `password` (password, mínimo 8 caracteres, máximo 72 bytes UTF-8), `departmentId` (uuid, aceita null), `role` (string).

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

Consultar histórico. Exige usuário e empresa ativos. Exige participação na conversa ou grupo. Paginação: `limit` de 1 a 100 (padrão 50), `before` UUID da mensagem mais antiga da página anterior. Retorna a página em ordem cronológica; cursor de outro grupo ou conversa retorna 404.

Parâmetros de caminho: `id` (ID obrigatório).

Resposta 200: `sucesso`, `total` (quantidade da página), `mensagens`, `temMais`, `proximoCursor` (UUID ou null).

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

Consultar histórico. Exige usuário e empresa ativos. Exige participação na conversa ou grupo. Paginação: `limit` de 1 a 100 (padrão 50), `before` UUID da mensagem mais antiga da página anterior. Retorna a página em ordem cronológica; cursor de outro grupo ou conversa retorna 404.

Parâmetros de caminho: `id` (ID obrigatório).

Resposta 200: `sucesso`, `total` (quantidade da página), `mensagens`, `temMais`, `proximoCursor` (UUID ou null).

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

Consultar histórico. Exige usuário e empresa ativos. Exige participação na conversa ou grupo. Paginação: `limit` de 1 a 100 (padrão 50), `before` UUID da mensagem mais antiga da página anterior. Retorna a página em ordem cronológica; cursor de outro grupo ou conversa retorna 404.

Parâmetros de caminho: `id` (ID obrigatório).

Resposta 200: `sucesso`, `total` (quantidade da página), `mensagens`, `temMais`, `proximoCursor` (UUID ou null).

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
const conversas = await fetch(`${API_URL}/api/private-chats`, {headers:{Authorization:`Bearer ${token}`}});
```

Erro típico: `{"sucesso":false,"mensagem":"Acesso negado."}`. O middleware de horário também pode retornar `codigo: FORA_DO_HORARIO`. Não exponha tokens em logs.

## Endpoints adicionados nas PRs de desenvolvimento

### GET /api/health

Pública. Verifica disponibilidade HTTP sem consultar o banco. 200: `sucesso`, `mensagem`.

### PATCH /api/auth/password

JWT. Corpo: `{"currentPassword":"senha-atual","newPassword":"nova-senha-exemplo"}`. Nova senha diferente, mínimo 8 caracteres e máximo 72 bytes UTF-8. 200: `sucesso`, `mensagem`. 400, 401, 409, 429 ou 500. Após sucesso, fazer novo login.

### GET /api/users/colegas

JWT de usuário ativo. Lista colegas ativos da própria empresa, exceto o solicitante. 200: `sucesso`, `total`, `usuarios` (id, name, departmentId, department com name ou null).

### GET /api/users/{id}

TI. UUID do usuário da própria empresa. 200: `sucesso`, `usuario`. 400, 401, 403, 404.

### PATCH /api/users/{id}

TI. Corpo parcial com `name`, `email`, `departmentId` (UUID ou null), `role` (USER ou IT_ADMIN). Exemplo: `{"name":"Ana","departmentId":null}`. Não permite remover próprio perfil TI. 200: `sucesso`, `usuario`. 400, 401, 403, 404, 409.

### PATCH /api/users/{id}/reativar

TI. Sem corpo. 200: `sucesso`, `usuario`. Não restaura participações encerradas. 400, 401, 403, 404.

### GET /api/departments

TI. 200: `sucesso`, `total`, `departamentos`.

### GET /api/departments/{id}

TI. 200: `sucesso`, `departamento`. 400, 401, 403, 404.

### POST /api/departments

TI. Corpo `{"name":"Logística"}` (1–150 caracteres após trim). 201: `sucesso`, `departamento`. 400, 401, 403, 409.

### PATCH /api/departments/{id}

TI. Corpo `{"name":"Operações"}`. 200: `sucesso`, `departamento`. 400, 401, 403, 404, 409.

### GET /api/my-groups

JWT. Lista grupos ativos da própria empresa com participação ativa do usuário. 200: `sucesso`, `total`, `grupos`.

### GET /api/chat-requests/minhas

JWT. Lista solicitações enviadas e recebidas na própria empresa, em ordem decrescente de criação. 200: `sucesso`, `total`, `solicitacoes`. Não possui middleware de horário.

### POST /api/group-requests

JWT. Corpo `{"name":"Projeto","memberIds":["00000000-0000-4000-8000-000000000001"]}`. Nome até 150 caracteres, até 499 IDs fornecidos; solicitante incluído automaticamente. Participantes ativos da mesma empresa. 201: `sucesso`, `dados` (solicitação). 400, 401, 403, 409.

### GET /api/group-requests/minhas

JWT. Lista próprias solicitações. 200: `sucesso`, `dados` (array).

### GET /api/group-requests

TI. Lista solicitações da empresa. 200: `sucesso`, `dados` (array).

### PATCH /api/group-requests/{id}/aprovar

TI. Sem corpo. Não pode analisar própria solicitação. Cria grupo e vincula pedido em uma transação. 200: `sucesso`, `dados` (solicitação com groupId). 400, 401, 403, 404, 409.

### PATCH /api/group-requests/{id}/rejeitar

TI. Sem corpo. Não pode analisar própria solicitação. 200: `sucesso`, `dados` (solicitação rejeitada). 400, 401, 403, 404, 409.

## Objetos de resposta

Campos usuais (a projeção varia por operação; campos opcionais podem estar ausentes ou null):

| Objeto | Campos |
|---|---|
| Usuario | id, name, email, role, status, companyId, departmentId, createdAt; listagem administrativa inclui department.name |
| Sessão /me | id, name, email, role, companyId, departmentId |
| Empresa | id, name, status, createdAt, updatedAt (conforme projeção) |
| Departamento | id, name, companyId, createdAt |
| Grupo | id, name, companyId, status, createdAt; members com id, groupId, userId, joinedAt, leftAt e user conforme consulta |
| Mensagem | id, content, type, companyId, userId, groupId, privateChatId, replyToId, createdAt; sender, replyTo, reactions |
| Reação | id, messageId, userId, emoji, createdAt; user conforme consulta |
| Conversa privada | id, companyId, createdById, pairKey, status, createdAt, updatedAt; members e última mensagem conforme consulta |
| Solicitação privada | id, companyId, requesterId, requestedUserId, reviewedById, status, createdAt, reviewedAt; requester e requestedUser conforme consulta |
| Solicitação de grupo | id, companyId, requesterId, reviewedById, groupId, name, memberIds, status, createdAt, reviewedAt |

Status de usuários, empresas, grupos e conversas: ACTIVE ou INACTIVE. Solicitações: PENDING, APPROVED, REJECTED. Perfis: USER e IT_ADMIN. IDs são UUIDs. Datas de registros são serializadas em ISO 8601. Nunca retornar passwordHash.

## Exemplo de paginação

```js
const headers = {Authorization: 'Bearer '+token};
const url = API_URL+'/api/my-groups/'+grupoId;
const primeira = await fetch(url+'?limit=50',{headers});
if (!primeira.ok) throw new Error('Falha ao carregar mensagens');
const pagina = await primeira.json();
if (pagina.temMais) {
  const antiga = await fetch(url+'?limit=50&before='+encodeURIComponent(pagina.proximoCursor),{headers});
  if (!antiga.ok) throw new Error('Falha ao carregar histórico');
  const historico = await antiga.json();
  // Inserir historico.mensagens antes de pagina.mensagens.
}
```

## Erros e permissões

400 validação; 401 sessão ou credenciais inválidas; 403 acesso negado ou horário; 404 recurso ausente; 409 conflito; 413 corpo maior que 100 KB; 429 limite de autenticação (Retry-After em segundos); 500 falha interna; 503 banco indisponível no status. A resposta de erro normalmente contém sucesso:false e mensagem. O middleware de horário inclui codigo FORA_DO_HORARIO; nem todo erro de horário inclui esse campo. TI não recebe acesso automático a mensagens de grupos ou conversas dos quais não participa. CORS permite origens configuradas em FRONTEND_URL, separadas por vírgula. OPTIONS retorna 204 para origem permitida e 403 para origem não permitida.

## Implantação e limitações

A migração da PR 117 é requisito para autenticação distribuída, solicitações de grupo e índices únicos parciais. Validar duplicidades existentes antes de aplicar; não apagar histórico. RLS e conexão restrita ainda precisam de testes. Não executar testes de escrita em produção. Apenas texto é aceito pelos endpoints de envio, embora o schema tenha IMAGE e FILE. Não há exclusão de departamentos. Reativar usuário não restaura grupos. O fluxo de solicitação de grupo não aplica restrição de horário no código atual. A documentação descreve o código proposto, não certifica funcionamento HTTP nem aprovação das PRs.

## Manutenção

Este é o documento central. Atualize-o junto com qualquer alteração de rota, corpo, status ou permissão. Execute o teste de cobertura de rotas em backend com node --test tests/api-docs.test.js. A cobertura de rotas não substitui testes de contrato HTTP. As PRs 110, 111, 113 e 114 têm branches separadas; revisar conflitos e integrar seus testes antes de publicar.
