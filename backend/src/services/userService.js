
import bcrypt from 'bcryptjs';
import { executarComContextoRLS } from '../config/rlsContext.js';

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
// VALIDAÇÃO DO ADMINISTRADOR
// ==========================================

function validarAdministrador(administrador) {
    if (
        !administrador ||
        typeof administrador.id !== 'string' ||
        !administrador.id.trim() ||
        typeof administrador.companyId !== 'string' ||
        !administrador.companyId.trim()
    ) {
        const erro = new Error('USUARIO_NAO_AUTENTICADO');
        erro.status = 401;
        throw erro;
    }

    if (administrador.role !== 'IT_ADMIN') {
        const erro = new Error('ACESSO_NEGADO');
        erro.status = 403;
        throw erro;
    }
}

// ==========================================
// CRIAR USUÁRIO
// ==========================================

export async function criarUsuario({
    name,
    email,
    password,
    departmentId,
    role = 'USER',
    administrador
}) {
    validarAdministrador(administrador);

    // A empresa vem da sessão autenticada.
    // Nunca aceitar companyId enviado pelo cliente.
    const companyId = administrador.companyId;

    if (
        typeof name !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        name.trim().length === 0 ||
        email.trim().length === 0 ||
        password.length === 0
    ) {
        throw new Error('CAMPOS_OBRIGATORIOS');
    }

    const nomeNormalizado = name.trim();
    const emailNormalizado = email.trim().toLowerCase();

    if (
        nomeNormalizado.length > 150 ||
        emailNormalizado.length > 254 ||
        password.length > 1024
    ) {
        throw new Error('CAMPOS_OBRIGATORIOS');
    }

    if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado)
    ) {
        throw new Error('CAMPOS_OBRIGATORIOS');
    }

    if (password.length < 8) {
        throw new Error('SENHA_MINIMA');
    }

    if (!['USER', 'IT_ADMIN'].includes(role)) {
        throw new Error('PERFIL_INVALIDO');
    }

    // Gerar o hash antes de iniciar a transação.
    const passwordHash = await bcrypt.hash(password, 12);

    return executarComContextoRLS(
        administrador,
        async (tx) => {
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

                const departamento =
                    await tx.department.findFirst({
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

            return tx.user.create({
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
    );
}

// ==========================================
// LISTAR USUÁRIOS DA EMPRESA
// ==========================================

export async function listarUsuarios(administrador) {
    validarAdministrador(administrador);

    return executarComContextoRLS(
        administrador,
        (tx) => tx.user.findMany({
            where: {
                companyId: administrador.companyId
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
        })
    );
}

// ==========================================
// DESATIVAR USUÁRIO
// ==========================================

export async function desativarUsuario(
    id,
    administrador
) {
    validarAdministrador(administrador);

    if (
        typeof id !== 'string' ||
        id.trim().length === 0
    ) {
        throw new Error('USUARIO_NAO_ENCONTRADO');
    }

    // Impedir que o administrador desative
    // sua própria conta.
    if (id === administrador.id) {
        throw new Error(
            'NAO_PODE_DESATIVAR_PROPRIA_CONTA'
        );
    }

    return executarComContextoRLS(
        administrador,
        async (tx) => {
            const usuario = await tx.user.findFirst({
                where: {
                    id,
                    companyId: administrador.companyId
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

            const usuarioDesativado =
                await tx.user.update({
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

            // Encerrar participações ativas.
            // Preservar o histórico de mensagens.
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
        }
    );
}
