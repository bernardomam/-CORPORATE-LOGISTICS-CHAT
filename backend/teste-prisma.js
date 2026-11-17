import { prisma } from './src/config/prisma.js';

async function testarConexao() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        console.log('Prisma iniciado!');
        console.log('Conexão com o PostgreSQL estabelecida!');
    } catch (erro) {
        console.error('Erro ao conectar com o banco:');
        console.error(erro.message);
        process.exitCode = 1;
    } finally {
        await prisma.$disconnect();
    }
}

testarConexao();