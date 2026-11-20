
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
// VERIFICAR ACESSO AO GRUPO
// ==========================================

async function buscarGrupoDoParticipante(
    tx,
    usuario,
    grupoId
) {
    validarIdentificador(
        grupoId,
        'Identificador do grupo inválido.'
    );

    const grupo = await tx.group.findFirst({
        where: {
            id: grupoId.trim(),
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
            companyId: true,
            status: true
        }
    });

    if (!grupo) {
        throw criarErro(
            'Grupo não encontrado ou você não tem permissão para acessá-lo.',
            403
        );
    }

    return grupo;
}

// ==========================================
// DADOS DAS MENSAGENS
// ==========================================

const incluirDadosMensagem = {
    sender: {
        select: {
            id: true,
            name: true,
            role: true
        }
    },
    replyTo: {
        select: {
            id: true,
            content: true,
            sender: {
                select: {
                    id: true,
                    name: true,
                    role: true
                }
            }
        }
    },
    reactions: {
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    role: true
                }
            }
        },
        orderBy: {
            createdAt: 'asc'
        }
    }
};

// ==========================================
// BUSCAR MENSAGEM DO GRUPO
// ==========================================

async function buscarMensagemDoGrupo(
    tx,
    usuario,
    grupoId,
    mensagemId
) {
    validarIdentificador(
        mensagemId,
        'Identificador da mensagem inválido.'
    );

    const mensagem = await tx.message.findFirst({
        where: {
            id: mensagemId.trim(),
            groupId: grupoId,
            companyId: usuario.companyId
        },
        select: {
            id: true,
            groupId: true,
            companyId: true
        }
    });

    if (!mensagem) {
        throw criarErro(
            'Mensagem não encontrada neste grupo.',
            404
        );
    }

    return mensagem;
}

// ==========================================
// LISTAR MENSAGENS DO GRUPO
// ==========================================

export async function listarMensagensGrupo(
    usuario,
    grupoId
) {
    validarUsuario(usuario);

    return executarComContextoRLS(
        usuario,
        async (tx) => {
            const grupo =
                await buscarGrupoDoParticipante(
                    tx,
                    usuario,
                    grupoId
                );

            return tx.message.findMany({
                where: {
                    groupId: grupo.id,
                    companyId: usuario.companyId
                },
                include: incluirDadosMensagem,
                orderBy: {
                    createdAt: 'asc'
                }
            });
        }
    );
}

// ==========================================
// ENVIAR MENSAGEM AO GRUPO
// ==========================================

export async function enviarMensagemGrupo(
    usuario,
    grupoId,
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
            const grupo =
                await buscarGrupoDoParticipante(
                    tx,
                    usuario,
                    grupoId
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
                    await buscarMensagemDoGrupo(
                        tx,
                        usuario,
                        grupo.id,
                        replyToId
                    );

                mensagemRespondidaId =
                    mensagemOriginal.id;
            }

            // Revalidar o horário antes da gravação.
            validarHorario();

            return tx.message.create({
                data: {
                    content: conteudo,
                    type: 'TEXT',
                    companyId: usuario.companyId,
                    userId: usuario.id,
                    groupId: grupo.id,
                    ...(mensagemRespondidaId
                        ? {
                            replyToId: mensagemRespondidaId
                        }
                        : {})
                },
                include: incluirDadosMensagem
            });
        }
    );
}

// ==========================================
// REAGIR A UMA MENSAGEM DO GRUPO
// ==========================================

export async function reagirMensagemGrupo(
    usuario,
    grupoId,
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
            const grupo =
                await buscarGrupoDoParticipante(
                    tx,
                    usuario,
                    grupoId
                );

            const mensagem =
                await buscarMensagemDoGrupo(
                    tx,
                    usuario,
                    grupo.id,
                    mensagemId
                );

            return tx.messageReaction.upsert({
                where: {
                    messageId_userId: {
                        messageId: mensagem.id,
                        userId: usuario.id
                    }
                },
                update: {
                    emoji: emoji.trim()
                },
                create: {
                    messageId: mensagem.id,
                    userId: usuario.id,
                    emoji: emoji.trim()
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            role: true
                        }
                    }
                }
            });
        }
    );
}

// ==========================================
// REMOVER REAÇÃO DE MENSAGEM DO GRUPO
// ==========================================

export async function removerReacaoMensagemGrupo(
    usuario,
    grupoId,
    mensagemId
) {
    validarUsuario(usuario);

    return executarComContextoRLS(
        usuario,
        async (tx) => {
            const grupo =
                await buscarGrupoDoParticipante(
                    tx,
                    usuario,
                    grupoId
                );

            const mensagem =
                await buscarMensagemDoGrupo(
                    tx,
                    usuario,
                    grupo.id,
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
