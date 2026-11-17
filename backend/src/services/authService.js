
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';

// ==========================================
// AUTENTICAR USUÁRIO
// ==========================================

export async function autenticarUsuario(email, password) {
    // Restrição de horário temporariamente desativada
    // durante o desenvolvimento e os testes.
    //
    // Antes da entrega final do CalZup,
    // restaurar a regra das 08h às 18h.

    // Validar os tipos dos dados recebidos.
    if (
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        email.trim().length === 0 ||
        password.length === 0
    ) {
        throw new Error('EMAIL_SENHA_OBRIGATORIOS');
    }

    // Limitar o tamanho das entradas.
    if (email.length > 254 || password.length > 1024) {
        throw new Error('CREDENCIAIS_INVALIDAS');
    }

    const emailNormalizado = email.trim().toLowerCase();

    // Consultar somente os campos necessários.
    const usuario = await prisma.user.findUnique({
        where: {
            email: emailNormalizado
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
                    status: true
                }
            }
        }
    });

    // Evitar revelar se o e-mail existe.
    if (!usuario) {
        throw new Error('CREDENCIAIS_INVALIDAS');
    }

    // Verificar a senha antes de liberar o acesso.
    const senhaValida = await bcrypt.compare(
        password,
        usuario.passwordHash
    );

    if (!senhaValida) {
        throw new Error('CREDENCIAIS_INVALIDAS');
    }

    // Impedir login de usuários ou empresas inativas.
    if (usuario.status !== 'ACTIVE') {
        throw new Error('USUARIO_INATIVO');
    }

    if (
        !usuario.company ||
        usuario.company.status !== 'ACTIVE'
    ) {
        throw new Error('EMPRESA_INATIVA');
    }

    // Validar a configuração de autenticação.
    const chaveJWT = process.env.JWT_SECRET;

    if (
        typeof chaveJWT !== 'string' ||
        chaveJWT.trim().length === 0
    ) {
        console.error('JWT_SECRET não configurado.');
        throw new Error('JWT_SECRET_NAO_CONFIGURADO');
    }

    // Criar token compatível com authMiddleware.js.
    const token = jwt.sign(
        {
            companyId: usuario.companyId,
            role: usuario.role
        },
        chaveJWT,
        {
            algorithm: 'HS256',
            subject: usuario.id,
            expiresIn: '8h'
        }
    );

    // Nunca retornar passwordHash.
    return {
        token,
        usuario: {
            id: usuario.id,
            name: usuario.name,
            email: usuario.email,
            role: usuario.role,
            status: usuario.status,
            companyId: usuario.companyId,
            departmentId: usuario.departmentId
        }
    };
}
