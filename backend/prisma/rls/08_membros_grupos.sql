
-- CALLZUP
-- 08_membros_grupos.sql
--
-- RASCUNHO PARA REVISAO.
-- NAO EXECUTAR NO SUPABASE.
--
-- Politicas para adicionar e atualizar
-- membros de grupos.
--
-- Depende de:
-- 02_funcoes_contexto.sql
-- 11_autorizacao_admin.sql
--
-- Os GRANTs de escrita serao revisados
-- separadamente antes da ativacao do RLS.

BEGIN;

-- ============================================
-- 1. ADICIONAR MEMBRO AO GRUPO
-- ============================================

DROP POLICY IF EXISTS callzup_group_member_insert
ON public."GroupMember";

CREATE POLICY callzup_group_member_insert
ON public."GroupMember"
FOR INSERT
TO callzup_app
WITH CHECK (
    (
        SELECT callzup_internal.eh_admin_empresa_atual()
    )
    AND EXISTS (
        SELECT 1
        FROM public."Group" AS g
        WHERE g.id = "groupId"
          AND g."companyId" = (
              SELECT callzup_internal.empresa_atual_id()
          )
    )
    AND EXISTS (
        SELECT 1
        FROM public."User" AS u
        WHERE u.id = "userId"
          AND u."companyId" = (
              SELECT callzup_internal.empresa_atual_id()
          )
    )
);

-- ============================================
-- 2. ATUALIZAR MEMBRO DO GRUPO
-- ============================================

DROP POLICY IF EXISTS callzup_group_member_update
ON public."GroupMember";

CREATE POLICY callzup_group_member_update
ON public."GroupMember"
FOR UPDATE
TO callzup_app
USING (
    (
        SELECT callzup_internal.eh_admin_empresa_atual()
    )
    AND EXISTS (
        SELECT 1
        FROM public."Group" AS g
        WHERE g.id = "groupId"
          AND g."companyId" = (
              SELECT callzup_internal.empresa_atual_id()
          )
    )
)
WITH CHECK (
    (
        SELECT callzup_internal.eh_admin_empresa_atual()
    )
    AND EXISTS (
        SELECT 1
        FROM public."Group" AS g
        WHERE g.id = "groupId"
          AND g."companyId" = (
              SELECT callzup_internal.empresa_atual_id()
          )
    )
    AND EXISTS (
        SELECT 1
        FROM public."User" AS u
        WHERE u.id = "userId"
          AND u."companyId" = (
              SELECT callzup_internal.empresa_atual_id()
          )
    )
);

COMMIT;
