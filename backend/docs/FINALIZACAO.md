# Finalização do backend

## Escopo confirmado em 26/11/2026
- Empresas: cadastro, alteração e inativação administrados no banco via PowerShell, sem interface no aplicativo.
- Conversas privadas: criação administrativa via PowerShell/banco; aplicativo lista conversas autorizadas e permite mensagens. Solicitações de criação pelo aplicativo não são requisito.
- Gestão de funcionários e grupos: confirmar escopo antes de remover rotas.
- Redefinição de senha pela TI permanece conforme PR #130.

Rotas existentes não foram removidas: revisar consumidores e decidir bloqueio de mutações administrativas antes da publicação. Não usar credenciais administrativas no frontend.

## Evidências estáticas da main
- PR #130 mesclado, workflow Backend tests aprovado no commit do PR.
- JWT limitado a 18h, middleware de horário, redefinição de senha com transação e revogação de sessões.
- Schema Prisma contém índices de mensagens por empresa, grupo e conversa/data, unicidade de participantes privados e pairKey por empresa. Issue #33: índices existem; desempenho ainda não medido.
- package.json contém scripts test, test:unit, test:http e test:api; não são evidência de execução atual.
- API.md documenta rotas, autenticação e configuração. Revisar discrepâncias com novo escopo.

## Aceite pendente
- [ ] Vercel: GET /api/status retorna 200 e banco disponível; CORS somente origens autorizadas.
- [ ] Login válido/inválido, bloqueio de usuário/empresa inativos, limite de tentativas e expiração às 18h.
- [ ] TI redefine senha de funcionário ativo da mesma empresa; usuário comum e TI de outra empresa não conseguem; token anterior rejeitado.
- [ ] Conversas provisionadas administrativamente: apenas participantes ativos da mesma empresa acessam; não participante recebe 403/404.
- [ ] Grupos, mensagens, histórico, paginação e ordenação estável; validar concorrência e rollback.
- [ ] PDF/JPEG: upload/download, rejeição de formato inválido e acesso cruzado; limpeza de objeto se registro falhar.
- [ ] RLS: testar com papel real da aplicação, não com proprietário/BYPASSRLS. Login inicial ainda usa Prisma direto; validar estratégia antes de ativar conexão RLS.
- [ ] Migrations em banco descartável, integridade e plano de recuperação.
- [ ] EXPLAIN (ANALYZE, BUFFERS) em ambiente de teste para consultas de histórico representativas.
- [ ] DER, dicionário e contrato API revisados; registrar evidências antes de fechar issues.

## Comandos de validação local (PowerShell)
Na pasta backend, com dependências instaladas e ambiente de teste configurado:
```powershell
npm run test:unit
npm run test:http
npm test
npx prisma validate
npx prisma migrate status
```
Não executar migrations ou testes com escrita em produção. Não compartilhar tokens, senhas ou URLs com credenciais.

## Smoke test remoto
```powershell
$base = Read-Host 'URL HTTPS do backend'
Invoke-RestMethod -Uri "$($base.TrimEnd('/'))/api/status" -Method Get
```
Um status saudável não comprova autenticação, RLS ou anexos. Registrar data, ambiente e resultados sem dados pessoais.
