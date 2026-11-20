
-- CALLZUP
-- Funções auxiliares para as políticas RLS.
--
-- ATENÇÃO:
-- Arquivo preparado para revisão.
-- NÃO executar na produção nesta etapa.

BEGIN;

-- Schema interno, separado das tabelas públicas.
CREATE SCHEMA IF NOT EXISTS callzup_internal;

-- Identifica o usuário configurado na transação.
CREATE OR REPLACE FUNCTION
    callzup_internal.usuario_atual_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
    SELECT NULLIF(
        current_setting('app.user_id', true),
        ''
    )::uuid;
$$;

-- Identifica a empresa configurada na transação.
CREATE OR REPLACE FUNCTION
    callzup_internal.empresa_atual_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
    SELECT NULLIF(
        current_setting('app.company_id', true),
        ''
    )::uuid;
$$;

-- Impede acesso público ao schema interno.
REVOKE ALL ON SCHEMA callzup_internal
FROM PUBLIC;

-- Impede execução pública das funções.
REVOKE ALL ON FUNCTION
    callzup_internal.usuario_atual_id()
FROM PUBLIC;

REVOKE ALL ON FUNCTION
    callzup_internal.empresa_atual_id()
FROM PUBLIC;

COMMIT;
