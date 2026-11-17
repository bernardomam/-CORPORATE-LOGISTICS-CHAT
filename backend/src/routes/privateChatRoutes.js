
import express from 'express';

import {
    listarConversas,
    listarMensagens,
    enviarMensagem,
    reagirMensagem,
    removerReacaoMensagem
} from '../controllers/privateChatController.js';

import {
    autenticarToken
} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(autenticarToken);

router.get('/', listarConversas);
router.get('/:id/messages', listarMensagens);
router.post('/:id/messages', enviarMensagem);

router.post(
    '/:id/messages/:mensagemId/reactions',
    reagirMensagem
);

router.delete(
    '/:id/messages/:mensagemId/reactions',
    removerReacaoMensagem
);

export default router;
