
import { prisma } from '../config/prisma.js';

// Criar erro com código HTTP
function criarErro(mensagem, status = 400) {
    const error = new Error(mensagem);
    error.status = status;
    return error;
}

// Validar identificação do usuário
function validarUsuario(usuario) {
    if (!usuario?.id || !usuario?.companyId) {
        throw criarErro(
            'Usuário não identificado ou empresa não informada.',
            401
        );
    }
}

// Listar somente grupos ativos dos quais o usuário participa
export async function listarMeusGrupos(usuario) {
    validarUsuario(usuario);

    return await prisma.group.findMany({
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
    });
}
