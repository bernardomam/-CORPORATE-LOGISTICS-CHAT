
import { prisma } from '../config/prisma.js';

// Listar somente a empresa do usuário autenticado.
export async function listCompanies(usuario) {
    if (!usuario?.companyId) {
        const error = new Error('Empresa do usuário não identificada.');
        error.status = 401;
        throw error;
    }

    return await prisma.company.findMany({
        where: {
            id: usuario.companyId
        },
        select: {
            id: true,
            name: true,
            status: true,
            createdAt: true,
            updatedAt: true
        }
    });
}

// Buscar somente a própria empresa.
export async function getCompanyById(usuario, id) {
    if (!usuario?.companyId) {
        const error = new Error('Empresa do usuário não identificada.');
        error.status = 401;
        throw error;
    }

    if (id !== usuario.companyId) {
        return null;
    }

    return await prisma.company.findFirst({
        where: {
            id: usuario.companyId
        },
        select: {
            id: true,
            name: true,
            status: true,
            createdAt: true,
            updatedAt: true
        }
    });
}

// Atualizar somente a própria empresa.
export async function updateCompany(usuario, id, name) {
    if (!usuario?.companyId) {
        const error = new Error('Empresa do usuário não identificada.');
        error.status = 401;
        throw error;
    }

    if (id !== usuario.companyId) {
        return null;
    }

    const empresa = await prisma.company.findFirst({
        where: {
            id: usuario.companyId
        },
        select: {
            id: true
        }
    });

    if (!empresa) {
        return null;
    }

    return await prisma.company.update({
        where: {
            id: usuario.companyId
        },
        data: {
            name: name.trim()
        },
        select: {
            id: true,
            name: true,
            status: true,
            createdAt: true,
            updatedAt: true
        }
    });
}
