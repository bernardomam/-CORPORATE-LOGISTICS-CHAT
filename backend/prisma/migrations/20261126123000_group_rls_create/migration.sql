BEGIN;

ALTER POLICY callzup_group_select
ON public."Group"
USING (
    "companyId" = public.callzup_empresa_atual()
    AND (
        public.callzup_admin_ativo()
        OR public.callzup_pode_ver_grupo(id)
    )
);

COMMIT;