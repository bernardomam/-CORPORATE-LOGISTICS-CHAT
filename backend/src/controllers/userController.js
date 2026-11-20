
import {
    criarUsuario,
    listarUsuarios,
    desativarUsuario
} from '../services/userService.js';

// ==========================================
// RESPOSTAS DE ERRO
// ==========================================

function responderErro(res, status, mensagem) {
    return res.status(status).json({
        sucesso: false,
        mensagem
    });
}

function corpoValido(body) {
    return (
        body !== null &&
        typeof body === 'object' &&
        !Array.isArray(body)
    );
}

// ==========================================
// TRATAMENTO DE ERROS DE ACESSO
// ==========================================

function responderErroAcesso(res, error) {
    if (error?.message === 'USUARIO_NAO_AUTENTICADO') {
        return responderErro(
            res,
            401,
            'Usuário não autenticado.'
        );
    }

    if (error?.message === 'ACESSO_NEGADO') {
        return responderErro(
            res,
            403,
            'Acesso permitido somente à equipe de TI.'
        );
    }

    return null;
}

// ==========================================
// CADASTRAR USUÁRIO
// ==========================================

export async function cadastrar(req, res) {
    try {
        if (!corpoValido(req.body)) {
            return responderErro(
                res,
                400,
                'Informe os dados do usuário.'
            );
        }

        const {
            name,
            email,
            password,
            departmentId,
            role
        } = req.body;

        // A empresa será obtida da sessão autenticada.
        // Não aceitar companyId do corpo da requisição.
        const usuario = await criarUsuario({
            name,
            email,
            password,
            departmentId,
            role,
            administrador: req.user
        });

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Usuário cadastrado com sucesso!',
            usuario
        });

    } catch (error) {
        if (error?.code === 'P2002') {
            return responderErro(
                res,
                409,
                'Este e-mail já está cadastrado.'
            );
        }

        const erros = {
            CAMPOS_OBRIGATORIOS: [
                400,
                'Preencha todos os campos obrigatórios.'
            ],
            SENHA_MINIMA: [
                400,
                'A senha deve ter pelo menos 8 caracteres.'
            ],
            DEPARTAMENTO_INVALIDO: [
                400,
                'Departamento inválido para esta empresa.'
            ],
            PERFIL_INVALIDO: [
                400,
                'Perfil de usuário inválido.'
            ],
            USUARIO_NAO_AUTENTICADO: [
                401,
                'Usuário não autenticado.'
            ],
            ACESSO_NEGADO: [
                403,
                'Acesso permitido somente à equipe de TI.'
            ]
        };

        const resposta = erros[error?.message];

        if (resposta) {
            return responderErro(
                res,
                resposta[0],
                resposta[1]
            );
        }

        console.error(
            'Erro interno ao cadastrar usuário:',
            error
        );

        return responderErro(
            res,
            500,
            'Erro interno ao cadastrar usuário.'
        );
    }
}

// ==========================================
// LISTAR USUÁRIOS DA EMPRESA
// ==========================================

export async function listar(req, res) {
    try {
        const usuarios = await listarUsuarios(req.user);

        return res.status(200).json({
            sucesso: true,
            total: usuarios.length,
            usuarios
        });

    } catch (error) {
        if (
            error?.message === 'USUARIO_NAO_AUTENTICADO' ||
            error?.message === 'ACESSO_NEGADO'
        ) {
            return responderErroAcesso(res, error);
        }

        console.error(
            'Erro interno ao listar usuários:',
            error
        );

        return responderErro(
            res,
            500,
            'Erro ao listar usuários.'
        );
    }
}

// ==========================================
// DESATIVAR USUÁRIO
// ==========================================

export async function desativar(req, res) {
    try {
        const id = req.params.id;

        if (
            typeof id !== 'string' ||
            id.trim().length === 0
        ) {
            return responderErro(
                res,
                400,
                'Identificador de usuário inválido.'
            );
        }

        const usuario = await desativarUsuario(
            id,
            req.user
        );

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Usuário desativado com sucesso!',
            usuario
        });

    } catch (error) {
        const erros = {
            NAO_PODE_DESATIVAR_PROPRIA_CONTA: [
                400,
                'Você não pode desativar sua própria conta.'
            ],
            USUARIO_NAO_ENCONTRADO: [
                404,
                'Usuário não encontrado nesta empresa.'
            ],
            USUARIO_NAO_AUTENTICADO: [
                401,
                'Usuário não autenticado.'
            ],
            ACESSO_NEGADO: [
                403,
                'Acesso permitido somente à equipe de TI.'
            ]
        };

        const resposta = erros[error?.message];

        if (resposta) {
            return responderErro(
                res,
                resposta[0],
                resposta[1]
            );
        }

        console.error(
            'Erro interno ao desativar usuário:',
            error
        );

        return responderErro(
            res,
            500,
            'Erro interno ao desativar usuário.'
        );
    }
}
