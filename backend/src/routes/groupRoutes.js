
import express from 'express';

import {
    cadastrar,
    listar,
    atualizar,
    adicionar,
    remover,
    desativar
} from '../controllers/groupController.js';

import {
    autenticarToken,
    exigirTI
} from '../middlewares/authMiddleware.js';

const router = express.Router();

// Somente usuários autenticados da equipe de TI
router.use(autenticarToken, exigirTI);

// Criar grupo
router.post('/', cadastrar);

// Listar grupos
router.get('/', listar);

// Atualizar grupo
router.patch('/:id', atualizar);

// Adicionar integrante
router.post('/:id/members', adicionar);

// Remover integrante
router.delete('/:id/members/:userId', remover);

// Desativar grupo sem excluir registros
router.patch('/:id/desativar', desativar);

export default router;
