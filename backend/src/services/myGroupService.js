
import { executarComContextoRLS } from '../config/rlsContext.js';

// ==========================================
// TRATAMENTO DE ERROS
// ==========================================

function criarErro(mensagem, status = 400) {
    const error = new Error(mensagem);
    error.status = status;
    return error;
}

// ==========================================
// VALIDAR USUÁRIO
// ==========================================

function validarUsuario(usuario) {
    if (
        !usuario ||
        typeof usuario.id !== 'string' ||
        !usuario.id.trim() ||
        typeof usuario.companyId !== 'string' ||
        !usuario.companyId.trim()
    ) {
        throw criarErro(
            'Usuário não identificado ou empresa não informada.',
            401
        );
    }
}

// ==========================================
// LISTAR MEUS GRUPOS
// ==========================================

export async function listarMeusGrupos(usuario) {
    validarUsuario(usuario);

    return executarComContextoRLS(
        usuario,
        (tx) => tx.group.findMany({
            where: {
                companyId: usuario.companyId,
                status: 'ACTIVE',
                members: {
                    some: {
                        userId: usuario.id,
                        leftAt: null
                    }
                }
            },
            select: {
                id: true,
                name: true,
                status: true,
                createdAt: true,
                members: {
                    where: {
                        leftAt: null,
                        user: {
                            status: 'ACTIVE'
                        }
                    },
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        })
    );
}
