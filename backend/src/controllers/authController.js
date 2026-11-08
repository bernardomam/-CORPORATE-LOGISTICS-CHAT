import { autenticarUsuario } from '../services/authService.js';

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const resultado = await autenticarUsuario(email, password);

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Login realizado com sucesso!',
            token: resultado.token,
            usuario: resultado.usuario
        });

    } catch (error) {
        console.error('Erro na autenticação:', error.message);

        const erros = {
            EMAIL_SENHA_OBRIGATORIOS: [400, 'E-mail e senha são obrigatórios.'],
            CREDENCIAIS_INVALIDAS: [401, 'E-mail ou senha incorretos.'],
            USUARIO_INATIVO: [403, 'Usuário desativado. Procure a equipe de TI.'],
            EMPRESA_INATIVA: [403, 'Empresa inativa. Procure a equipe de TI.'],
            JWT_SECRET_NAO_CONFIGURADO: [500, 'Configuração de autenticação incompleta.']
        };

        const resposta = erros[error.message];

        if (resposta) {
            return res.status(resposta[0]).json({
                sucesso: false,
                mensagem: resposta[1]
            });
        }

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno ao realizar login.'
        });
    }
}