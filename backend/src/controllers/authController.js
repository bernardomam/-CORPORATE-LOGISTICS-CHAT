
import { autenticarUsuario } from '../services/authService.js';

// ==========================================
// REALIZAR LOGIN
// ==========================================

export async function login(req, res) {
    try {
        // Validar o corpo da requisição.
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

        const { email } = dados;
        const senha = dados.password ?? dados.senha;

        // Validar credenciais e gerar o JWT.
        const resultado = await autenticarUsuario(
            email,
            senha
        );

        // ==========================================
        // RATE LIMITER - DEVOLVER TENTATIVA VÁLIDA
        // ==========================================

        // Logins bem-sucedidos não devem consumir
        // o limite de tentativas de autenticação.
        try {
            await req.devolverTentativaAuth?.();
        } catch (error) {
            console.error(
                'AUTH_LIMIT_REFUND_FAILED',
                error?.code
            );
        }

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

        // Não revelar informações sobre a existência
        // ou a situação do usuário e da empresa.
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

        // Respeitar o horário de funcionamento.
        if (codigo === 'FORA_DO_HORARIO') {
            return res.status(403).json({
                sucesso: false,
                mensagem:
                    'O CallZup funciona somente das 08h às 18h, no horário de Brasília.'
            });
        }

        // Verificar a configuração da autenticação.
        if (codigo === 'JWT_SECRET_NAO_CONFIGURADO') {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Configuração de autenticação incompleta.'
            });
        }

        // Registrar erros inesperados no servidor.
        console.error(
            'Erro interno ao realizar login:',
            error
        );

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno ao realizar login.'
        });
    }
}