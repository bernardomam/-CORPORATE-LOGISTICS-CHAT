
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';

// Criar usuário
export async function criarUsuario({
    name,
    email,
    password,
    departmentId,
    companyId
}) {
    if (!name || !email || !password || !companyId) {
        throw new Error('CAMPOS_OBRIGATORIOS');
    }

    if (password.length < 8) {
        throw new Error('SENHA_MINIMA');
    }

    const emailNormalizado = email.trim().toLowerCase();

    if (departmentId) {
        const departamento = await prisma.department.findFirst({
            where: {
                id: departmentId,
                companyId
            }
        });

        if (!departamento) {
            throw new Error('DEPARTAMENTO_INVALIDO');
        }
    }

    const passwordHash = await bcrypt.hash(password, 12);

    return await prisma.user.create({
        data: {
            name: name.trim(),
            email: emailNormalizado,
            passwordHash,
            role: 'USER',
            status: 'ACTIVE',
            companyId,
            departmentId: departmentId || null
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            companyId: true,
            departmentId: true,
            createdAt: true
        }
    });
}

// Listar usuários da empresa do administrador
export async function listarUsuarios(companyId) {
    return await prisma.user.findMany({
        where: {
            companyId
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            companyId: true,
            departmentId: true,
            department: {
                select: {
                    name: true
                }
            },
            createdAt: true
        },
        orderBy: {
            name: 'asc'
        }
    });
}

// Desativar usuário sem apagar seu histórico
export async function desativarUsuario(id, companyId, administradorId) {
    if (id === administradorId) {
        throw new Error('NAO_PODE_DESATIVAR_PROPRIA_CONTA');
    }

    const usuario = await prisma.user.findFirst({
        where: {
            id,
            companyId
        }
    });

    if (!usuario) {
        throw new Error('USUARIO_NAO_ENCONTRADO');
    }

    return await prisma.user.update({
        where: {
            id
        },
        data: {
            status: 'INACTIVE'
        },
        select: {
            id: true,
            name: true,
            email: true,
            status: true
        }
    });
}
