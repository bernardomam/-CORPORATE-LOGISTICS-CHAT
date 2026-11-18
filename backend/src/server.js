
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

const FRONTEND_URL =
    process.env.FRONTEND_URL ||
    'https://corporate-logistics-chat-w67h.vercel.app';

const ORIGENS_PERMITIDAS = new Set([
    'https://corporate-logistics-chat-w67h.vercel.app',
    FRONTEND_URL
]);

const FUSO_HORARIO = 'America/Sao_Paulo';

app.disable('x-powered-by');

app.set('trust proxy', false);

// ==========================================
// CONFIGURAÇÃO DO CORS
// ==========================================

app.use((req, res, next) => {

    const origem = req.headers.origin;

    if (ORIGENS_PERMITIDAS.has(origem)) {
        res.setHeader(
            'Access-Control-Allow-Origin',
            origem
        );
    }

    res.setHeader('Vary', 'Origin');

    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    );

    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
    );

    res.setHeader(
        'Access-Control-Max-Age',
        '86400'
    );

    // Responder à verificação prévia do navegador.
    if (req.method === 'OPTIONS') {
        if (origem && !ORIGENS_PERMITIDAS.has(origem)) {
            return res.status(403).end();
        }

        return res.status(204).end();
    }

    next();
});

// ==========================================
// CABEÇALHOS DE SEGURANÇA
// ==========================================

app.use((req, res, next) => {

    res.set(
        'X-Content-Type-Options',
        'nosniff'
    );

    res.set(
        'X-Frame-Options',
        'DENY'
    );

    res.set(
        'Referrer-Policy',
        'no-referrer'
    );

    res.set(
        'X-DNS-Prefetch-Control',
        'off'
    );

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

    res.set(
        'Cache-Control',
        'no-store'
    );

    next();
});

// ==========================================
// FUNÇÃO DE HORÁRIO DE BRASÍLIA
// ==========================================

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

// ==========================================
// ROTA PRINCIPAL
// ==========================================

app.get('/', (req, res) => {

    return res.status(200).json({
        sucesso: true,
        mensagem: 'API do CalZup funcionando',
        horarioServidor: obterHorarioBrasilia(),
        fusoHorario: FUSO_HORARIO
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
            mensagem: 'Serviço disponível',
            bancoDeDados: 'Conectado',
            horarioServidor: obterHorarioBrasilia(),
            fusoHorario: FUSO_HORARIO
        });

    } catch (error) {

        console.error(
            'Falha na verificação de saúde da API:',
            error
        );

        return res.status(503).json({
            sucesso: false,
            mensagem:
                'Serviço temporariamente indisponível',
            bancoDeDados: 'Desconectado',
            horarioServidor: obterHorarioBrasilia(),
            fusoHorario: FUSO_HORARIO
        });

    }

});

// ==========================================
// ROTAS DA API
// ==========================================

// Empresas
app.use(
    '/api/companies',
    companyRoutes
);

// Autenticação e login
app.use(
    '/api/auth',
    authRoutes
);

// Usuários
app.use(
    '/api/users',
    userRoutes
);

// Grupos
app.use(
    '/api/groups',
    groupRoutes
);

// Grupos do usuário
app.use(
    '/api/my-groups',
    myGroupRoutes
);

// Mensagens dos grupos
app.use(
    '/api/group-messages',
    groupMessageRoutes
);

// Solicitações de conversa
app.use(
    '/api/chat-requests',
    chatRequestRoutes
);

// Conversas privadas
app.use(
    '/api/private-chats',
    privateChatRoutes
);

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
// EXPORTAÇÃO PARA A VERCEL
// ==========================================

export default app;

// ==========================================
// INICIALIZAÇÃO LOCAL
// ==========================================

if (process.env.VERCEL !== '1') {

    const server = app.listen(PORT, () => {

        console.log('================================');
        console.log('CALZUP - BACKEND');
        console.log('================================');

        console.log(
            `Servidor rodando na porta ${PORT}`
        );

        console.log(
            `Endereço local: http://localhost:${PORT}`
        );

        console.log(
            `Horário de Brasília: ${obterHorarioBrasilia()}`
        );

        console.log('================================');

    });

    server.on('error', (error) => {

        console.error(
            'Erro ao iniciar servidor:',
            error
        );

    });

}
