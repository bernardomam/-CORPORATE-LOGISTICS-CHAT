
import { prisma } from '../config/prisma.js';
import { verificarHorarioFuncionamento } from '../utils/horarioFuncionamento.js';

function criarErro(mensagem, status = 400) {
    const error = new Error(mensagem);
    error.status = status;
    return error;
}

function validarEmpresa(usuario) {
    if (!usuario?.companyId || !usuario?.id) {
        throw criarErro('Usuario ou empresa nao identificados.', 401);
    }
}

function validarTI(usuario) {
    validarEmpresa(usuario);

    if (usuario.role !== 'IT_ADMIN') {
        throw criarErro('Acesso permitido somente a TI.', 403);
    }
}

// Acesso permitido das 08h00 as 17h59, horario de Brasilia.
function validarHorario() {
    if (!verificarHorarioFuncionamento()) {
        throw criarErro(
            'Acesso permitido somente das 08h as 18h, no horario de Brasilia.',
            403
        );
    }
}

function gerarPairKey(usuarioId, outroUsuarioId) {
    return [usuarioId, outroUsuarioId]
        .sort()
        .join(':');
}

const incluirMembros = {
    members: {
        include: {
            user: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    }
};

function validarDoisParticipantes(conversa, usuarioAId, usuarioBId) {
    const membros = conversa.members.map((membro) => membro.userId);

    const participantesCorretos =
        membros.length === 2 &&
        membros.includes(usuarioAId) &&
        membros.includes(usuarioBId);

    if (!participantesCorretos) {
        throw criarErro(
            'A conversa existente nao possui exatamente os dois participantes esperados. E necessaria uma verificacao administrativa.',
            409
        );
    }
}

// Qualquer usuario ativo pode solicitar conversa com outro usuario ativo.
export async function solicitarConversa(usuario, requestedUserId) {
    validarEmpresa(usuario);
    validarHorario();

    if (!['USER', 'IT_ADMIN'].includes(usuario.role)) {
        throw criarErro('Perfil sem permissao para solicitar conversas.', 403);
    }

    if (
        typeof requestedUserId !== 'string' ||
        !requestedUserId.trim()
    ) {
        throw criarErro('Informe o usuario com quem deseja conversar.');
    }

    const destinatarioId = requestedUserId.trim();

    if (destinatarioId === usuario.id) {
        throw criarErro('Voce nao pode solicitar uma conversa consigo mesmo.');
    }

    const destinatario = await prisma.user.findFirst({
        where: {
            id: destinatarioId,
            companyId: usuario.companyId,
            status: 'ACTIVE',
            role: {
                in: ['USER', 'IT_ADMIN']
            }
        },
        select: {
            id: true,
            name: true,
            role: true
        }
    });

    if (!destinatario) {
        throw criarErro(
            'Usuario nao encontrado ou inativo nesta empresa.',
            404
        );
    }

    const pairKey = gerarPairKey(usuario.id, destinatarioId);

    const conversaAtiva = await prisma.privateChat.findFirst({
        where: {
            companyId: usuario.companyId,
            pairKey,
            status: 'ACTIVE'
        },
        select: {
            id: true
        }
    });

    if (conversaAtiva) {
        throw criarErro(
            'Ja existe uma conversa privada ativa entre esses usuarios.',
            409
        );
    }

    // Impede solicitacoes duplicadas nos dois sentidos.
    const solicitacaoExistente = await prisma.chatRequest.findFirst({
        where: {
            companyId: usuario.companyId,
            status: 'PENDING',
            OR: [
                {
                    requesterId: usuario.id,
                    requestedUserId: destinatarioId
                },
                {
                    requesterId: destinatarioId,
                    requestedUserId: usuario.id
                }
            ]
        }
    });

    if (solicitacaoExistente) {
        throw criarErro(
            'Ja existe uma solicitacao pendente entre esses usuarios.',
            409
        );
    }

    return prisma.chatRequest.create({
        data: {
            companyId: usuario.companyId,
            requesterId: usuario.id,
            requestedUserId: destinatarioId
        },
        include: {
            requester: {
                select: {
                    id: true,
                    name: true
                }
            },
            requestedUser: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });
}

// Todos os funcionarios ativos da TI podem visualizar as solicitacoes da empresa.
export async function listarSolicitacoes(usuario) {
    validarTI(usuario);
    validarHorario();

    return prisma.chatRequest.findMany({
        where: {
            companyId: usuario.companyId
        },
        include: {
            requester: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            },
            requestedUser: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            },
            reviewedBy: {
                select: {
                    id: true,
                    name: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}

// Qualquer funcionario da TI pode aprovar solicitacoes da propria empresa,
// desde que nao esteja aprovando a propria solicitacao.
export async function aprovarSolicitacao(usuario, solicitacaoId) {
    validarTI(usuario);
    validarHorario();

    if (
        typeof solicitacaoId !== 'string' ||
        !solicitacaoId.trim()
    ) {
        throw criarErro('Identificador da solicitacao nao informado.');
    }

    const id = solicitacaoId.trim();

    return prisma.$transaction(async (tx) => {
        const solicitacao = await tx.chatRequest.findFirst({
            where: {
                id,
                companyId: usuario.companyId,
                status: 'PENDING'
            }
        });

        if (!solicitacao) {
            throw criarErro(
                'Solicitacao nao encontrada ou ja analisada.',
                404
            );
        }

        if (solicitacao.requesterId === usuario.id) {
            throw criarErro(
                'Voce nao pode aprovar sua propria solicitacao. Outro administrador da TI deve aprova-la.',
                403
            );
        }

        if (solicitacao.requesterId === solicitacao.requestedUserId) {
            throw criarErro(
                'Uma conversa nao pode ter o mesmo usuario como participante duas vezes.',
                409
            );
        }

        const usuarios = await tx.user.findMany({
            where: {
                id: {
                    in: [
                        solicitacao.requesterId,
                        solicitacao.requestedUserId
                    ]
                },
                companyId: usuario.companyId,
                status: 'ACTIVE',
                role: {
                    in: ['USER', 'IT_ADMIN']
                }
            },
            select: {
                id: true,
                role: true
            }
        });

        if (usuarios.length !== 2) {
            throw criarErro(
                'Um ou ambos os participantes estao inativos ou nao pertencem a empresa.',
                409
            );
        }

        const pairKey = gerarPairKey(
            solicitacao.requesterId,
            solicitacao.requestedUserId
        );

        let conversaExistente = await tx.privateChat.findFirst({
            where: {
                companyId: usuario.companyId,
                pairKey
            },
            include: incluirMembros
        });

        // Procura tambem conversas antigas que ainda nao possuem pairKey.
        if (!conversaExistente) {
            const conversasLegadas = await tx.privateChat.findMany({
                where: {
                    companyId: usuario.companyId,
                    pairKey: null,
                    members: {
                        some: {
                            userId: solicitacao.requesterId
                        }
                    },
                    AND: {
                        members: {
                            some: {
                                userId: solicitacao.requestedUserId
                            }
                        }
                    }
                },
                include: incluirMembros
            });

            if (conversasLegadas.length > 1) {
                throw criarErro(
                    'Existem varias conversas antigas para esse par de usuarios. E necessaria uma verificacao administrativa.',
                    409
                );
            }

            if (conversasLegadas.length === 1) {
                conversaExistente = conversasLegadas[0];
            }
        }

        if (conversaExistente) {
            validarDoisParticipantes(
                conversaExistente,
                solicitacao.requesterId,
                solicitacao.requestedUserId
            );
        }

        // Reserva a solicitacao para impedir duas aprovacoes simultaneas.
        const reserva = await tx.chatRequest.updateMany({
            where: {
                id: solicitacao.id,
                companyId: usuario.companyId,
                status: 'PENDING'
            },
            data: {
                status: 'APPROVED',
                reviewedById: usuario.id,
                reviewedAt: new Date()
            }
        });

        if (reserva.count !== 1) {
            throw criarErro(
                'Esta solicitacao ja foi analisada por outra operacao.',
                409
            );
        }

        let conversa;

        if (conversaExistente) {
            // Reutiliza o historico e preserva os dois participantes originais.
            conversa = await tx.privateChat.update({
                where: {
                    id: conversaExistente.id
                },
                data: {
                    status: 'ACTIVE',
                    pairKey
                },
                include: incluirMembros
            });
        } else {
            // Cria a conversa somente depois da aprovacao da TI.
            conversa = await tx.privateChat.create({
                data: {
                    companyId: usuario.companyId,
                    createdById: usuario.id,
                    pairKey,
                    status: 'ACTIVE',
                    members: {
                        create: [
                            {
                                userId: solicitacao.requesterId
                            },
                            {
                                userId: solicitacao.requestedUserId
                            }
                        ]
                    }
                },
                include: incluirMembros
            });
        }

        return {
            solicitacaoId: solicitacao.id,
            conversa,
            conversaReutilizada: Boolean(conversaExistente)
        };
    });
}

// Qualquer funcionario da TI pode rejeitar solicitacoes da propria empresa.
export async function rejeitarSolicitacao(usuario, solicitacaoId) {
    validarTI(usuario);
    validarHorario();

    if (
        typeof solicitacaoId !== 'string' ||
        !solicitacaoId.trim()
    ) {
        throw criarErro('Identificador da solicitacao nao informado.');
    }

    const id = solicitacaoId.trim();

    const resultado = await prisma.chatRequest.updateMany({
        where: {
            id,
            companyId: usuario.companyId,
            status: 'PENDING'
        },
        data: {
            status: 'REJECTED',
            reviewedById: usuario.id,
            reviewedAt: new Date()
        }
    });

    if (resultado.count !== 1) {
        throw criarErro(
            'Solicitacao nao encontrada ou ja analisada.',
            404
        );
    }

    return prisma.chatRequest.findFirst({
        where: {
            id,
            companyId: usuario.companyId
        }
    });
}
