
import { Router } from 'express';
import { login } from '../controllers/authController.js';
import { autenticarToken } from '../middlewares/authMiddleware.js';

import { alterarSenha } from '../services/authService.js';
import { responderFalha } from '../utils/adminValidation.js';
const router = Router();

// ==========================================
// PROTEÇÃO CONTRA TENTATIVAS DE LOGIN
// ==========================================

const tentativasLogin = new Map();

const JANELA_TEMPO = 15 * 60 * 1000;
const MAX_TENTATIVAS = 10;
const MAX_REGISTROS = 10000;
let proximaLimpeza = 0;

function limitarTentativasLogin(req, res, next) {
    const agora = Date.now();
    const ip = req.ip || req.socket.remoteAddress || 'desconhecido';

    // Limpar registros expirados.
    if (agora >= proximaLimpeza) {
        for (const [chave, registro] of tentativasLogin.entries()) {
            if (agora >= registro.expiraEm) tentativasLogin.delete(chave);
        }
        proximaLimpeza = agora + 60000;
    }

    let registro = tentativasLogin.get(ip);

    if (!registro || agora >= registro.expiraEm) {
        if (!registro && tentativasLogin.size >= MAX_REGISTROS) {
            res.set('Retry-After', '60');
            return res.status(429).json({ sucesso: false, mensagem: 'Muitas tentativas. Tente novamente em instantes.' });
        }
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

router.patch('/password', autenticarToken, limitarTentativasLogin, async(req,res,next)=>{
    try{await alterarSenha(req.user,req.body?.currentPassword,req.body?.newPassword);return res.json({sucesso:true,mensagem:'Senha alterada com sucesso.'});}
    catch(e){return responderFalha(e,res,next);}
});
export default router;
