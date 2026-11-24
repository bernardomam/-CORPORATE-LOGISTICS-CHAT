
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

const router = express.Router();

// Somente usuarios autenticados
router.use(autenticarToken);

// Consultar mensagens de um grupo
router.get('/:id', listarMensagens);

// Enviar mensagem ou responder a outra mensagem
router.post('/:id', verificarHorarioMensagens, enviarMensagem);

// Adicionar ou atualizar uma reacao
router.post('/:id/messages/:mensagemId/reactions', reagirMensagem);

// Remover a propria reacao
router.delete('/:id/messages/:mensagemId/reactions', removerReacaoMensagem);

export default router;
