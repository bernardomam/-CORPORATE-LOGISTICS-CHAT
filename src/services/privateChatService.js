
import { executarComContextoRLS } from '../config/rlsContext.js';
import {
    verificarHorarioFuncionamento
} from '../utils/horarioFuncionamento.js';

// ==========================================
// TRATAMENTO DE ERROS
// ==========================================

function criarErro(mensagem, status = 400) {
    const error = new Error(mensagem);
    error.status = status;
    return error;
}

// ==========================================
// VALIDAÇÕES
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
            'Usuário não identificado.',
            401
        );
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
    if (
        typeof valor !== 'string' ||
        !valor.trim()
    ) {
        throw criarErro(mensagem);
    }
}

// ==========================================
// FILTROS DE ACESSO
// ==========================================

function filtroAcessoConversa(usuario) {
    return {
        members: {
            some: {
                userId: usuario.id
            }
        }
    };
}

// ==========================================
// CONSULTAS INTERNAS
// ==========================================

async function buscarConversaDoParticipante(
    tx,
    usuario,
    conversaId
) {
    validarIdentificador(
        conversaId,
        'Identificador da conversa inválido.'
    );

    const conversa = await tx.privateChat.findFirst({
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
    tx,
    usuario,
    conversaId,
    mensagemId
) {
    validarIdentificador(
        mensagemId,
        'Identificador da mensagem inválido.'
    );

    const mensagem = await tx.message.findFirst({
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

// ==========================================
// LISTAR CONVERSAS PRIVADAS
// ==========================================

export async function listarConversasPrivadas(usuario) {
    validarUsuario(usuario);

    return executarComContextoRLS(
        usuario,
        (tx) => tx.privateChat.findMany({
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
        })
    );
}

// ==========================================
// LISTAR MENSAGENS PRIVADAS
// ==========================================

export async function listarMensagensPrivadas(
    usuario,
    conversaId
) {
    validarUsuario(usuario);

    return executarComContextoRLS(
        usuario,
        async (tx) => {
            const conversa =
                await buscarConversaDoParticipante(
                    tx,
                    usuario,
                    conversaId
                );

            return tx.message.findMany({
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
    );
}

// ==========================================
// ENVIAR MENSAGEM PRIVADA
// ==========================================

export async function enviarMensagemPrivada(
    usuario,
    conversaId,
    content,
    replyToId = null
) {
    validarUsuario(usuario);
    validarHorario();

    if (
        typeof content !== 'string' ||
        !content.trim()
    ) {
        throw criarErro(
            'A mensagem não pode estar vazia.'
        );
    }

    const conteudo = content.trim();

    if (conteudo.length > 10000) {
        throw criarErro(
            'A mensagem ultrapassa o limite de 10.000 caracteres.'
        );
    }

    return executarComContextoRLS(
        usuario,
        async (tx) => {
            const conversa =
                await buscarConversaDoParticipante(
                    tx,
                    usuario,
                    conversaId
                );

            let mensagemRespondidaId = null;

            if (
                replyToId !== null &&
                replyToId !== undefined
            ) {
                validarIdentificador(
                    replyToId,
                    'Identificador da mensagem respondida inválido.'
                );

                const mensagemOriginal =
                    await buscarMensagemDaConversa(
                        tx,
                        usuario,
                        conversa.id,
                        replyToId
                    );

                mensagemRespondidaId =
                    mensagemOriginal.id;
            }

            // Verificar o horário novamente
            // antes de gravar a mensagem.
            validarHorario();

            const mensagem = await tx.message.create({
                data: {
                    content: conteudo,
                    type: 'TEXT',
                    companyId: usuario.companyId,
                    userId: usuario.id,
                    privateChatId: conversa.id,
                    ...(mensagemRespondidaId
                        ? {
                            replyToId: mensagemRespondidaId
                        }
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
        }
    );
}

// ==========================================
// REAGIR A MENSAGEM PRIVADA
// ==========================================

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
        throw criarErro(
            'Informe uma reação válida.'
        );
    }

    return executarComContextoRLS(
        usuario,
        async (tx) => {
            const conversa =
                await buscarConversaDoParticipante(
                    tx,
                    usuario,
                    conversaId
                );

            const mensagem =
                await buscarMensagemDaConversa(
                    tx,
                    usuario,
                    conversa.id,
                    mensagemId
                );

            return tx.messageReaction.upsert({
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
    );
}

// ==========================================
// REMOVER REAÇÃO
// ==========================================

export async function removerReacaoMensagemPrivada(
    usuario,
    conversaId,
    mensagemId
) {
    validarUsuario(usuario);

    return executarComContextoRLS(
        usuario,
        async (tx) => {
            const conversa =
                await buscarConversaDoParticipante(
                    tx,
                    usuario,
                    conversaId
                );

            const mensagem =
                await buscarMensagemDaConversa(
                    tx,
                    usuario,
                    conversa.id,
                    mensagemId
                );

            const resultado =
                await tx.messageReaction.deleteMany({
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
                mensagem:
                    'Reação removida com sucesso.'
            };
        }
    );
}
