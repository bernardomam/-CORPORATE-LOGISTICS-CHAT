BEGIN;

CREATE OR REPLACE FUNCTION public.callzup_contexto_ativo()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public."User" u
        JOIN public."Company" c
          ON c.id = u."companyId"
        WHERE u.id::text =
            current_setting('app.user_id', true)
          AND u."companyId"::text =
            current_setting('app.company_id', true)
          AND u.status = 'ACTIVE'
          AND c.status = 'ACTIVE'
    );
$$;

ALTER FUNCTION public.callzup_contexto_ativo() OWNER TO postgres;

REVOKE ALL ON FUNCTION
    public.callzup_contexto_ativo()
    FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION
    public.callzup_contexto_ativo()
    TO callzup_app;

DO $$
DECLARE
    tabela text;
BEGIN
    FOREACH tabela IN ARRAY ARRAY[
        'Company',
        'Department',
        'User',
        'Group',
        'GroupMember',
        'PrivateChat',
        'PrivateChatMember',
        'ChatRequest',
        'Message',
        'MessageReaction',
        'GroupRequest'
    ]
    LOOP
        EXECUTE format(
            'DROP POLICY IF EXISTS callzup_contexto_ativo
             ON public.%I',
            tabela
        );

        EXECUTE format(
            'CREATE POLICY callzup_contexto_ativo
             ON public.%I
             AS RESTRICTIVE
             FOR ALL
             TO callzup_app
             USING (public.callzup_contexto_ativo())
             WITH CHECK (public.callzup_contexto_ativo())',
            tabela
        );
    END LOOP;
END;
$$;

COMMIT;