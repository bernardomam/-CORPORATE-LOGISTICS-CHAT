import { prisma } from './config/prisma.js';

async function verificarDados() {
    try {
        const empresas = await prisma.company.findMany({
            select: {
                id: true,
                name: true,
                status: true
            }
        });

        console.log('EMPRESAS CADASTRADAS:');
        console.table(empresas);

    } catch (error) {
        console.error('Erro:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

verificarDados();