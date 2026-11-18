
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

async function buscarGrupoDoParticipante(usuario, grupoId) {
    if (
        typeof grupoId !== 'string' ||
        !grupoId.trim()
    ) {
        throw criarErro('Identificador do grupo inválido.');
    }

    const grupo = await prisma.group.findFirst({
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

async function buscarMensagemDoGrupo(
    usuario,
    grupoId,
    mensagemId
) {
    if (
        typeof mensagemId !== 'string' ||
        !mensagemId.trim()
    ) {
        throw criarErro('Identificador da mensagem inválido.');
    }

    const mensagem = await prisma.message.findFirst({
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

export async function listarMensagensGrupo(usuario, grupoId) {
    validarUsuario(usuario);

    const grupo = await buscarGrupoDoParticipante(
        usuario,
        grupoId
    );

    return prisma.message.findMany({
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
        throw criarErro('A mensagem não pode estar vazia.');
    }

    const conteudo = content.trim();

    if (conteudo.length > 10000) {
        throw criarErro(
            'A mensagem ultrapassa o limite de 10.000 caracteres.'
        );
    }

    const grupo = await buscarGrupoDoParticipante(
        usuario,
        grupoId
    );

    let mensagemRespondidaId = null;

    if (replyToId !== null && replyToId !== undefined) {
        if (
            typeof replyToId !== 'string' ||
            !replyToId.trim()
        ) {
            throw criarErro(
                'Identificador da mensagem respondida inválido.'
            );
        }

        const mensagemOriginal = await buscarMensagemDoGrupo(
            usuario,
            grupo.id,
            replyToId
        );

        mensagemRespondidaId = mensagemOriginal.id;
    }

    // Revalidar antes de gravar a mensagem.
    validarHorario();

    return prisma.message.create({
        data: {
            content: conteudo,
            type: 'TEXT',
            companyId: usuario.companyId,
            userId: usuario.id,
            groupId: grupo.id,
            ...(mensagemRespondidaId
                ? { replyToId: mensagemRespondidaId }
                : {})
        },
        include: incluirDadosMensagem
    });
}

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
        throw criarErro('Informe uma reação válida.');
    }

    const grupo = await buscarGrupoDoParticipante(
        usuario,
        grupoId
    );

    const mensagem = await buscarMensagemDoGrupo(
        usuario,
        grupo.id,
        mensagemId
    );

    return prisma.messageReaction.upsert({
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

export async function removerReacaoMensagemGrupo(
    usuario,
    grupoId,
    mensagemId
) {
    validarUsuario(usuario);

    const grupo = await buscarGrupoDoParticipante(
        usuario,
        grupoId
    );

    const mensagem = await buscarMensagemDoGrupo(
        usuario,
        grupo.id,
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
