# Recuperação da produção

- Confirmar migrações pendentes com `npx prisma migrate status`.
- Revisar e aplicar a migração de AuthAttempt e GroupRequest após autorização e backup.
- Validar RLS e permissões.
- Executar `npm run test:unit` e `node --test tests/startup.test.js` após instalar dependências.
- Validar `/api/health`, `/api/status` e login.
- Revisar logs do frontend e NEXT_PUBLIC_API_URL, sem divulgar segredos.

Nenhuma migração ou validação de produção foi executada por este documento.
