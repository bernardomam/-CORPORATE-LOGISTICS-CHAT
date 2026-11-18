
import express from 'express';

import {
    solicitar,
    listar,
    aprovar,
    rejeitar
} from '../controllers/chatRequestController.js';

import {
    autenticarToken,
    exigirTI
} from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas as rotas exigem autenticação
router.use(autenticarToken);

// Usuários autenticados podem solicitar conversas
router.post('/', solicitar);

// Somente a equipe de TI pode consultar solicitações
router.get('/', exigirTI, listar);

// Somente a equipe de TI pode aprovar solicitações
router.patch('/:id/aprovar', exigirTI, aprovar);

// Somente a equipe de TI pode rejeitar solicitações
router.patch('/:id/rejeitar', exigirTI, rejeitar);

export default router;
