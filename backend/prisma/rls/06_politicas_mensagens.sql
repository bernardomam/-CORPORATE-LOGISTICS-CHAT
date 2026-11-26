
-- CALLZUP
-- 06_politicas_mensagens.sql
--
-- RASCUNHO PARA REVISÃO.
-- NÃO EXECUTAR NO SUPABASE.
--
-- Depende das funções do arquivo 02
-- e da role definida no arquivo 04.
--
-- Ainda não cobre todas as operações
-- de escrita do sistema.

BEGIN;

-- Enviar mensagens apenas com a própria identidade,
-- dentro da empresa do usuário e em uma conversa
-- da qual ele participa.

CREATE POLICY callzup_message_insert
ON public."Message"
FOR INSERT
TO callzup_app
WITH CHECK (
    "userId" = (
        SELECT callzup_internal.usuario_atual_id()
    )
    AND "companyId" = (
        SELECT callzup_internal.empresa_atual_id()
    )
    AND (
        (
            "groupId" IS NOT NULL
            AND "privateChatId" IS NULL
            AND EXISTS (
                SELECT 1
                FROM public."Group" g
                JOIN public."GroupMember" gm
                    ON gm."groupId" = g.id
                WHERE g.id = "Message"."groupId"
                  AND g."companyId" = (
                      SELECT callzup_internal.empresa_atual_id()
                  )
                  AND g.status = 'ACTIVE'
                  AND gm."userId" = (
                      SELECT callzup_internal.usuario_atual_id()
                  )
                  AND gm."leftAt" IS NULL
            )
        )
        OR
        (
            "privateChatId" IS NOT NULL
            AND "groupId" IS NULL
            AND EXISTS (
                SELECT 1
                FROM public."PrivateChat" pc
                JOIN public."PrivateChatMember" pcm
                    ON pcm."privateChatId" = pc.id
                WHERE pc.id = "Message"."privateChatId"
                  AND pc."companyId" = (
                      SELECT callzup_internal.empresa_atual_id()
                  )
                  AND pc.status = 'ACTIVE'
                  AND pcm."userId" = (
                      SELECT callzup_internal.usuario_atual_id()
                  )
            )
        )
    )
);

-- O usuário só pode adicionar reações
-- em seu próprio nome e a mensagens visíveis.

CREATE POLICY callzup_reaction_insert
ON public."MessageReaction"
FOR INSERT
TO callzup_app
WITH CHECK (
    "userId" = (
        SELECT callzup_internal.usuario_atual_id()
    )
    AND EXISTS (
        SELECT 1
        FROM public."Message" m
        WHERE m.id = "MessageReaction"."messageId"
    )
);

COMMIT;
