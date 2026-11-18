
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import {
    verificarHorarioFuncionamento
} from '../utils/horarioFuncionamento.js';

export async function autenticarUsuario(email, password) {
    if (!verificarHorarioFuncionamento()) {
        throw new Error('FORA_DO_HORARIO');
    }

    if (
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        email.trim().length === 0 ||
        password.length === 0
    ) {
        throw new Error('EMAIL_SENHA_OBRIGATORIOS');
    }

    if (email.length > 254 || password.length > 1024) {
        throw new Error('CREDENCIAIS_INVALIDAS');
    }

    const emailNormalizado = email.trim().toLowerCase();

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

    if (!usuario) {
        throw new Error('CREDENCIAIS_INVALIDAS');
    }

    const senhaValida = await bcrypt.compare(
        password,
        usuario.passwordHash
    );

    if (!senhaValida) {
        throw new Error('CREDENCIAIS_INVALIDAS');
    }

    if (usuario.status !== 'ACTIVE') {
        throw new Error('USUARIO_INATIVO');
    }

    if (
        !usuario.company ||
        usuario.company.status !== 'ACTIVE'
    ) {
        throw new Error('EMPRESA_INATIVA');
    }

    const chaveJWT = process.env.JWT_SECRET;

    if (
        typeof chaveJWT !== 'string' ||
        chaveJWT.trim().length === 0
    ) {
        console.error('JWT_SECRET não configurado.');
        throw new Error('JWT_SECRET_NAO_CONFIGURADO');
    }

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
