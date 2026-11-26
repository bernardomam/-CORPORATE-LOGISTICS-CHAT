-- CALLZUP
-- RASCUNHO LOCAL. NAO EXECUTAR NO SUPABASE.
-- Depende de 11_autorizacao_admin.sql.

BEGIN;

CREATE POLICY callzup_group_member_admin_select
ON public."GroupMember"
FOR SELECT
TO callzup_app
USING (
    callzup_internal.eh_admin_empresa_atual()
    AND EXISTS (
        SELECT 1
        FROM public."Group" AS g
        WHERE g.id = "GroupMember"."groupId"
          AND g."companyId" =
              callzup_internal.empresa_atual_id()
    )
);

COMMIT;