
-- CALLZUP
-- 11_autorizacao_admin.sql
--
-- RASCUNHO PARA REVISAO.
-- NAO EXECUTAR NO SUPABASE.
--
-- Funcao interna para verificar se o usuario
-- informado no contexto e um IT_ADMIN ativo.
--
-- ATENCAO:
-- SECURITY DEFINER exige proprietario confiavel,
-- permissoes restritas e revisao de seguranca.
-- As variaveis app.user_id e app.company_id
-- nao sao autenticacao por si mesmas.

BEGIN;

CREATE OR REPLACE FUNCTION
    callzup_internal.eh_admin_empresa_atual()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public."User" AS u
        JOIN public."Company" AS c
          ON c.id = u."companyId"
        WHERE u.id =
            callzup_internal.usuario_atual_id()
          AND u."companyId" =
            callzup_internal.empresa_atual_id()
          AND u.role = 'IT_ADMIN'
          AND u.status = 'ACTIVE'
          AND c.status = 'ACTIVE'
    );
$$;

REVOKE ALL
ON FUNCTION callzup_internal.eh_admin_empresa_atual()
FROM PUBLIC;

-- Nao conceder EXECUTE a callzup_app ainda.
-- A role, o proprietario da funcao e as politicas
-- precisam ser revisados em conjunto.

COMMIT;
