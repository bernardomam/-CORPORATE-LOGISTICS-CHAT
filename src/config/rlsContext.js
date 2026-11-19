
import { prisma } from './prisma.js';
import { criarPrismaRls } from './prismaRls.js';

let prismaRls = null;

/**
 * Retorna o cliente Prisma adequado.
 *
 * RLS desligado:
 * utiliza a conexao atual do backend.
 *
 * RLS ligado:
 * exige uma conexao restrita independente.
 */
function obterClientePrisma() {
    if (process.env.USAR_CONEXAO_RLS !== 'true') {
        return prisma;
    }

    if (!prismaRls) {
        prismaRls = criarPrismaRls();
    }

    return prismaRls;
}

/**
 * Executa uma operacao dentro de uma transacao
 * com contexto de usuario e empresa.
 *
 * O contexto vale apenas durante a transacao.
 *
 * IMPORTANTE:
 * As variaveis de contexto nao autenticam o
 * usuario no PostgreSQL.
 *
 * O objeto usuario deve vir de um processo
 * de autenticacao confiavel do backend.
 *
 * Todas as consultas da operacao devem
 * utilizar o cliente tx recebido.
 */
export async function executarComContextoRLS(
    usuario,
    operacao
) {
    if (
        !usuario ||
        typeof usuario.id !== 'string' ||
        !usuario.id.trim() ||
        typeof usuario.companyId !== 'string' ||
        !usuario.companyId.trim()
    ) {
        throw new Error(
            'Contexto de usuario invalido.'
        );
    }

    if (typeof operacao !== 'function') {
        throw new Error(
            'Operacao RLS invalida.'
        );
    }

    const cliente = obterClientePrisma();

    return cliente.$transaction(async (tx) => {
        await tx.$queryRaw`
            SELECT
                set_config(
                    'app.user_id',
                    ${usuario.id},
                    true
                ),
                set_config(
                    'app.company_id',
                    ${usuario.companyId},
                    true
                )
        `;

        return operacao(tx);
    });
}
