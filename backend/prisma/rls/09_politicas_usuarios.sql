
-- CALLZUP
-- 09_politicas_usuarios.sql
--
-- RASCUNHO DE SEGURANCA.
-- NAO EXECUTAR NO SUPABASE.
--
-- Esta versao elimina a consulta recursiva
-- da tabela User dentro de suas proprias politicas.
--
-- Escritas de usuarios permanecem bloqueadas
-- para a role callzup_app ate que exista um
-- mecanismo seguro de autorizacao administrativa.
--
-- Nao substitui os GRANTs de seguranca.
-- Nao habilita RLS.

BEGIN;

DROP POLICY IF EXISTS callzup_user_insert
ON public."User";

DROP POLICY IF EXISTS callzup_user_update
ON public."User";

CREATE POLICY callzup_user_insert
ON public."User"
FOR INSERT
TO callzup_app
WITH CHECK (false);

CREATE POLICY callzup_user_update
ON public."User"
FOR UPDATE
TO callzup_app
USING (false)
WITH CHECK (false);

COMMIT;
