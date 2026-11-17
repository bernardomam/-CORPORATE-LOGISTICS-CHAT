
import jwt from 'jsonwebtoken';
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

        // Aceitar somente um token no formato Bearer.
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

        const token = cabecalho.replace(/^Bearer\s+/i, '');

        // Impedir funcionamento sem uma chave JWT configurada.
        const chaveJWT = process.env.JWT_SECRET;

        if (
            typeof chaveJWT !== 'string' ||
            chaveJWT.trim().length === 0
        ) {
            console.error('JWT_SECRET não configurado.');

            return responderErro(
                res,
                500,
                'Configuração de autenticação incompleta.'
            );
        }

        // Aceitar somente JWT assinado com HS256.
        // A assinatura e a expiração são verificadas pela biblioteca.
        const dadosToken = jwt.verify(token, chaveJWT, {
            algorithms: ['HS256']
        });

        // O identificador precisa estar no campo "sub".
        if (
            !dadosToken ||
            typeof dadosToken !== 'object' ||
            Array.isArray(dadosToken) ||
            typeof dadosToken.sub !== 'string' ||
            dadosToken.sub.trim().length === 0
        ) {
            return responderErro(
                res,
                401,
                'Token inválido.'
            );
        }

        // Consultar o estado atual do usuário no banco.
        // Não confiar no perfil informado dentro do token.
        const usuario = await prisma.user.findUnique({
            where: {
                id: dadosToken.sub
            },
            select: {
                id: true,
                name: true,
                email: true,
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

        if (!usuario || usuario.status !== 'ACTIVE') {
            return responderErro(
                res,
                401,
                'Usuário inválido ou desativado.'
            );
        }

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

        // Os dados utilizados nas permissões vêm do banco,
        // e não de informações fornecidas pelo cliente.
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

        console.error('Erro interno na autenticação:', error);

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
    if (!req.user) {
        return responderErro(
            res,
            401,
            'Usuário não autenticado.'
        );
    }

    if (req.user.role !== 'IT_ADMIN') {
        return responderErro(
            res,
            403,
            'Acesso permitido somente à equipe de TI.'
        );
    }

    return next();
}
