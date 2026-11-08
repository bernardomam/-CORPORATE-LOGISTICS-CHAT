import express from 'express';
import { login } from '../controllers/authController.js';
import { autenticarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', login);

router.get('/me', autenticarToken, (req, res) => {
    return res.status(200).json({
        sucesso: true,
        mensagem: 'Usuário autenticado com sucesso!',
        usuario: req.user
    });
});

export default router;