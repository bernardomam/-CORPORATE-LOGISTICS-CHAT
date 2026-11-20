
-- CALLZUP
-- 03_politicas.sql
--
-- RASCUNHO PARA REVISÃO.
-- NÃO EXECUTAR NO SUPABASE AINDA.
--
-- Pré-requisitos:
-- 1. Schema callzup_internal criado.
-- 2. Funções de contexto criadas.
-- 3. Role callzup_app criada SEM BYPASSRLS.
-- 4. Permissões mínimas configuradas.
--
-- Estas políticas cobrem apenas SELECT.
-- Não representam a configuração RLS final.

BEGIN;

-- 1. EMPRESAS
CREATE POLICY callzup_company_select
ON public."Company"
FOR SELECT
TO callzup_app
USING (
    id = (
        SELECT callzup_internal.empresa_atual_id()
    )
);

-- 2. DEPARTAMENTOS
CREATE POLICY callzup_department_select
ON public."Department"
FOR SELECT
TO callzup_app
USING (
    "companyId" = (
        SELECT callzup_internal.empresa_atual_id()
    )
);

-- 3. USUÁRIOS
CREATE POLICY callzup_user_select
ON public."User"
FOR SELECT
TO callzup_app
USING (
    "companyId" = (
        SELECT callzup_internal.empresa_atual_id()
    )
);

-- 4. GRUPOS
CREATE POLICY callzup_group_select
ON public."Group"
FOR SELECT
TO callzup_app
USING (
    "companyId" = (
        SELECT callzup_internal.empresa_atual_id()
    )
);

-- 5. MEMBROS DOS GRUPOS
-- Leitura inicialmente limitada ao próprio vínculo.
CREATE POLICY callzup_group_member_select
ON public."GroupMember"
FOR SELECT
TO callzup_app
USING (
    "userId" = (
        SELECT callzup_internal.usuario_atual_id()
    )
    AND EXISTS (
        SELECT 1
        FROM public."Group" g
        WHERE g.id = "GroupMember"."groupId"
          AND g."companyId" = (
              SELECT callzup_internal.empresa_atual_id()
          )
    )
);

-- 6. CONVERSAS PRIVADAS
CREATE POLICY callzup_private_chat_select
ON public."PrivateChat"
FOR SELECT
TO callzup_app
USING (
    "companyId" = (
        SELECT callzup_internal.empresa_atual_id()
    )
    AND (
        "createdById" = (
            SELECT callzup_internal.usuario_atual_id()
        )
        OR EXISTS (
            SELECT 1
            FROM public."PrivateChatMember" pcm
            WHERE pcm."privateChatId" = "PrivateChat".id
              AND pcm."userId" = (
                  SELECT callzup_internal.usuario_atual_id()
              )
        )
    )
);

-- 7. PARTICIPANTES DAS CONVERSAS PRIVADAS
-- Leitura inicialmente limitada ao próprio vínculo.
CREATE POLICY callzup_private_chat_member_select
ON public."PrivateChatMember"
FOR SELECT
TO callzup_app
USING (
    "userId" = (
        SELECT callzup_internal.usuario_atual_id()
    )
);

-- 8. SOLICITAÇÕES DE CONVERSA
CREATE POLICY callzup_chat_request_select
ON public."ChatRequest"
FOR SELECT
TO callzup_app
USING (
    "companyId" = (
        SELECT callzup_internal.empresa_atual_id()
    )
    AND (
        "requesterId" = (
            SELECT callzup_internal.usuario_atual_id()
        )
        OR "requestedUserId" = (
            SELECT callzup_internal.usuario_atual_id()
        )
        OR "reviewedById" = (
            SELECT callzup_internal.usuario_atual_id()
        )
    )
);

-- 9. MENSAGENS
CREATE POLICY callzup_message_select
ON public."Message"
FOR SELECT
TO callzup_app
USING (
    "companyId" = (
        SELECT callzup_internal.empresa_atual_id()
    )
    AND (
        (
            "groupId" IS NOT NULL
            AND EXISTS (
                SELECT 1
                FROM public."GroupMember" gm
                WHERE gm."groupId" = "Message"."groupId"
                  AND gm."userId" = (
                      SELECT callzup_internal.usuario_atual_id()
                  )
                  AND gm."leftAt" IS NULL
            )
        )
        OR
        (
            "privateChatId" IS NOT NULL
            AND EXISTS (
                SELECT 1
                FROM public."PrivateChatMember" pcm
                WHERE pcm."privateChatId" =
                    "Message"."privateChatId"
                  AND pcm."userId" = (
                      SELECT callzup_internal.usuario_atual_id()
                  )
            )
        )
    )
);

-- 10. REAÇÕES ÀS MENSAGENS
CREATE POLICY callzup_message_reaction_select
ON public."MessageReaction"
FOR SELECT
TO callzup_app
USING (
    EXISTS (
        SELECT 1
        FROM public."Message" m
        WHERE m.id = "MessageReaction"."messageId"
    )
);

-- 11. VERIFICAÇÃO DE COBERTURA
-- Esta consulta não altera nenhuma política.
SELECT
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND policyname LIKE 'callzup_%'
ORDER BY tablename, policyname;

COMMIT;
