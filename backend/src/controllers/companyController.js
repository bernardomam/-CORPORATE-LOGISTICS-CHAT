
import {
    createCompany,
    listCompanies,
    getCompanyById,
    updateCompany,
    deactivateCompany
} from '../services/companyService.js';

// Cadastrar empresa
export async function createCompanyController(req, res) {
    try {
        const { name } = req.body;

        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O nome da empresa é obrigatório.'
            });
        }

        const company = await createCompany(name);

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Empresa cadastrada com sucesso!',
            empresa: company
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao cadastrar empresa.'
        });
    }
}

// Listar empresas
export async function listCompaniesController(req, res) {
    try {
        const companies = await listCompanies();

        return res.status(200).json({
            sucesso: true,
            total: companies.length,
            empresas: companies
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar empresas.'
        });
    }
}

// Buscar empresa pelo ID
export async function getCompanyByIdController(req, res) {
    try {
        const { id } = req.params;

        const company = await getCompanyById(id);

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
        console.error(error);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar empresa.'
        });
    }
}

// Atualizar empresa
export async function updateCompanyController(req, res) {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Informe um nome válido.'
            });
        }

        const company = await updateCompany(id, name);

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
        console.error(error);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao atualizar empresa.'
        });
    }
}

// Desativar empresa
export async function deactivateCompanyController(req, res) {
    try {
        const { id } = req.params;

        const company = await deactivateCompany(id);

        if (!company) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Empresa não encontrada.'
            });
        }

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Empresa desativada com sucesso!',
            empresa: company
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao desativar empresa.'
        });
    }
}
