import { Router } from 'express';

import {
    createCompanyController,
    listCompaniesController,
    getCompanyByIdController,
    updateCompanyController,
    deactivateCompanyController
} from '../controllers/companyController.js';

const router = Router();

// Cadastrar empresa
router.post('/', createCompanyController);

// Listar empresas
router.get('/', listCompaniesController);

// Buscar empresa pelo ID
router.get('/:id', getCompanyByIdController);

// Atualizar empresa
router.put('/:id', updateCompanyController);

// Desativar empresa
router.patch('/:id/deactivate', deactivateCompanyController);

export default router;