import { executarComContextoRLS } from '../config/rlsContext.js';

function validarEmpresa(usuario) {
    if (!usuario?.companyId) {
        const error = new Error('Empresa do usuário não identificada.');
        error.status = 401;
        throw error;
    }
}

const camposEmpresa = {
    id: true,
    name: true,
    status: true,
    createdAt: true,
    updatedAt: true
};

// Listar somente a empresa do usuário autenticado.
export async function listCompanies(usuario) {
    validarEmpresa(usuario);

    return executarComContextoRLS(usuario, async (tx) => {
        return tx.company.findMany({
            where: {
                id: usuario.companyId
            },
            select: camposEmpresa
        });
    });
}

// Buscar somente a própria empresa.
export async function getCompanyById(usuario, id) {
    validarEmpresa(usuario);

    if (id !== usuario.companyId) {
        return null;
    }

    return executarComContextoRLS(usuario, async (tx) => {
        return tx.company.findFirst({
            where: {
                id: usuario.companyId
            },
            select: camposEmpresa
        });
    });
}

// Atualizar somente a própria empresa.
export async function updateCompany(usuario, id, name) {
    validarEmpresa(usuario);
    if (usuario.role !== 'IT_ADMIN') {
        const error = new Error('Acesso permitido somente à equipe de TI.');
        error.status = 403;
        throw error;
    }
    if (typeof name !== 'string' || !name.trim() || name.trim().length > 150) {
        const error = new Error('Informe um nome válido de até 150 caracteres.');
        error.status = 400;
        throw error;
    }

    if (id !== usuario.companyId) {
        return null;
    }

    return executarComContextoRLS(usuario, async (tx) => {
        const empresa = await tx.company.findFirst({
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

        return tx.company.update({
            where: {
                id: usuario.companyId
            },
            data: {
                name: name.trim()
            },
            select: camposEmpresa
        });
    });
}
