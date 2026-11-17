import express from 'express';
import {
    cadastrar,
    listar,
    desativar
} from '../controllers/usercontrollers.js';
import {
    autenticarToken,
    exigirTI
} from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(autenticarToken, exigirTI);

router.post('/', cadastrar);
router.get('/', listar);
router.patch('/:id/desativar', desativar);

export default router;
