# Validação do backend

Execute `npm run test:unit` para testes sem banco. Para HTTP, configure API_TEST_URL com a URL de um ambiente de teste Vercel e execute `npm run test:http`. Opcionalmente configure API_TEST_ADMIN_TOKEN, API_TEST_USER_TOKEN, API_TEST_OTHER_COMPANY_TOKEN, API_TEST_GROUP_ID e API_TEST_CHAT_ID com fixtures de teste. Nunca use tokens reais em commits. Tokens expiram em 8 horas. Casos sem configuração são ignorados, não aprovados.

## Critérios de aceite pendentes

- Testes HTTP sem token e com tokens de TI e funcionário.
- Em ambiente Supabase separado: cadastro, desativação, criação de grupo, integrantes, mensagens, respostas, reações, solicitações, aprovação/rejeição e concorrência. Validar persistência e limpar fixtures.
- Duas empresas reais de teste: verificar isolamento de leitura e escrita e RLS usando conexão restrita.
- Frontend: login, navegação, erros, histórico, envio e reações; verificar CORS na Vercel.
- Revisar a PR consolidada antes de merge; consultar API.md e TESTES.md.
- Não publicar nem executar testes de escrita na produção sem autorização.

A suíte HTTP desta PR não grava dados. Não confundir testes ignorados com sucesso. A cobertura de rotas documentadas não é cobertura funcional.
