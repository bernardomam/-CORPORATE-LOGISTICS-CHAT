
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
      if (process.env.USAR_CONEXAO_RLS === 'true') {
        const [role] = await tx.$queryRaw`
          SELECT current_user::text AS nome,
                 session_user::text AS sessao,
                 r.rolsuper AS superusuario,
                 r.rolbypassrls AS ignora_rls,
                 current_setting('row_security') AS row_security,
                 NOT EXISTS (
                   SELECT 1 FROM pg_class c
                   JOIN pg_namespace n ON n.oid = c.relnamespace
                   WHERE n.nspname = 'public'
                     AND c.relkind IN ('r', 'p')
                     AND c.relname IN ('Company', 'User', 'Department', 'Group',
                       'GroupMember', 'Message', 'MessageReaction', 'PrivateChat',
                       'PrivateChatMember', 'ChatRequest')
                     AND (NOT c.relrowsecurity OR pg_has_role(c.relowner, 'USAGE'))
                 ) AS tabelas_protegidas
          FROM pg_roles r WHERE r.rolname = current_user
        `;
        if (!role || role.nome !== 'callzup_app' ||
            role.sessao !== 'callzup_app' || role.superusuario ||
            role.ignora_rls || role.row_security !== 'on' ||
            !role.tabelas_protegidas) {
          throw new Error('Conexão RLS sem as restrições exigidas.');
        }
      }

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
