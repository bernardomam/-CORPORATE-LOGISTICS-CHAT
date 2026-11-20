# CALLZUP - Plano de seguranca RLS

STATUS: RASCUNHO LOCAL

## Roles
- callzup_app: NOLOGIN, sem BYPASSRLS.
- callzup_runtime: LOGIN restrito, ainda nao criado.
- Proprietario das funcoes: identidade confiavel separada.

## Conexoes
- Autenticacao: acesso restrito para validar credenciais.
- Aplicacao: APP_DATABASE_URL com RLS.
- Administracao: somente migracoes e manutencao.

## Pendencias
- Definir a role de conexao.
- Revisar SECURITY DEFINER.
- Revisar permissoes e politicas.
- Testar isolamento entre empresas.
- Testar usuarios comuns e administradores.
- Preparar reversao.

## Seguranca
- Nao executar SQL no Supabase nesta etapa.
- Nao alterar a Vercel.
- Nao adicionar senhas neste arquivo.
