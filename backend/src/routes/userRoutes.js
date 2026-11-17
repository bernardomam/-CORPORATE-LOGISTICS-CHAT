
import { Router } from 'express';

import {
    cadastrar,
    listar,
    desativar
} from '../controllers/userController.js';

import {
    autenticarToken,
    exigirTI
} from '../middlewares/authMiddleware.js';

const router = Router();

// ==========================================
// PROTEÇÃO DAS ROTAS DE USUÁRIOS
// ==========================================

// Todas as rotas abaixo exigem:
// 1. JWT válido
// 2. Usuário ativo
// 3. Empresa ativa
// 4. Perfil IT_ADMIN
router.use(autenticarToken, exigirTI);

// ==========================================
// ADMINISTRAÇÃO DE USUÁRIOS
// ==========================================

// Cadastrar usuário
router.post('/', cadastrar);

// Listar usuários
router.get('/', listar);

// Desativar usuário
router.patch('/:id/desativar', desativar);

export default router;
