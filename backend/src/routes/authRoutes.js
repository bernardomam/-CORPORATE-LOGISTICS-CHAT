
import { Router } from 'express';
import { login } from '../controllers/authController.js';
import { autenticarToken } from '../middlewares/authMiddleware.js';

const router = Router();

// ==========================================
// PROTEÇÃO CONTRA TENTATIVAS DE LOGIN
// ==========================================

const tentativasLogin = new Map();

const JANELA_TEMPO = 15 * 60 * 1000;
const MAX_TENTATIVAS = 10;

function limitarTentativasLogin(req, res, next) {
    const agora = Date.now();
    const ip = req.ip || req.socket.remoteAddress || 'desconhecido';

    // Limpar registros expirados.
    for (const [chave, registro] of tentativasLogin.entries()) {
        if (agora >= registro.expiraEm) {
            tentativasLogin.delete(chave);
        }
    }

    let registro = tentativasLogin.get(ip);

    if (!registro) {
        registro = {
            tentativas: 0,
            expiraEm: agora + JANELA_TEMPO
        };

        tentativasLogin.set(ip, registro);
    }

    if (registro.tentativas >= MAX_TENTATIVAS) {
        const segundosRestantes = Math.ceil(
            (registro.expiraEm - agora) / 1000
        );

        res.set('Retry-After', String(segundosRestantes));

        return res.status(429).json({
            sucesso: false,
            mensagem:
                'Muitas tentativas de login. Aguarde antes de tentar novamente.'
        });
    }

    registro.tentativas += 1;

    return next();
}

// ==========================================
// ROTAS DE AUTENTICAÇÃO
// ==========================================

// Realizar login com limite de tentativas.
router.post('/login', limitarTentativasLogin, login);

// Consultar os dados do usuário autenticado.
router.get('/me', autenticarToken, (req, res) => {
    res.set('Cache-Control', 'no-store');

    return res.status(200).json({
        sucesso: true,
        usuario: req.user
    });
});

export default router;
