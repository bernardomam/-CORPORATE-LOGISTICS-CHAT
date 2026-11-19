
import 'dotenv/config';
import express from 'express';

import { prisma } from './config/prisma.js';

// ==========================================
// IMPORTAÇÃO DAS ROTAS
// ==========================================

import companyRoutes from './routes/companyRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import myGroupRoutes from './routes/myGroupRoutes.js';
import groupMessageRoutes from './routes/groupMessageRoutes.js';
import chatRequestRoutes from './routes/chatRequestRoutes.js';
import privateChatRoutes from './routes/privateChatRoutes.js';

import { errorMiddleware } from './middlewares/errorMiddleware.js';

// ==========================================
// CONFIGURAÇÃO DO EXPRESS
// ==========================================

const app = express();

const PORT = Number(process.env.PORT) || 3001;

app.disable('x-powered-by');

app.set('trust proxy', false);

// ==========================================
// CABEÇALHOS DE SEGURANÇA
// ==========================================

app.use((req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-Frame-Options', 'DENY');
    res.set('Referrer-Policy', 'no-referrer');
    res.set('X-DNS-Prefetch-Control', 'off');

    next();
});

// ==========================================
// LIMITES DAS REQUISIÇÕES
// ==========================================

app.use(express.json({
    limit: '100kb',
    strict: true
}));

app.use(express.urlencoded({
    extended: false,
    limit: '100kb',
    parameterLimit: 100
}));

// ==========================================
// CONTROLE DE CACHE
// ==========================================

app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

// ==========================================
// ROTA PRINCIPAL
// ==========================================

app.get('/', (req, res) => {
    return res.status(200).json({
        sucesso: true,
        mensagem: 'API do CallZup funcionando'
    });
});

// ==========================================
// VERIFICAÇÃO DO SERVIDOR E BANCO
// ==========================================

app.get('/api/status', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Serviço disponível'
        });
    } catch (error) {
        console.error(
            'Falha na verificação de saúde da API:',
            error
        );

        return res.status(503).json({
            sucesso: false,
            mensagem: 'Serviço temporariamente indisponível'
        });
    }
});

// ==========================================
// ROTAS DA API
// ==========================================

app.use('/api/companies', companyRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

app.use('/api/groups', groupRoutes);

app.use('/api/my-groups', myGroupRoutes);

app.use('/api/group-messages', groupMessageRoutes);

app.use('/api/chat-requests', chatRequestRoutes);

app.use('/api/private-chats', privateChatRoutes);

// ==========================================
// ROTA NÃO ENCONTRADA
// ==========================================

app.use((req, res) => {
    return res.status(404).json({
        sucesso: false,
        mensagem: 'Rota não encontrada.'
    });
});

// ==========================================
// TRATAMENTO GLOBAL DE ERROS
// ==========================================

app.use(errorMiddleware);

// ==========================================
// EXPORTAÇÃO PARA O VERCEL
// ==========================================

export default app;

// ==========================================
// INICIALIZAÇÃO LOCAL
// ==========================================

if (process.env.VERCEL !== '1') {
    const server = app.listen(PORT, () => {
        console.log('================================');
        console.log('CALLZUP - BACKEND');
        console.log('================================');
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`Endereço local: http://localhost:${PORT}`);
        console.log('================================');
    });

    server.on('error', (error) => {
        console.error('Erro ao iniciar servidor:', error);
    });
}
