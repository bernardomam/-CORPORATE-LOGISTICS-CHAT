
import {
    listarMensagensGrupo,
    enviarMensagemGrupo,
    reagirMensagemGrupo,
    removerReacaoMensagemGrupo
} from '../services/groupMessageService.js';

// Encaminha erros inesperados ao middleware global.
function tratarErro(error, next) {
    if (Number.isInteger(error.status) && error.status >= 400 && error.status <= 499) {
        return next(error);
    }

    return next(error);
}

// Consultar histórico de mensagens
export async function listarMensagens(req, res, next) {
    try {
        const mensagens = await listarMensagensGrupo(
            req.user,
            req.params.id
        );

        return res.json({
            sucesso: true,
            total: mensagens.length,
            mensagens
        });
    } catch (error) {
        return tratarErro(error, next);
    }
}

// Enviar mensagem ou resposta
export async function enviarMensagem(req, res, next) {
    try {
        const mensagem = await enviarMensagemGrupo(
            req.user,
            req.params.id,
            req.body?.content,
            req.body?.replyToId
        );

        return res.status(201).json({
            sucesso: true,
            mensagem: req.body?.replyToId
                ? 'Resposta enviada com sucesso!'
                : 'Mensagem enviada com sucesso!',
            dados: mensagem
        });
    } catch (error) {
        return tratarErro(error, next);
    }
}

// Reagir a uma mensagem
export async function reagirMensagem(req, res, next) {
    try {
        const reacao = await reagirMensagemGrupo(
            req.user,
            req.params.id,
            req.params.mensagemId,
            req.body?.emoji
        );

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Reação registrada com sucesso!',
            dados: reacao
        });
    } catch (error) {
        return tratarErro(error, next);
    }
}

// Remover a própria reação
export async function removerReacaoMensagem(req, res, next) {
    try {
        const resultado = await removerReacaoMensagemGrupo(
            req.user,
            req.params.id,
            req.params.mensagemId
        );

        return res.json({
            sucesso: true,
            mensagem: resultado.removida
                ? 'Reação removida com sucesso!'
                : 'Você não tinha uma reação nesta mensagem.',
            dados: resultado
        });
    } catch (error) {
        return tratarErro(error, next);
    }
}
