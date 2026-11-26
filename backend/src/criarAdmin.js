
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from './config/prisma.js';

// ==========================================
// CONFIGURAÇÃO DO ADMINISTRADOR INICIAL
// ==========================================

// Empresa à qual o administrador de TI pertence.
const empresaId = '796ea931-87a4-472c-a324-ca5be27604cd';

// Este script só deve ser executado manualmente.
// Nunca disponibilizar por uma rota HTTP.

async function criarAdministrador() {
    // Exigir autorização explícita para executar.
    if (
        process.env.PERMITIR_CRIACAO_ADMIN !== 'SIM'
    ) {
        throw new Error(
            'Criação de administrador bloqueada. ' +
            'Defina PERMITIR_CRIACAO_ADMIN=SIM ' +
            'somente durante a configuração inicial.'
        );
    }

    const senha = process.env.ADMIN_PASSWORD;

    if (
        typeof senha !== 'string' ||
        senha.length < 12
    ) {
        throw new Error(
            'A senha deve possuir pelo menos 12 caracteres.'
        );
    }

    // Impedir a criação de outro administrador inicial.
    const totalUsuarios = await prisma.user.count();

    if (totalUsuarios > 0) {
        throw new Error(
            'Já existem usuários cadastrados. ' +
            'Criação inicial cancelada.'
        );
    }

    // Verificar se a empresa existe e está ativa.
    const empresa = await prisma.company.findUnique({
        where: {
            id: empresaId
        },
        select: {
            id: true,
            status: true
        }
    });

    if (
        !empresa ||
        empresa.status !== 'ACTIVE'
    ) {
        throw new Error(
            'Empresa não encontrada ou inativa.'
        );
    }

    // Criptografar a senha.
    const passwordHash = await bcrypt.hash(senha, 12);

    // Criar o administrador de TI.
    const administrador = await prisma.user.create({
        data: {
            name: 'João Gabriel',
            email: 'gabrielsouza.o.oliveira24@gmail.com',
            passwordHash,
            role: 'IT_ADMIN',
            status: 'ACTIVE',
            companyId: empresaId
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            companyId: true
        }
    });

    console.log(
        'Administrador inicial criado com sucesso.'
    );

    console.log(administrador);
}

// ==========================================
// EXECUÇÃO E ENCERRAMENTO
// ==========================================

criarAdministrador()
    .catch((error) => {
        console.error(
            'Erro ao criar administrador:',
            error.message
        );

        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
