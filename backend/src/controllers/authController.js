import { autenticarUsuario } from '../services/authService.js';

// ==========================================
// REALIZAR LOGIN
// ==========================================

export async function login(req, res) {
    try {
        // Evitar erro quando o corpo da requisição
        // estiver ausente ou for inválido.
        const dados = req.body;

        if (
            !dados ||
            typeof dados !== 'object' ||
            Array.isArray(dados)
        ) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'E-mail e senha são obrigatórios.'
            });
        }

        const { email, password } = dados;

        // A validação das credenciais e a geração
        // do JWT acontecem no serviço de autenticação.
        const resultado = await autenticarUsuario(
            email,
            password
        );

        // Evitar armazenamento do token em cache.
        res.set('Cache-Control', 'no-store');

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Login realizado com sucesso!',
            token: resultado.token,
            usuario: resultado.usuario
        });

    } catch (error) {
        const codigo = error?.message;

        // Não revelar se o e-mail existe,
        // se o usuário foi desativado ou
        // se a empresa está inativa.
        const errosDeCredenciais = new Set([
            'CREDENCIAIS_INVALIDAS',
            'USUARIO_INATIVO',
            'EMPRESA_INATIVA'
        ]);

        if (errosDeCredenciais.has(codigo)) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'E-mail ou senha incorretos.'
            });
        }

        if (codigo === 'EMAIL_SENHA_OBRIGATORIOS') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'E-mail e senha são obrigatórios.'
            });
        }

        // Preservar a regra de horário existente.
        if (codigo === 'FORA_DO_HORARIO') {
            return res.status(403).json({
                sucesso: false,
                mensagem:
                    'O CallZup funciona somente das 08h às 18h, no horário de Brasília.'
            });
        }

        if (codigo === 'JWT_SECRET_NAO_CONFIGURADO') {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Configuração de autenticação incompleta.'
            });
        }

        // Registrar erros inesperados somente no servidor.
        console.error('Erro interno ao realizar login:', error);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno ao realizar login.'
        });
    }
}
