
import 'dotenv/config';
import express from 'express';

import { prisma } from './config/prisma.js';

import companyRoutes from './routes/companyRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import myGroupRoutes from './routes/myGroupRoutes.js';
import groupMessageRoutes from './routes/groupMessageRoutes.js';
import chatRequestRoutes from './routes/chatRequestRoutes.js';
import privateChatRoutes from './routes/privateChatRoutes.js';

import { errorMiddleware } from './middlewares/errorMiddleware.js';

const app = express();

const PORT = Number(process.env.PORT) || 3001;
const FUSO_HORARIO = 'America/Sao_Paulo';

// Origens autorizadas, separadas por vírgula na variável FRONTEND_URL.
// Exemplo:
// FRONTEND_URL=https://meu-frontend.vercel.app,http://localhost:5173
const origensConfiguradas = (process.env.FRONTEND_URL || '')
    .split(',')
    .map((origem) => origem.trim().replace(/\/$/, ''))
    .filter(Boolean);

const ORIGENS_PERMITIDAS = new Set([
    'https://corporate-logistics-chat-w67h.vercel.app',
    ...origensConfiguradas
]);

if (process.env.NODE_ENV !== 'production') {
    ORIGENS_PERMITIDAS.add('http://localhost:5173');
    ORIGENS_PERMITIDAS.add('http://localhost:3000');
}

app.disable('x-powered-by');

// ================================
// CORS
// ================================

app.use((req, res, next) => {
    const origem = req.headers.origin;

    res.vary('Origin');

    if (origem && ORIGENS_PERMITIDAS.has(origem)) {
        res.setHeader('Access-Control-Allow-Origin', origem);
    }

    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    );

    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
    );

    res.setHeader('Access-Control-Max-Age', '86400');

    if (req.method === 'OPTIONS') {
        if (origem && !ORIGENS_PERMITIDAS.has(origem)) {
            return res.status(403).json({
                sucesso: false,
                mensagem: 'Origem não autorizada.'
            });
        }

        return res.status(204).end();
    }

    next();
});

// ================================
// CABEÇALHOS DE SEGURANÇA
// ================================

app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-DNS-Prefetch-Control', 'off');
    next();
});

// ================================
// PROCESSAMENTO DE REQUISIÇÕES
// ================================

app.use(express.json({
    limit: '100kb',
    strict: true
}));

app.use(express.urlencoded({
    extended: false,
    limit: '100kb',
    parameterLimit: 100
}));

app.use('/api', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
});

// ================================
// HORÁRIO DE BRASÍLIA
// ================================

function obterHorarioBrasilia(data = new Date()) {
    return new Intl.DateTimeFormat('pt-BR', {
        timeZone: FUSO_HORARIO,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).format(data);
}

// ================================
// ROTA PRINCIPAL
// ================================

app.get('/', (req, res) => {
    return res.status(200).json({
        sucesso: true,
        mensagem: 'API do Callzup funcionando',
        horarioServidor: obterHorarioBrasilia(),
        fusoHorario: FUSO_HORARIO
    });
});

// ================================
// STATUS DA API E SUPABASE
// ================================

app.get('/api/health', (req, res) => {
    return res.status(200).json({ sucesso: true, mensagem: 'API disponível' });
});

app.get('/api/status', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Serviço disponível',
            bancoDeDados: 'Conectado',
            horarioServidor: obterHorarioBrasilia(),
            fusoHorario: FUSO_HORARIO
        });
    } catch (error) {
        console.error(
            'Erro ao verificar conexão com o banco:',
            error
        );

        return res.status(503).json({
            sucesso: false,
            mensagem: 'Serviço temporariamente indisponível',
            bancoDeDados: 'Desconectado',
            horarioServidor: obterHorarioBrasilia(),
            fusoHorario: FUSO_HORARIO
        });
    }
});

// ================================
// ROTAS
// ================================

app.use('/api/companies', companyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/my-groups', myGroupRoutes);
app.use('/api/group-messages', groupMessageRoutes);
app.use('/api/chat-requests', chatRequestRoutes);
app.use('/api/private-chats', privateChatRoutes);

// ================================
// ROTA NÃO ENCONTRADA
// ================================

app.use((req, res) => {
    return res.status(404).json({
        sucesso: false,
        mensagem: 'Rota não encontrada.',
        caminho: req.path
    });
});

// ================================
// TRATAMENTO GLOBAL DE ERROS
// ================================

app.use(errorMiddleware);

// ================================
// EXPORTAÇÃO PARA A VERCEL
// ================================

export default app;

// ================================
// INICIALIZAÇÃO LOCAL
// ================================

if (process.env.VERCEL !== '1') {
    const server = app.listen(PORT, () => {
        console.log('================================');
        console.log('CALLZUP - BACKEND');
        console.log(`Porta: ${PORT}`);
        console.log(`URL: http://localhost:${PORT}`);
        console.log(`Horário: ${obterHorarioBrasilia()}`);
        console.log('================================');
    });

    server.on('error', (error) => {
        console.error('Erro ao iniciar o servidor:', error);
    });
}
