# Departamentos e usuários

Todas as rotas abaixo exigem JWT e IT_ADMIN. A empresa é obtida da sessão. IDs são UUIDs. Não envie companyId.

| Método | Rota | Corpo | Sucesso |
|---|---|---|---|
| GET | /api/departments | — | 200 sucesso, total, departamentos |
| GET | /api/departments/:id | — | 200 sucesso, departamento |
| POST | /api/departments | {"name":"TI"} | 201 sucesso, departamento |
| PATCH | /api/departments/:id | {"name":"Tecnologia"} | 200 sucesso, departamento |
| GET | /api/users/:id | — | 200 sucesso, usuario |
| PATCH | /api/users/:id | {"name":"Nome","email":"teste@example.com","departmentId":null,"role":"USER"} | 200 sucesso, usuario |
| PATCH | /api/users/:id/reativar | — | 200 sucesso, usuario |

PATCH de usuário aceita um ou mais campos indicados. departmentId null remove o vínculo. Não permite remover o próprio perfil de TI. Reativar não restaura automaticamente grupos encerrados. Departamentos não são excluídos para preservar vínculos. Erros: 400 validação, 401 autenticação, 403 permissão, 404 registro inexistente ou de outra empresa, 409 duplicidade, 500 falha interna. Senhas não são retornadas nem editadas por este endpoint.

Teste unitário: `node --test tests/adminValidation.test.js` na pasta backend. Integração com Supabase ainda precisa ser executada. Atualizar API.md da PR 113 após integração das branches.
