
import express from 'express';
import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { prisma } from './config/prisma.js';
import companyRoutes from './routes/companyRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Caminho da pasta public
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// CONFIGURAÇÕES DO SERVIDOR
// ==========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Disponibiliza os arquivos HTML, CSS e JavaScript
app.use(express.static(path.resolve(__dirname, '../public')));

// ==========================================
// ROTAS DO SISTEMA
// ==========================================

app.use('/api/companies', companyRoutes);
app.use('/api/auth', authRoutes);

// ==========================================
// ROTA PRINCIPAL
// ==========================================

app.get('/', (req, res) => {
    return res.status(200).json({
        sucesso: true,
        mensagem: 'API do Calzup funcionando!',
        sistema: 'Calzup',
        versao: '1.0.0'
    });
});

// ==========================================
// STATUS DO SERVIDOR E BANCO DE DADOS
// ==========================================

app.get('/api/status', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Servidor funcionando corretamente!',
            bancoDeDados: 'Conectado',
            sistema: 'Calzup'
        });

    } catch (error) {
        console.error('Erro ao verificar banco:', error);

        return res.status(503).json({
            sucesso: false,
            mensagem: 'Servidor ativo, mas o banco de dados está indisponível.',
            bancoDeDados: 'Desconectado'
        });
    }
});

// ==========================================
// TRATAMENTO DE ROTAS NÃO ENCONTRADAS
// ==========================================

app.use((req, res) => {
    return res.status(404).json({
        sucesso: false,
        mensagem: 'Rota não encontrada.',
        rota: req.originalUrl
    });
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log('================================');
    console.log('CALZUP - BACKEND');
    console.log('================================');
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
    console.log(`Login: http://localhost:${PORT}/login.html`);
    console.log(`Status: http://localhost:${PORT}/api/status`);
    console.log(`Empresas: http://localhost:${PORT}/api/companies`);
    console.log(`Autenticação: http://localhost:${PORT}/api/auth/login`);
    console.log('================================');
});

// ==========================================
// ENCERRAMENTO ORGANIZADO
// ==========================================

async function encerrarServidor() {
    server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
    });
}

process.on('SIGINT', encerrarServidor);
process.on('SIGTERM', encerrarServidor);
