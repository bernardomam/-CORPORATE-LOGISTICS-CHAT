BEGIN;

CREATE OR REPLACE FUNCTION public.callzup_admin_ativo()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT public.callzup_contexto_ativo()
    AND EXISTS (
        SELECT 1
        FROM public."User" u
        WHERE u.id::text =
            current_setting('app.user_id', true)
          AND u."companyId"::text =
            current_setting('app.company_id', true)
          AND u.role = 'IT_ADMIN'
          AND u.status = 'ACTIVE'
    );
$$;

ALTER FUNCTION public.callzup_admin_ativo()
OWNER TO postgres;

REVOKE ALL ON FUNCTION public.callzup_admin_ativo()
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.callzup_admin_ativo()
TO callzup_app;

GRANT UPDATE (
    name,
    email,
    "departmentId",
    role,
    status,
    "updatedAt"
) ON public."User" TO callzup_app;

ALTER POLICY callzup_user_insert
ON public."User"
WITH CHECK (
    public.callzup_admin_ativo()
    AND "companyId" = public.callzup_empresa_atual()
    AND status = 'ACTIVE'
    AND (
        "departmentId" IS NULL
        OR EXISTS (
            SELECT 1
            FROM public."Department" d
            WHERE d.id = "User"."departmentId"
              AND d."companyId" = "User"."companyId"
        )
    )
);

ALTER POLICY callzup_user_update
ON public."User"
USING (
    public.callzup_admin_ativo()
    AND "companyId" = public.callzup_empresa_atual()
)
WITH CHECK (
    public.callzup_admin_ativo()
    AND "companyId" = public.callzup_empresa_atual()
    AND (
        id <> public.callzup_usuario_atual()
        OR (role = 'IT_ADMIN' AND status = 'ACTIVE')
    )
    AND (
        "departmentId" IS NULL
        OR EXISTS (
            SELECT 1
            FROM public."Department" d
            WHERE d.id = "User"."departmentId"
              AND d."companyId" = "User"."companyId"
        )
    )
);

COMMIT;