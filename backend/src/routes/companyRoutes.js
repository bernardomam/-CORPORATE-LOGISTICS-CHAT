import { Router } from 'express';
import { autenticarToken, exigirTI } from '../middlewares/authMiddleware.js';
import {
    getCompanyByIdController,
    updateCompanyController,
    deactivateCompanyController
} from '../controllers/companyController.js';

const router = Router();

// A conta IT_ADMIN administra apenas a própria empresa.
// Criar/listar empresas globalmente exige uma futura função de administrador da plataforma.
router.use(autenticarToken, exigirTI);

router.get('/', (req, res) => {
    return res.redirect(307, `/api/companies/${req.user.companyId}`);
});

router.use('/:id', (req, res, next) => {
    if (req.params.id !== req.user.companyId) {
        return res.status(403).json({
            sucesso: false,
            mensagem: 'Acesso negado a outra empresa.'
        });
    }
    next();
});

router.get('/:id', getCompanyByIdController);
router.put('/:id', updateCompanyController);
router.patch('/:id/deactivate', deactivateCompanyController);

export default router;
