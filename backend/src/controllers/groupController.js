
import {
    criarGrupo,
    listarGrupos,
    atualizarGrupo,
    desativarGrupo,
    adicionarIntegrante,
    removerIntegrante
} from '../services/groupService.js';

// ==========================================
// TRATAMENTO SEGURO DE ERROS
// ==========================================

function tratarErro(error, res, operacao) {
    const status =
        Number.isInteger(error?.status) &&
        error.status >= 400 &&
        error.status <= 599
            ? error.status
            : 500;

    // Nunca expor detalhes de erros internos.
    if (status >= 500) {
        console.error(
            `Erro interno ao ${operacao}:`,
            error
        );

        return res.status(status).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor.'
        });
    }

    // Respostas conhecidas de validação e autorização.
    return res.status(status).json({
        sucesso: false,
        mensagem:
            typeof error?.message === 'string' &&
            error.message.trim().length > 0
                ? error.message
                : 'Não foi possível processar a solicitação.'
    });
}

// ==========================================
// CRIAR GRUPO
// ==========================================

export async function cadastrar(req, res) {
    try {
        const grupo = await criarGrupo(
            req.user,
            req.body
        );

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Grupo criado com sucesso!',
            grupo
        });

    } catch (error) {
        return tratarErro(error, res, 'criar grupo');
    }
}

// ==========================================
// LISTAR GRUPOS
// ==========================================

export async function listar(req, res) {
    try {
        const grupos = await listarGrupos(req.user);

        return res.status(200).json({
            sucesso: true,
            total: grupos.length,
            grupos
        });

    } catch (error) {
        return tratarErro(error, res, 'listar grupos');
    }
}

// ==========================================
// ATUALIZAR GRUPO
// ==========================================

export async function atualizar(req, res) {
    try {
        const grupo = await atualizarGrupo(
            req.user,
            req.params.id,
            req.body
        );

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Grupo atualizado com sucesso!',
            grupo
        });

    } catch (error) {
        return tratarErro(error, res, 'atualizar grupo');
    }
}

// ==========================================
// ADICIONAR INTEGRANTE
// ==========================================

export async function adicionar(req, res) {
    try {
        const grupo = await adicionarIntegrante(
            req.user,
            req.params.id,
            req.body?.userId
        );

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Integrante adicionado com sucesso!',
            grupo
        });

    } catch (error) {
        return tratarErro(error, res, 'adicionar integrante');
    }
}

// ==========================================
// REMOVER INTEGRANTE
// ==========================================

export async function remover(req, res) {
    try {
        const resultado = await removerIntegrante(
            req.user,
            req.params.id,
            req.params.userId
        );

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Integrante removido com sucesso!',
            resultado
        });

    } catch (error) {
        return tratarErro(error, res, 'remover integrante');
    }
}

// ==========================================
// DESATIVAR GRUPO
// ==========================================

export async function desativar(req, res) {
    try {
        const grupo = await desativarGrupo(
            req.user,
            req.params.id
        );

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Grupo desativado com sucesso!',
            grupo
        });

    } catch (error) {
        return tratarErro(error, res, 'desativar grupo');
    }
}
