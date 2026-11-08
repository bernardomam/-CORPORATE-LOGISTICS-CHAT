
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';

// ==========================================
// VERIFICAR AUTENTICAÇÃO DO USUÁRIO
// ==========================================

export async function autenticarToken(req, res, next) {
    try {
        const cabecalho = req.headers.authorization;

        if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Acesso negado. Token não informado.'
            });
        }

        const token = cabecalho.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Token inválido.'
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Configuração de autenticação incompleta.'
            });
        }

        const dadosToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const usuario = await prisma.user.findUnique({
            where: {
                id: dadosToken.sub
            },
            include: {
                company: {
                    select: {
                        id: true,
                        status: true
                    }
                }
            }
        });

        if (!usuario || usuario.status !== 'ACTIVE') {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Usuário inválido ou desativado.'
            });
        }

        if (!usuario.company || usuario.company.status !== 'ACTIVE') {
            return res.status(403).json({
                sucesso: false,
                mensagem: 'Empresa inativa.'
            });
        }

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
            error.name === 'JsonWebTokenError' ||
            error.name === 'TokenExpiredError'
        ) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Token inválido ou expirado.'
            });
        }

        console.error('Erro na autenticação:', error);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno ao verificar autenticação.'
        });
    }
}

// ==========================================
// RESTRINGIR ACESSO À EQUIPE DE TI
// ==========================================

export function exigirTI(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            sucesso: false,
            mensagem: 'Usuário não autenticado.'
        });
    }

    if (req.user.role !== 'IT_ADMIN') {
        return res.status(403).json({
            sucesso: false,
            mensagem: 'Acesso permitido somente à equipe de TI.'
        });
    }

    return next();
}
