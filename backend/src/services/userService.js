
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';

// ==========================================
// CAMPOS SEGUROS PARA RETORNO
// ==========================================

const camposUsuario = {
    id: true,
    name: true,
    email: true,
    role: true,
    status: true,
    companyId: true,
    departmentId: true,
    createdAt: true
};

// ==========================================
// CRIAR USUÁRIO
// ==========================================

export async function criarUsuario({
    name,
    email,
    password,
    departmentId,
    companyId,
    role = 'USER'
}) {
    // Validar os tipos e campos obrigatórios.
    if (
        typeof name !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        typeof companyId !== 'string' ||
        name.trim().length === 0 ||
        email.trim().length === 0 ||
        password.length === 0 ||
        companyId.trim().length === 0
    ) {
        throw new Error('CAMPOS_OBRIGATORIOS');
    }

    const nomeNormalizado = name.trim();
    const emailNormalizado = email.trim().toLowerCase();

    // Limitar tamanhos de entrada.
    if (
        nomeNormalizado.length > 150 ||
        emailNormalizado.length > 254 ||
        password.length > 1024
    ) {
        throw new Error('CAMPOS_OBRIGATORIOS');
    }

    // Validar formato básico do e-mail.
    if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado)
    ) {
        throw new Error('CAMPOS_OBRIGATORIOS');
    }

    // Exigir senha com pelo menos 8 caracteres.
    if (password.length < 8) {
        throw new Error('SENHA_MINIMA');
    }

    // Somente os perfis previstos pelo CalZup.
    if (!['USER', 'IT_ADMIN'].includes(role)) {
        throw new Error('PERFIL_INVALIDO');
    }

    // O departamento é opcional, mas precisa
    // pertencer à empresa do usuário.
    let departamentoValidado = null;

    if (
        departmentId !== undefined &&
        departmentId !== null &&
        departmentId !== ''
    ) {
        if (
            typeof departmentId !== 'string' ||
            departmentId.trim().length === 0
        ) {
            throw new Error('DEPARTAMENTO_INVALIDO');
        }

        const departamento = await prisma.department.findFirst({
            where: {
                id: departmentId,
                companyId
            },
            select: {
                id: true
            }
        });

        if (!departamento) {
            throw new Error('DEPARTAMENTO_INVALIDO');
        }

        departamentoValidado = departamento.id;
    }

    // Gerar hash da senha. Nunca armazenar senha em texto.
    const passwordHash = await bcrypt.hash(password, 12);

    // Cadastrar e retornar apenas dados não sensíveis.
    return prisma.user.create({
        data: {
            name: nomeNormalizado,
            email: emailNormalizado,
            passwordHash,
            role,
            status: 'ACTIVE',
            companyId,
            departmentId: departamentoValidado
        },
        select: camposUsuario
    });
}

// ==========================================
// LISTAR USUÁRIOS DA EMPRESA
// ==========================================

export async function listarUsuarios(companyId) {
    if (
        typeof companyId !== 'string' ||
        companyId.trim().length === 0
    ) {
        throw new Error('EMPRESA_INVALIDA');
    }

    return prisma.user.findMany({
        where: {
            companyId
        },
        select: {
            ...camposUsuario,
            department: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            name: 'asc'
        }
    });
}

// ==========================================
// DESATIVAR USUÁRIO
// ==========================================

export async function desativarUsuario(
    id,
    companyId,
    administradorId
) {
    if (
        typeof id !== 'string' ||
        id.trim().length === 0 ||
        typeof companyId !== 'string' ||
        companyId.trim().length === 0 ||
        typeof administradorId !== 'string' ||
        administradorId.trim().length === 0
    ) {
        throw new Error('USUARIO_NAO_ENCONTRADO');
    }

    // Impedir que o administrador desative
    // sua própria conta.
    if (id === administradorId) {
        throw new Error('NAO_PODE_DESATIVAR_PROPRIA_CONTA');
    }

    return prisma.$transaction(async (tx) => {
        // Impedir operações em usuários de outra empresa.
        const usuario = await tx.user.findFirst({
            where: {
                id,
                companyId
            },
            select: {
                id: true,
                status: true
            }
        });

        if (!usuario) {
            throw new Error('USUARIO_NAO_ENCONTRADO');
        }

        const agora = new Date();

        // Desativar sem excluir o usuário.
        const usuarioDesativado = await tx.user.update({
            where: {
                id: usuario.id
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

        // Encerrar participações ativas nos grupos.
        // O histórico de mensagens permanece preservado.
        await tx.groupMember.updateMany({
            where: {
                userId: usuario.id,
                leftAt: null
            },
            data: {
                leftAt: agora
            }
        });

        return usuarioDesativado;
    });
}
