
-- CALLZUP
-- 05_testes.sql
--
-- ROTEIRO DE TESTES RLS
-- NÃO EXECUTAR NA PRODUÇÃO.
--
-- Pré-requisitos:
-- - Banco de testes separado da produção.
-- - Role de aplicação configurada.
-- - Políticas RLS completas.
-- - Usuários de teste de duas empresas diferentes.
-- - Grupos e conversas privadas de teste.
--
-- Este arquivo contém verificações de configuração.
-- Os testes de isolamento ainda exigem dados
-- controlados e uma conexão de teste sem BYPASSRLS.

-- ============================================
-- 1. CONFERIR AS TABELAS PROTEGIDAS
-- ============================================

SELECT
    schemaname,
    tablename,
    rowsecurity AS rls_ativo,
    forcerowsecurity AS rls_forcado
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
      'Company',
      'Department',
      'User',
      'Group',
      'GroupMember',
      'PrivateChat',
      'PrivateChatMember',
      'ChatRequest',
      'Message',
      'MessageReaction'
  )
ORDER BY tablename;

-- ============================================
-- 2. CONFERIR A ROLE DA APLICAÇÃO
-- ============================================

SELECT
    rolname,
    rolcanlogin,
    rolbypassrls,
    rolsuper
FROM pg_roles
WHERE rolname = 'callzup_app';

-- Resultado esperado:
-- rolbypassrls = false
-- rolsuper = false

-- ============================================
-- 3. LISTAR AS POLÍTICAS CRIADAS
-- ============================================

SELECT
    tablename,
    policyname,
    roles,
    cmd,
    permissive
FROM pg_policies
WHERE schemaname = 'public'
  AND policyname LIKE 'callzup_%'
ORDER BY tablename, cmd, policyname;

-- ============================================
-- 4. CONFERIR PERMISSÕES DA ROLE
-- ============================================

SELECT
    table_name,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND grantee = 'callzup_app'
ORDER BY table_name, privilege_type;

-- ============================================
-- 5. CONFERIR FUNÇÕES AUXILIARES
-- ============================================

SELECT
    n.nspname AS schema_nome,
    p.proname AS funcao,
    p.prosecdef AS security_definer
FROM pg_proc p
JOIN pg_namespace n
    ON n.oid = p.pronamespace
WHERE n.nspname = 'callzup_internal'
  AND p.proname IN (
      'usuario_atual_id',
      'empresa_atual_id'
  )
ORDER BY p.proname;

-- Resultado esperado:
-- security_definer = false

-- ============================================
-- 6. VERIFICAR O CONTEXTO TRANSACIONAL
-- ============================================

-- Executar somente em banco de testes,
-- usando uma conexão de aplicação autorizada.
--
-- Substituir os UUIDs por identificadores
-- de usuários e empresas criados para teste.
--
-- BEGIN;
--
-- SELECT set_config(
--     'app.user_id',
--     'UUID_DO_USUARIO_DE_TESTE',
--     true
-- );
--
-- SELECT set_config(
--     'app.company_id',
--     'UUID_DA_EMPRESA_DE_TESTE',
--     true
-- );
--
-- SELECT
--     callzup_internal.usuario_atual_id(),
--     callzup_internal.empresa_atual_id();
--
-- ROLLBACK;

-- ============================================
-- 7. CENÁRIOS A VALIDAR NA APLICAÇÃO
-- ============================================

-- CENÁRIO A:
-- Usuário da empresa A consulta usuários.
-- Esperado: nenhum usuário da empresa B.

-- CENÁRIO B:
-- Usuário da empresa A tenta consultar
-- mensagens de grupos da empresa B.
-- Esperado: nenhum resultado.

-- CENÁRIO C:
-- Usuário da empresa A tenta consultar
-- conversa privada da qual não participa.
-- Esperado: nenhum resultado.

-- CENÁRIO D:
-- Usuário tenta criar mensagem usando
-- companyId diferente da própria empresa.
-- Esperado: operação negada.

-- CENÁRIO E:
-- Usuário tenta alterar o companyId
-- de um registro existente.
-- Esperado: operação negada.

-- CENÁRIO F:
-- Usuário sem vínculo com um grupo tenta
-- consultar mensagens desse grupo.
-- Esperado: nenhum resultado.

-- CENÁRIO G:
-- Administrador de TI consulta dados
-- autorizados da própria empresa.
-- Esperado: acesso permitido.

-- CENÁRIO H:
-- Administrador de TI tenta acessar
-- dados de outra empresa.
-- Esperado: acesso negado.

-- CENÁRIO I:
-- Conexão sem contexto de usuário
-- tenta consultar tabelas protegidas.
-- Esperado: nenhum dado visível.

-- CENÁRIO J:
-- A role de aplicação tenta consultar
-- a coluna passwordHash de User.
-- Esperado: permissão negada.

-- ============================================
-- FIM DO ROTEIRO
-- ============================================
