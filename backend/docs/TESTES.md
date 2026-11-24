# Testes automatizados

Node 22 e GitHub Actions. Execute na pasta backend:
- npm run test:unit — validação de horário, erros, sessão, paginação, campos administrativos e documentação.
- npm test — todas as suítes, com dependências instaladas.
- npm run test:http — testes HTTP com API_TEST_URL apontando para ambiente de teste Vercel.

Variáveis opcionais para HTTP: API_TEST_ADMIN_TOKEN, API_TEST_USER_TOKEN, API_TEST_OTHER_COMPANY_TOKEN, API_TEST_GROUP_ID, API_TEST_CHAT_ID. Use contas de teste, não tokens de produção. Tokens expiram em 8 horas. Sem configuração, testes HTTP são ignorados, não aprovados.

A suíte verifica ausência de JWT em todas as 46 operações protegidas e restrições de TI, além dos cenários HTTP anteriores. Não execute contra produção: mesmo requisições que deveriam ser negadas podem ter efeitos se houver falha de autorização.

Pendências: testes de escrita autenticada, aprovação/rejeição, concorrência, troca de senha e revogação reais, rate limit distribuído, migrações e RLS em banco isolado. A suíte não prova cobertura funcional de 100%. Não aplicar migrações automaticamente em CI. GitHub Actions executa testes unitários, sintaxe e integração de middleware; HTTP exige ambiente configurado.
