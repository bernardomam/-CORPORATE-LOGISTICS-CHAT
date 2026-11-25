# Finalização de conversas

JWT inclui versão HMAC derivada do hash da senha; alteração de senha invalida tokens antigos. Tokens anteriores à atualização também exigem novo login. Limite de 10 tentativas por 15 minutos persistido no PostgreSQL; depende de migração e configuração de IP confiável na Vercel. A conexão de autenticação precisa de acesso a AuthAttempt e hash; não conceder à role restrita.

GET /api/private-chats/:id/messages aceita limit (1–100, padrão 50) e before (UUID), retorna mensagens, total, temMais, proximoCursor. GET /api/chat-requests/minhas retorna solicitações enviadas e recebidas.

## Solicitações de grupo

POST /api/group-requests com name e memberIds (array de UUIDs, até 499); solicitante incluído automaticamente. GET /api/group-requests/minhas lista próprias. GET /api/group-requests lista empresa (TI). PATCH /api/group-requests/:id/aprovar e /rejeitar (TI, sem autoaprovação). Respostas sucesso e dados; 201 criação, 200 demais. Aprovação cria grupo e vincula pedido na mesma transação. Rejeição não cria grupo.

## Antes de publicar

Migração proposta cria GroupRequest e AuthAttempt, RLS e índices únicos parciais para integrantes ativos e solicitações pendentes (inclusive pares invertidos). Se houver duplicidades legadas, migração falha: revisar dados antes de aplicar, sem apagar histórico. Validar SQL, Prisma generate, políticas RLS, concorrência, aprovação/rejeição, expiração e rate limit em ambiente de teste. Não aplicar diretamente em produção. Atualizar verificação de tabelas da PR 111 e documentação central após integrar branches. Teste unitário: node --test tests/sessionVersion.test.js. Não executado nesta PR.
