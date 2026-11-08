
import { prisma } from '../config/prisma.js';

// Cadastrar uma empresa
export async function createCompany(name) {
    return await prisma.company.create({
        data: {
            name: name.trim()
        }
    });
}

// Listar todas as empresas
export async function listCompanies() {
    return await prisma.company.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
}

// Buscar uma empresa pelo ID
export async function getCompanyById(id) {
    return await prisma.company.findUnique({
        where: {
            id
        }
    });
}

// Atualizar o nome de uma empresa
export async function updateCompany(id, name) {
    const company = await getCompanyById(id);

    if (!company) {
        return null;
    }

    return await prisma.company.update({
        where: {
            id
        },
        data: {
            name: name.trim()
        }
    });
}

// Desativar uma empresa sem apagar seus dados
export async function deactivateCompany(id) {
    const company = await getCompanyById(id);

    if (!company) {
        return null;
    }

    return await prisma.company.update({
        where: {
            id
        },
        data: {
            status: 'INACTIVE'
        }
    });
}
