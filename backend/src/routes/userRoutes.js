
import express from 'express';

import {
    cadastrar,
    listar,
    desativar
} from '../controllers/userController.js';

import {
    autenticarToken,
    exigirTI
} from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas as rotas exigem autenticação e permissão de TI
router.use(autenticarToken, exigirTI);

// Cadastrar usuário
router.post('/', cadastrar);

// Listar usuários da empresa
router.get('/', listar);

// Desativar usuário
router.patch('/:id/desativar', desativar);

export default router;
