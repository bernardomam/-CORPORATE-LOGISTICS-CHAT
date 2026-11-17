import express from 'express';
import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { prisma } from './config/prisma.js';
import companyRoutes from './routes/companyRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: true, limit: '32kb' }));
app.use(express.static(path.resolve(__dirname, '../public')));

app.use('/api/companies', companyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.status(200).json({
    sucesso: true,
    mensagem: 'API do Callzup funcionando!',
    sistema: 'Callzup',
    versao: '1.0.0'
}));

app.get('/api/status', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return res.status(200).json({
            sucesso: true,
            mensagem: 'Servidor funcionando corretamente!',
            bancoDeDados: 'Conectado',
            sistema: 'Callzup'
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

app.use((req, res) => res.status(404).json({
    sucesso: false,
    mensagem: 'Rota não encontrada.',
    rota: req.originalUrl
}));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Callzup API iniciada na porta ${PORT}`);
});

async function encerrarServidor() {
    server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
    });
}

process.on('SIGINT', encerrarServidor);
process.on('SIGTERM', encerrarServidor);
