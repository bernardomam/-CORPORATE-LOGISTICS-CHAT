BEGIN;

GRANT UPDATE ("updatedAt")
ON public."Company"
TO callzup_app;

CREATE OR REPLACE FUNCTION
public.callzup_proteger_chat_privado()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    IF current_user = 'callzup_app' THEN

        IF NOT public.callzup_contexto_ativo() THEN
            RAISE EXCEPTION 'Contexto nao autorizado'
                USING ERRCODE = '42501';
        END IF;

        IF (
            NEW.status IS DISTINCT FROM OLD.status
            OR NEW."pairKey" IS DISTINCT FROM OLD."pairKey"
        ) AND NOT public.callzup_admin_ativo() THEN

            RAISE EXCEPTION 'Alteracao exclusiva da TI'
                USING ERRCODE = '42501';

        END IF;

    END IF;

    RETURN NEW;
END;
$$;

ALTER FUNCTION public.callzup_proteger_chat_privado()
OWNER TO postgres;

REVOKE ALL ON FUNCTION
public.callzup_proteger_chat_privado()
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION
public.callzup_proteger_chat_privado()
TO callzup_app;

DROP TRIGGER IF EXISTS callzup_proteger_chat_privado
ON public."PrivateChat";

CREATE TRIGGER callzup_proteger_chat_privado
BEFORE UPDATE ON public."PrivateChat"
FOR EACH ROW
EXECUTE FUNCTION public.callzup_proteger_chat_privado();

REVOKE ALL PRIVILEGES
ON public."GroupRequest"
FROM callzup_app;

REVOKE UPDATE (
    "groupId",
    "reviewedAt",
    "reviewedById",
    status
)
ON public."GroupRequest"
FROM callzup_app;

COMMIT;