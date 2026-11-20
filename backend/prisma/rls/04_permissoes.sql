
-- CALLZUP
-- 04_permissoes.sql
--
-- RASCUNHO PARA REVISAO.
-- NAO EXECUTAR NO SUPABASE.
--
-- Role de acesso restrito para operacoes
-- sujeitas as politicas RLS.
--
-- IMPORTANTE:
-- Este arquivo NAO habilita RLS.
-- A autenticacao e a conexao ainda precisam
-- de revisao antes de qualquer execucao.

BEGIN;

-- ============================================
-- 1. CRIAR ROLE SEM LOGIN
-- ============================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_roles
        WHERE rolname = 'callzup_app'
    ) THEN
        CREATE ROLE callzup_app
            NOLOGIN
            NOSUPERUSER
            NOCREATEDB
            NOCREATEROLE
            NOINHERIT
            NOBYPASSRLS;
    ELSE
        RAISE EXCEPTION
            'Role callzup_app ja existe. Revisar antes de continuar.';
    END IF;
END;
$$;

-- ============================================
-- 2. ACESSO AOS SCHEMAS
-- ============================================

GRANT USAGE ON SCHEMA public
TO callzup_app;

GRANT USAGE ON SCHEMA callzup_internal
TO callzup_app;

-- ============================================
-- 3. FUNCOES DE CONTEXTO
-- ============================================

GRANT EXECUTE ON FUNCTION
    callzup_internal.usuario_atual_id()
TO callzup_app;

GRANT EXECUTE ON FUNCTION
    callzup_internal.empresa_atual_id()
TO callzup_app;

-- Funcao administrativa:
-- so conceder apos revisar o proprietario,
-- os privilegios e o contexto de autenticacao.
--
-- GRANT EXECUTE ON FUNCTION
--     callzup_internal.eh_admin_empresa_atual()
-- TO callzup_app;

-- ============================================
-- 4. LEITURA
-- ============================================

GRANT SELECT ON TABLE
    public."Company",
    public."Department",
    public."Group",
    public."GroupMember",
    public."PrivateChat",
    public."PrivateChatMember",
    public."ChatRequest",
    public."Message",
    public."MessageReaction"
TO callzup_app;

-- Nao conceder leitura de passwordHash.

GRANT SELECT (
    id,
    name,
    email,
    role,
    status,
    "companyId",
    "departmentId",
    "createdAt",
    "updatedAt"
)
ON TABLE public."User"
TO callzup_app;

-- ============================================
-- 5. CRIACAO ADMINISTRATIVA
-- ============================================

GRANT INSERT ON TABLE
    public."Department",
    public."Group",
    public."GroupMember"
TO callzup_app;

-- ============================================
-- 6. ATUALIZACOES RESTRITAS
-- ============================================

GRANT UPDATE (
    name,
    status
)
ON TABLE public."Group"
TO callzup_app;

GRANT UPDATE (
    "leftAt"
)
ON TABLE public."GroupMember"
TO callzup_app;

-- ============================================
-- 7. MENSAGENS E REACOES
-- ============================================

GRANT INSERT ON TABLE
    public."Message",
    public."MessageReaction"
TO callzup_app;

-- ============================================
-- 8. VERIFICACAO DA ROLE
-- ============================================

SELECT
    rolname,
    rolcanlogin,
    rolbypassrls,
    rolsuper,
    rolcreatedb,
    rolcreaterole
FROM pg_roles
WHERE rolname = 'callzup_app';

COMMIT;
