
import { Router } from 'express';
import { login } from '../controllers/authController.js';
import { autenticarToken } from '../middlewares/authMiddleware.js';

import { alterarSenha } from '../services/authService.js';
import { responderFalha } from '../utils/adminValidation.js';
import { limitarAuth } from '../middlewares/distributedAuthLimit.js';
const router = Router();

// ==========================================
// PROTEÇÃO CONTRA TENTATIVAS DE LOGIN
// ==========================================

// ==========================================
// ROTAS DE AUTENTICAÇÃO
// ==========================================

// Realizar login com limite de tentativas.
router.post('/login', limitarAuth, login);

// Consultar os dados do usuário autenticado.
router.get('/me', autenticarToken, (req, res) => {
    res.set('Cache-Control', 'no-store');

    return res.status(200).json({
        sucesso: true,
        usuario: req.user
    });
});

router.patch('/password', autenticarToken, limitarAuth, async(req,res,next)=>{
    try{await alterarSenha(req.user,req.body?.currentPassword,req.body?.newPassword);return res.json({sucesso:true,mensagem:'Senha alterada com sucesso.'});}
    catch(e){return responderFalha(e,res,next);}
});
export default router;
