
import {
    criarUsuario,
    listarUsuarios,
    desativarUsuario
} from '../services/userService.js';

export async function cadastrar(req, res) {
    try {
        const usuario = await criarUsuario({
            ...req.body,
            companyId: req.user.companyId
        });

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Usuário cadastrado com sucesso!',
            usuario
        });
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error.message);

        const erros = {
            CAMPOS_OBRIGATORIOS: [400, 'Preencha nome, e-mail e senha.'],
            SENHA_MINIMA: [400, 'A senha deve ter pelo menos 8 caracteres.'],
            DEPARTAMENTO_INVALIDO: [400, 'Departamento inválido para esta empresa.']
        };

        if (error.code === 'P2002') {
            return res.status(409).json({
                sucesso: false,
                mensagem: 'Este e-mail já está cadastrado.'
            });
        }

        const resposta = erros[error.message];

        if (resposta) {
            return res.status(resposta[0]).json({
                sucesso: false,
                mensagem: resposta[1]
            });
        }

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno ao cadastrar usuário.'
        });
    }
}

export async function listar(req, res) {
    try {
        const usuarios = await listarUsuarios(req.user.companyId);

        return res.status(200).json({
            sucesso: true,
            total: usuarios.length,
            usuarios
        });
    } catch (error) {
        console.error('Erro ao listar usuários:', error);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar usuários.'
        });
    }
}

export async function desativar(req, res) {
    try {
        const usuario = await desativarUsuario(
            req.params.id,
            req.user.companyId,
            req.user.id
        );

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Usuário desativado com sucesso!',
            usuario
        });
    } catch (error) {
        const erros = {
            USUARIO_NAO_ENCONTRADO: [404, 'Usuário não encontrado nesta empresa.'],
            NAO_PODE_DESATIVAR_PROPRIA_CONTA: [403, 'Você não pode desativar sua própria conta.']
        };

        const resposta = erros[error.message];

        if (resposta) {
            return res.status(resposta[0]).json({
                sucesso: false,
                mensagem: resposta[1]
            });
        }

        console.error('Erro ao desativar usuário:', error);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno ao desativar usuário.'
        });
    }
}
