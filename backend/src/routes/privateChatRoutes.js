
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

import {
    verificarHorarioMensagens
} from '../middlewares/horarioMensagens.js';

const router = express.Router();

router.use(autenticarToken);

// Listar conversas privadas.
router.get('/', listarConversas);

// Consultar mensagens.
router.get('/:id/messages', listarMensagens);

// Enviar mensagem ou resposta no expediente.
router.post(
    '/:id/messages',
    verificarHorarioMensagens,
    enviarMensagem
);

// Adicionar ou atualizar reação.
router.post(
    '/:id/messages/:mensagemId/reactions',
    reagirMensagem
);

// Remover reação.
router.delete(
    '/:id/messages/:mensagemId/reactions',
    removerReacaoMensagem
);

export default router;
