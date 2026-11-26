import {
    solicitarConversa,
    listarSolicitacoes,
    aprovarSolicitacao,
    rejeitarSolicitacao
} from '../services/chatRequestService.js';

import { notificarSolicitacao } from '../services/emailService.js';

// ==========================================
// RESPOSTAS DE ERRO
// ==========================================

function responderErro(res, status, mensagem) {
    return res.status(status).json({
        sucesso: false,
        mensagem
    });
}

function tratarErro(res, error, operacao) {
    if (error?.code === 'P2002') {
        return responderErro(
            res,
            409,
            'Solicitação ou conversa duplicada.'
        );
    }

    if (
        Number.isInteger(error?.status) &&
        error.status >= 400 &&
        error.status < 500
    ) {
        return responderErro(
            res,
            error.status,
            error.message
        );
    }

    console.error(
        `Erro interno ao ${operacao}:`,
        error
    );

    return responderErro(
        res,
        500,
        `Erro interno ao ${operacao}.`
    );
}

// ==========================================
// SOLICITAR CONVERSA
// POST /
// ==========================================

export async function solicitar(req, res) {
    try {
        const requestedUserId = req.body?.requestedUserId;

        const solicitacao = await solicitarConversa(
            req.user,
            requestedUserId
        );

        // Notificar somente depois de salvar a solicitação.
        try {
            await notificarSolicitacao({
                ...solicitacao,
                requester: {
                    ...solicitacao.requester,
                    email: req.user.email
                }
            }, req.user.companyId);

        } catch (error) {
            console.error('EMAIL_NOTIFICACAO_FALHOU', {
                solicitacaoId: solicitacao.id
            });
        }

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Solicitação enviada com sucesso!',
            solicitacao
        });

    } catch (error) {
        return tratarErro(
            res,
            error,
            'solicitar conversa'
        );
    }
}

// ==========================================
// LISTAR SOLICITAÇÕES
// GET /
// ==========================================

export async function listar(req, res) {
    try {
        const solicitacoes = await listarSolicitacoes(
            req.user
        );

        return res.status(200).json({
            sucesso: true,
            total: solicitacoes.length,
            solicitacoes
        });

    } catch (error) {
        return tratarErro(
            res,
            error,
            'listar solicitações'
        );
    }
}

// ==========================================
// APROVAR SOLICITAÇÃO
// PATCH /:id/aprovar
// ==========================================

export async function aprovar(req, res) {
    try {
        const resultado = await aprovarSolicitacao(
            req.user,
            req.params.id
        );

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Solicitação aprovada com sucesso!',
            ...resultado
        });

    } catch (error) {
        return tratarErro(
            res,
            error,
            'aprovar solicitação'
        );
    }
}

// ==========================================
// REJEITAR SOLICITAÇÃO
// PATCH /:id/rejeitar
// ==========================================

export async function rejeitar(req, res) {
    try {
        const solicitacao = await rejeitarSolicitacao(
            req.user,
            req.params.id
        );

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Solicitação rejeitada com sucesso!',
            solicitacao
        });

    } catch (error) {
        return tratarErro(
            res,
            error,
            'rejeitar solicitação'
        );
    }
}