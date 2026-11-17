
import {
    listCompanies,
    getCompanyById,
    updateCompany
} from '../services/companyService.js';

// Listar empresa do usuário autenticado.
export async function listCompaniesController(req, res, next) {
    try {
        const companies = await listCompanies(req.user);

        return res.status(200).json({
            sucesso: true,
            total: companies.length,
            empresas: companies
        });
    } catch (error) {
        return next(error);
    }
}

// Buscar empresa pelo ID.
export async function getCompanyByIdController(req, res, next) {
    try {
        const { id } = req.params;

        const company = await getCompanyById(req.user, id);

        if (!company) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Empresa não encontrada.'
            });
        }

        return res.status(200).json({
            sucesso: true,
            empresa: company
        });
    } catch (error) {
        return next(error);
    }
}

// Atualizar empresa.
export async function updateCompanyController(req, res, next) {
    try {
        const { id } = req.params;

        const dados = req.body;

        if (
            !dados ||
            typeof dados !== 'object' ||
            Array.isArray(dados) ||
            typeof dados.name !== 'string' ||
            !dados.name.trim()
        ) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Informe um nome válido.'
            });
        }

        const company = await updateCompany(
            req.user,
            id,
            dados.name.trim()
        );

        if (!company) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Empresa não encontrada.'
            });
        }

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Empresa atualizada com sucesso!',
            empresa: company
        });
    } catch (error) {
        return next(error);
    }
}
