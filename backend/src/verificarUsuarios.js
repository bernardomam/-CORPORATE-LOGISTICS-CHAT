
import 'dotenv/config';
import { prisma } from './config/prisma.js';

// ==========================================
// VERIFICAR EMPRESAS CADASTRADAS
// ==========================================

// Script administrativo para execução manual.
// Não disponibilizar por rotas HTTP.

async function verificarDados() {
    try {
        const empresas = await prisma.company.findMany({
            select: {
                id: true,
                name: true,
                status: true
            },
            orderBy: {
                name: 'asc'
            }
        });

        console.log('EMPRESAS CADASTRADAS:');

        console.table(empresas);

        console.log(
            `Total de empresas: ${empresas.length}`
        );

    } catch (error) {
        console.error(
            'Erro ao verificar empresas:',
            error.message
        );

        process.exitCode = 1;

    } finally {
        await prisma.$disconnect();
    }
}

verificarDados();
