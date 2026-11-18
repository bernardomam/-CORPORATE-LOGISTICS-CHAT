
import { Router } from 'express';

import {
    listCompaniesController,
    getCompanyByIdController,
    updateCompanyController
} from '../controllers/companyController.js';

import {
    autenticarToken,
    exigirTI
} from '../middlewares/authMiddleware.js';

const router = Router();

router.use(autenticarToken, exigirTI);

router.get('/', listCompaniesController);
router.get('/:id', getCompanyByIdController);
router.put('/:id', updateCompanyController);

export default router;
