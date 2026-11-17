
import express from 'express';

import {
    listarMeusGruposController
} from '../controllers/myGroupController.js';

import {
    autenticarToken
} from '../middlewares/authMiddleware.js';

const router = express.Router();

// Somente usuarios autenticados
router.use(autenticarToken);

// Listar grupos dos quais o usuario participa
router.get('/', listarMeusGruposController);

export default router;
