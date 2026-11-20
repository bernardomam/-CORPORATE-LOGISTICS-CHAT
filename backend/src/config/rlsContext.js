
import { prisma } from './prisma.js';
import { criarPrismaRls } from './prismaRls.js';

let prismaRls = null;

function obterClientePrisma() {
  if (process.env.USAR_CONEXAO_RLS !== 'true') {
    return prisma;
  }

  if (!prismaRls) {
    prismaRls = criarPrismaRls();
  }

  return prismaRls;
}

export async function executarComContextoRLS(usuario, operacao) {
  if (
    !usuario ||
    typeof usuario.id !== 'string' ||
    !usuario.id.trim() ||
    typeof usuario.companyId !== 'string' ||
    !usuario.companyId.trim()
  ) {
    throw new Error('Usuário ou empresa inválidos para contexto RLS.');
  }

  if (typeof operacao !== 'function') {
    throw new Error('Operação RLS inválida.');
  }

  const cliente = obterClientePrisma();

  return cliente.$transaction(
    async (tx) => {
      await tx.$queryRaw`
        SELECT
          set_config('app.user_id', ${usuario.id}, true),
          set_config('app.company_id', ${usuario.companyId}, true)
      `;

      return operacao(tx);
    },
    {
      maxWait: 15000,
      timeout: 15000
    }
  );
}
