
-- CALLZUP
-- 07_politicas_administracao.sql
--
-- RASCUNHO PARA REVISAO.
-- NAO EXECUTAR NO SUPABASE.
--
-- Regras administrativas de departamentos e grupos.
-- Depende da funcao definida em:
-- 11_autorizacao_admin.sql
--
-- ATENCAO:
-- A funcao precisa de proprietario confiavel
-- e permissao EXECUTE controlada.
-- As permissoes de escrita ainda serao revisadas.

BEGIN;

-- ============================================
-- 1. CRIAR DEPARTAMENTOS
-- ============================================

DROP POLICY IF EXISTS callzup_department_insert
ON public."Department";

CREATE POLICY callzup_department_insert
ON public."Department"
FOR INSERT
TO callzup_app
WITH CHECK (
    "companyId" = (
        SELECT callzup_internal.empresa_atual_id()
    )
    AND (
        SELECT callzup_internal.eh_admin_empresa_atual()
    )
);

-- ============================================
-- 2. CRIAR GRUPOS
-- ============================================

DROP POLICY IF EXISTS callzup_group_insert
ON public."Group";

CREATE POLICY callzup_group_insert
ON public."Group"
FOR INSERT
TO callzup_app
WITH CHECK (
    "companyId" = (
        SELECT callzup_internal.empresa_atual_id()
    )
    AND (
        SELECT callzup_internal.eh_admin_empresa_atual()
    )
);

-- ============================================
-- 3. ATUALIZAR GRUPOS
-- ============================================

DROP POLICY IF EXISTS callzup_group_update
ON public."Group";

CREATE POLICY callzup_group_update
ON public."Group"
FOR UPDATE
TO callzup_app
USING (
    "companyId" = (
        SELECT callzup_internal.empresa_atual_id()
    )
    AND (
        SELECT callzup_internal.eh_admin_empresa_atual()
    )
)
WITH CHECK (
    "companyId" = (
        SELECT callzup_internal.empresa_atual_id()
    )
    AND (
        SELECT callzup_internal.eh_admin_empresa_atual()
    )
);

COMMIT;
