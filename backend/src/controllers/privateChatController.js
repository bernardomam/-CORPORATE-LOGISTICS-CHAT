
import {
    listarConversasPrivadas,
    listarMensagensPrivadas,
    enviarMensagemPrivada,
    reagirMensagemPrivada,
    removerReacaoMensagemPrivada
} from '../services/privateChatService.js';

// Listar conversas privadas
export async function listarConversas(req, res, next) {
    try {
        const conversas = await listarConversasPrivadas(req.user);

        return res.json({
            sucesso: true,
            total: conversas.length,
            conversas
        });
    } catch (error) {
        return next(error);
    }
}

// Listar mensagens de uma conversa
export async function listarMensagens(req, res, next) {
    try {
        const mensagens = await listarMensagensPrivadas(
            req.user,
            req.params.id
        );

        return res.json({
            sucesso: true,
            total: mensagens.length,
            mensagens
        });
    } catch (error) {
        return next(error);
    }
}

// Enviar mensagem privada ou responder outra mensagem
export async function enviarMensagem(req, res, next) {
    try {
        const mensagem = await enviarMensagemPrivada(
            req.user,
            req.params.id,
            req.body?.content,
            req.body?.replyToId ?? null
        );

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Mensagem enviada com sucesso!',
            dados: mensagem
        });
    } catch (error) {
        return next(error);
    }
}

// Adicionar ou atualizar reação
export async function reagirMensagem(req, res, next) {
    try {
        const reacao = await reagirMensagemPrivada(
            req.user,
            req.params.id,
            req.params.mensagemId,
            req.body?.emoji
        );

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Reação registrada com sucesso!',
            dados: reacao
        });
    } catch (error) {
        return next(error);
    }
}

// Remover a própria reação
export async function removerReacaoMensagem(req, res, next) {
    try {
        const resultado = await removerReacaoMensagemPrivada(
            req.user,
            req.params.id,
            req.params.mensagemId
        );

        return res.json({
            sucesso: true,
            ...resultado
        });
    } catch (error) {
        return next(error);
    }
}
