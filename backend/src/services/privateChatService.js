
import { prisma } from '../config/prisma.js';
import {
    verificarHorarioFuncionamento
} from '../utils/horarioFuncionamento.js';

function criarErro(mensagem, status = 400) {
    const error = new Error(mensagem);
    error.status = status;
    return error;
}

function validarUsuario(usuario) {
    if (!usuario?.id || !usuario?.companyId) {
        throw criarErro('Usuário não identificado.', 401);
    }
}

function validarHorario() {
    if (!verificarHorarioFuncionamento()) {
        throw criarErro(
            'O envio de mensagens é permitido somente das 08:00 às 18:00, no horário de Brasília.',
            403
        );
    }
}

function validarIdentificador(valor, mensagem) {
    if (typeof valor !== 'string' || !valor.trim()) {
        throw criarErro(mensagem);
    }
}

function filtroAcessoConversa(usuario) {
    return {
        members: {
            some: {
                userId: usuario.id
            }
        }
    };
}

async function buscarConversaDoParticipante(
    usuario,
    conversaId
) {
    validarIdentificador(
        conversaId,
        'Identificador da conversa inválido.'
    );

    const conversa = await prisma.privateChat.findFirst({
        where: {
            id: conversaId.trim(),
            companyId: usuario.companyId,
            status: 'ACTIVE',
            ...filtroAcessoConversa(usuario)
        },
        select: {
            id: true,
            companyId: true,
            status: true
        }
    });

    if (!conversa) {
        throw criarErro(
            'Conversa não encontrada ou você não tem permissão para acessá-la.',
            403
        );
    }

    return conversa;
}

async function buscarMensagemDaConversa(
    usuario,
    conversaId,
    mensagemId
) {
    validarIdentificador(
        mensagemId,
        'Identificador da mensagem inválido.'
    );

    const mensagem = await prisma.message.findFirst({
        where: {
            id: mensagemId.trim(),
            privateChatId: conversaId,
            companyId: usuario.companyId
        },
        select: {
            id: true
        }
    });

    if (!mensagem) {
        throw criarErro(
            'Mensagem não encontrada nesta conversa.',
            404
        );
    }

    return mensagem;
}

function incluirDadosMensagem() {
    return {
        sender: {
            select: {
                id: true,
                name: true
            }
        },
        replyTo: {
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        },
        reactions: {
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
}

export async function listarConversasPrivadas(usuario) {
    validarUsuario(usuario);

    return prisma.privateChat.findMany({
        where: {
            companyId: usuario.companyId,
            status: 'ACTIVE',
            ...filtroAcessoConversa(usuario)
        },
        include: {
            members: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            role: true
                        }
                    }
                }
            },
            messages: {
                orderBy: {
                    createdAt: 'desc'
                },
                take: 1,
                select: {
                    id: true,
                    content: true,
                    type: true,
                    userId: true,
                    createdAt: true
                }
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });
}

export async function listarMensagensPrivadas(
    usuario,
    conversaId
) {
    validarUsuario(usuario);

    const conversa = await buscarConversaDoParticipante(
        usuario,
        conversaId
    );

    return prisma.message.findMany({
        where: {
            privateChatId: conversa.id,
            companyId: usuario.companyId
        },
        include: incluirDadosMensagem(),
        orderBy: {
            createdAt: 'asc'
        }
    });
}

export async function enviarMensagemPrivada(
    usuario,
    conversaId,
    content,
    replyToId = null
) {
    validarUsuario(usuario);
    validarHorario();

    if (typeof content !== 'string' || !content.trim()) {
        throw criarErro('A mensagem não pode estar vazia.');
    }

    const conteudo = content.trim();

    if (conteudo.length > 10000) {
        throw criarErro(
            'A mensagem ultrapassa o limite de 10.000 caracteres.'
        );
    }

    const conversa = await buscarConversaDoParticipante(
        usuario,
        conversaId
    );

    let mensagemRespondidaId = null;

    if (replyToId !== null && replyToId !== undefined) {
        validarIdentificador(
            replyToId,
            'Identificador da mensagem respondida inválido.'
        );

        const mensagemOriginal = await buscarMensagemDaConversa(
            usuario,
            conversa.id,
            replyToId
        );

        mensagemRespondidaId = mensagemOriginal.id;
    }

    validarHorario();

    return prisma.$transaction(async (tx) => {
        const mensagem = await tx.message.create({
            data: {
                content: conteudo,
                type: 'TEXT',
                companyId: usuario.companyId,
                userId: usuario.id,
                privateChatId: conversa.id,
                ...(mensagemRespondidaId
                    ? { replyToId: mensagemRespondidaId }
                    : {})
            },
            include: incluirDadosMensagem()
        });

        await tx.privateChat.update({
            where: {
                id: conversa.id
            },
            data: {
                updatedAt: new Date()
            }
        });

        return mensagem;
    });
}

export async function reagirMensagemPrivada(
    usuario,
    conversaId,
    mensagemId,
    emoji
) {
    validarUsuario(usuario);

    if (
        typeof emoji !== 'string' ||
        !emoji.trim() ||
        emoji.trim().length > 32
    ) {
        throw criarErro('Informe uma reação válida.');
    }

    const conversa = await buscarConversaDoParticipante(
        usuario,
        conversaId
    );

    const mensagem = await buscarMensagemDaConversa(
        usuario,
        conversa.id,
        mensagemId
    );

    return prisma.messageReaction.upsert({
        where: {
            messageId_userId: {
                messageId: mensagem.id,
                userId: usuario.id
            }
        },
        create: {
            messageId: mensagem.id,
            userId: usuario.id,
            emoji: emoji.trim()
        },
        update: {
            emoji: emoji.trim()
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });
}

export async function removerReacaoMensagemPrivada(
    usuario,
    conversaId,
    mensagemId
) {
    validarUsuario(usuario);

    const conversa = await buscarConversaDoParticipante(
        usuario,
        conversaId
    );

    const mensagem = await buscarMensagemDaConversa(
        usuario,
        conversa.id,
        mensagemId
    );

    const resultado = await prisma.messageReaction.deleteMany({
        where: {
            messageId: mensagem.id,
            userId: usuario.id
        }
    });

    if (resultado.count === 0) {
        throw criarErro(
            'Você ainda não reagiu a esta mensagem.',
            404
        );
    }

    return {
        removida: true,
        mensagem: 'Reação removida com sucesso.'
    };
}
