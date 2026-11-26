
import jwt from 'jsonwebtoken';
import { verificarHorarioFuncionamento, limiteSessao } from '../utils/horarioFuncionamento.js';
import { sessionVersion } from '../utils/sessionVersion.js';
import { chaveJWT as obterChaveJWT, claimsValidos } from '../utils/authValidation.js';
import { prisma } from '../config/prisma.js';

// ==========================================
// RESPOSTAS DE AUTENTICAÇÃO
// ==========================================

function responderErro(res, status, mensagem) {
    return res.status(status).json({
        sucesso: false,
        mensagem
    });
}

// ==========================================
// VERIFICAR AUTENTICAÇÃO DO USUÁRIO
// ==========================================

export async function autenticarToken(req, res, next) {
    try {
        const cabecalho = req.headers.authorization;

        // Aceitar somente tokens no formato Bearer.
        if (
            typeof cabecalho !== 'string' ||
            !/^Bearer\s+\S+$/i.test(cabecalho)
        ) {
            return responderErro(
                res,
                401,
                'Acesso negado. Token não informado ou inválido.'
            );
        }

        const token = cabecalho.replace(
            /^Bearer\s+/i,
            ''
        );

        // Exigir uma chave JWT configurada.
        const chaveJWT = obterChaveJWT();

        // Verificar assinatura e expiração.
        // Aceitar somente o algoritmo HS256.
        const dadosToken = jwt.verify(
            token,
            chaveJWT,
            {
                algorithms: ['HS256'], maxAge: '8h'
            }
        );

        // Validar o identificador do usuário no token.
        if (!claimsValidos(dadosToken)) {
            return responderErro(
                res,
                401,
                'Token inválido.'
            );
        }

        // ==========================================
        // CONSULTA INICIAL DE AUTENTICAÇÃO
        // ==========================================
        //
        // Esta consulta verifica o estado atual do
        // usuário e da empresa antes de liberar a rota.
        //
        // Não utiliza executarComContextoRLS porque
        // o contexto confiável ainda está sendo
        // estabelecido.
        //
        // Antes de ativar políticas RLS com um usuário
        // PostgreSQL sem BYPASSRLS, será necessário
        // definir um acesso inicial seguro para
        // esta consulta.

        const usuario = await prisma.user.findUnique({
            where: {
                id: dadosToken.sub
            },
            select: {
                id: true,
                name: true,
                email: true,
                passwordHash: true,
                role: true,
                status: true,
                companyId: true,
                departmentId: true,
                company: {
                    select: {
                        id: true,
                        status: true
                    }
                }
            }
        });

        // Verificar se o usuário existe e está ativo.
        if (
            !usuario ||
            usuario.status !== 'ACTIVE'
        ) {
            return responderErro(
                res,
                401,
                'Usuário inválido ou desativado.'
            );
        }

        if (dadosToken.sv !== sessionVersion(usuario.passwordHash,chaveJWT)) return responderErro(res,401,'Sessão expirada. Faça login novamente.');

        // Verificar se a empresa existe e está ativa.
        if (
            !usuario.company ||
            usuario.company.status !== 'ACTIVE' ||
            usuario.company.id !== usuario.companyId
        ) {
            return responderErro(
                res,
                403,
                'Empresa inexistente ou inativa.'
            );
        }

        if (typeof dadosToken.jti !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(dadosToken.jti)) return responderErro(res,401,'Sessão inválida. Faça login novamente.');
        const sessoes = await prisma.$queryRaw`SELECT "id" FROM public."AuthSession" WHERE "id" = ${dadosToken.jti}::uuid AND "userId" = ${usuario.id}::uuid AND "revokedAt" IS NULL AND "expiresAt" > now()`;
        if (sessoes.length !== 1) return responderErro(res,401,'Sessão encerrada ou expirada.');
        const agora = new Date();
        const inicio = new Date(dadosToken.iat * 1000);
        if (!verificarHorarioFuncionamento(agora) || !limiteSessao(inicio) || agora.getTime() >= (dadosToken.iat + limiteSessao(inicio))*1000) {
            return responderErro(res,401,'Sessão encerrada pelo horário de funcionamento.');
        }
        req.sessionId = dadosToken.jti;

        // ==========================================
        // CONTEXTO DO USUÁRIO AUTENTICADO
        // ==========================================
        //
        // Utilizar exclusivamente os dados atuais
        // do banco para definir as permissões.
        //
        // Não confiar em companyId ou role enviados
        // pelo cliente ou presentes no JWT.

        req.user = {
            id: usuario.id,
            name: usuario.name,
            email: usuario.email,
            role: usuario.role,
            companyId: usuario.companyId,
            departmentId: usuario.departmentId
        };

        return next();

    } catch (error) {
        // Tokens inválidos, expirados ou ainda
        // não válidos devem retornar HTTP 401.
        if (
            error instanceof jwt.JsonWebTokenError ||
            error instanceof jwt.TokenExpiredError ||
            error instanceof jwt.NotBeforeError
        ) {
            return responderErro(
                res,
                401,
                'Token inválido ou expirado.'
            );
        }

        console.error(
            'Erro interno na autenticação:',
            error?.code || error?.name
        );

        return responderErro(
            res,
            500,
            'Erro interno ao verificar autenticação.'
        );
    }
}

// ==========================================
// RESTRINGIR ACESSO À EQUIPE DE TI
// ==========================================

export function exigirTI(req, res, next) {
    // Verificar se existe um usuário autenticado.
    if (!req.user) {
        return responderErro(
            res,
            401,
            'Usuário não autenticado.'
        );
    }

    // Permitir acesso somente a administradores de TI.
    if (req.user.role !== 'IT_ADMIN') {
        return responderErro(
            res,
            403,
            'Acesso permitido somente à equipe de TI.'
        );
    }

    return next();
}
