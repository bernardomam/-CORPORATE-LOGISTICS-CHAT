
import express from 'express';

import {
    listarMensagens,
    enviarMensagem,
    reagirMensagem,
    removerReacaoMensagem
} from '../controllers/groupMessageController.js';

import {
    autenticarToken
} from '../middlewares/authMiddleware.js';

import {
    verificarHorarioMensagens
} from '../middlewares/horarioMensagens.js';

import { listarMeusGrupos } from '../services/myGroupService.js';

const router = express.Router();

router.use(autenticarToken);

router.get('/', async (req, res, next) => {
    try {
        const grupos = await listarMeusGrupos(req.user);
        return res.json({ sucesso: true, total: grupos.length, grupos });
    } catch (error) {
        return next(error);
    }
});

// Consultar histórico de mensagens.
router.get('/:id', listarMensagens);

// Enviar mensagem ou resposta no expediente.
router.post(
    '/:id',
    verificarHorarioMensagens,
    enviarMensagem
);

// Adicionar ou atualizar uma reação.
router.post(
    '/:id/messages/:mensagemId/reactions',
    reagirMensagem
);

// Remover a própria reação.
router.delete(
    '/:id/messages/:mensagemId/reactions',
    removerReacaoMensagem
);

export default router;
