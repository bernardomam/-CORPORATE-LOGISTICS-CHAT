
import {
    solicitarConversa,
    listarSolicitacoes,
    aprovarSolicitacao,
    rejeitarSolicitacao
} from '../services/chatRequestService.js';

// Encaminhar erros ao middleware global de segurança
function tratarErro(error, next) {
    return next(error);
}

// Usuário solicita uma conversa privada
export async function solicitar(req, res, next) {
    try {
        const solicitacao = await solicitarConversa(
            req.user,
            req.body?.requestedUserId
        );

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Solicitação enviada para a equipe de TI.',
            solicitacao
        });
    } catch (error) {
        return tratarErro(error, next);
    }
}

// TI lista as solicitações
export async function listar(req, res, next) {
    try {
        const solicitacoes = await listarSolicitacoes(req.user);

        return res.status(200).json({
            sucesso: true,
            total: solicitacoes.length,
            solicitacoes
        });
    } catch (error) {
        return tratarErro(error, next);
    }
}

// TI aprova uma solicitação
export async function aprovar(req, res, next) {
    try {
        const resultado = await aprovarSolicitacao(
            req.user,
            req.params.id
        );

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Solicitação aprovada e conversa criada com sucesso!',
            resultado
        });
    } catch (error) {
        return tratarErro(error, next);
    }
}

// TI rejeita uma solicitação
export async function rejeitar(req, res, next) {
    try {
        const solicitacao = await rejeitarSolicitacao(
            req.user,
            req.params.id
        );

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Solicitação rejeitada com sucesso.',
            solicitacao
        });
    } catch (error) {
        return tratarErro(error, next);
    }
}
