# Autenticação e mensagens

JWT_SECRET deve ter pelo menos 32 bytes após trim; configure uma chave aleatória forte na Vercel antes de publicar. JWT HS256 exige sub UUID, iat, exp e validade máxima de 8h. Tokens já emitidos continuam válidos até expirar após troca de senha; revogação depende de mudança futura de sessão. Rate limit continua local à instância.

- PATCH /api/auth/password: Bearer, currentPassword e newPassword; 200 sucesso, 400 dados inválidos, 401 senha incorreta, 409 conflito, 429 limite. Não retorna hash. Usa conexão de autenticação existente.
- GET /api/users/colegas: Bearer, usuários ativos da mesma empresa, exceto o próprio; retorna sucesso, total, usuarios (id, name, departmentId, department.name). Não retorna email.
- GET /api/my-groups/:id e GET /api/group-messages/:id: limit (1–100, padrão 50), before (UUID da mensagem mais antiga da página anterior). Retorna sucesso, total da página, mensagens em ordem cronológica, temMais e proximoCursor. Cursor de outro grupo retorna 404. Frontend deve buscar páginas antigas quando necessário.
- POST /api/group-messages/:id: middleware de horário alinhado com my-groups.

Testes: node --test tests/auth-pagination.test.js. Integração com banco, JWT real e frontend ainda pendente. Atualizar API.md após integrar PRs.
