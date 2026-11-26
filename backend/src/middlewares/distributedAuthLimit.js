import { createHmac } from 'node:crypto';
import { prisma } from '../config/prisma.js';
import { chaveJWT } from '../utils/authValidation.js';

export async function limitarAuth(req, res, next) {
    try {
        const identity =
            req.user?.id ||
            req.ip ||
            req.socket?.remoteAddress ||
            'unknown';

        const key = createHmac('sha256', chaveJWT())
            .update('auth-limit:' + identity)
            .digest('hex');

        await prisma.$executeRaw`
            DELETE FROM "AuthAttempt"
            WHERE "expiresAt" <
                (now() AT TIME ZONE 'UTC') - interval '1 hour'
        `;

        const rows = await prisma.$queryRaw`
            INSERT INTO "AuthAttempt" (key, count, "expiresAt")
            VALUES (
                ${key},
                1,
                (now() AT TIME ZONE 'UTC') + interval '15 minutes'
            )
            ON CONFLICT (key) DO UPDATE SET
                count = CASE
                    WHEN "AuthAttempt"."expiresAt" <=
                        (now() AT TIME ZONE 'UTC')
                    THEN 1
                    ELSE "AuthAttempt".count + 1
                END,
                "expiresAt" = CASE
                    WHEN "AuthAttempt"."expiresAt" <=
                        (now() AT TIME ZONE 'UTC')
                    THEN (now() AT TIME ZONE 'UTC')
                        + interval '15 minutes'
                    ELSE "AuthAttempt"."expiresAt"
                END
            WHERE
                "AuthAttempt"."expiresAt" <=
                    (now() AT TIME ZONE 'UTC')
                OR "AuthAttempt".count < 10
            RETURNING
                count,
                "expiresAt"::text AS expiration
        `;

        if (rows.length === 0) {
            const bloqueio = await prisma.$queryRaw`
                SELECT GREATEST(
                    1,
                    CEIL(EXTRACT(EPOCH FROM (
                        "expiresAt" -
                        (now() AT TIME ZONE 'UTC')
                    )))
                )::int AS segundos
                FROM "AuthAttempt"
                WHERE key = ${key}
            `;

            const segundos = bloqueio[0]?.segundos ?? 900;

            res.set('Retry-After', String(segundos));

            return res.status(429).json({
                sucesso: false,
                mensagem: 'Muitas tentativas. Aguarde.'
            });
        }

        const tentativa = rows[0];
        let devolvida = false;

        req.devolverTentativaAuth = async () => {
            if (devolvida) return;

            devolvida = true;

            await prisma.$executeRaw`
                UPDATE "AuthAttempt"
                SET count = GREATEST(count - 1, 0)
                WHERE key = ${key}
                AND "expiresAt" =
                    ${tentativa.expiration}::timestamp
                AND "expiresAt" >
                    (now() AT TIME ZONE 'UTC')
            `;
        };

        return next();

    } catch (error) {
        if (
            error?.code === 'P2010' &&
            error?.meta?.code === '42P01'
        ) {
            console.error('AUTH_LIMIT_SCHEMA_MISSING');

            return res.status(503).json({
                sucesso: false,
                mensagem: 'Autenticação temporariamente indisponível.'
            });
        }

        return next(error);
    }
}