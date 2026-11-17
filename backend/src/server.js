
import 'dotenv/config';
import express from 'express';

import { prisma } from './config/prisma.js';

// Rotas da API
import companyRoutes from './routes/companyRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import myGroupRoutes from './routes/myGroupRoutes.js';
import groupMessageRoutes from './routes/groupMessageRoutes.js';
import chatRequestRoutes from './routes/chatRequestRoutes.js';
import privateChatRoutes from './routes/privateChatRoutes.js';

// Tratamento global de erros
import { errorMiddleware } from './middlewares/errorMiddleware.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// CONFIGURAÇÕES DE SEGURANÇA
// ==========================================

// Não divulgar que o servidor utiliza Express.
app.disable('x-powered-by');

// Não confiar automaticamente em cabeçalhos de proxy.
// Se o backend for publicado atrás de um proxy confiável,
// esta configuração deverá ser revisada.
app.set('trust proxy', false);

// Cabeçalhos básicos de segurança.
app.use((req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-Frame-Options', 'DENY');
    res.set('Referrer-Policy', 'no-referrer');
    res.set('X-DNS-Prefetch-Control', 'off');

    next();
});

// Limitar o tamanho das requisições JSON e formulários.
// Uploads futuros deverão usar tratamento específico.
app.use(express.json({
    limit: '100kb',
    strict: true
}));

app.use(express.urlencoded({
    extended: false,
    limit: '100kb',
    parameterLimit: 100
}));

// Evitar cache das respostas da API.
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
        mensagem: 'API do CalZup funcionando'
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
        console.error('Falha na verificação de saúde da API:', error);

        return res.status(503).json({
            sucesso: false,
            mensagem: 'Serviço temporariamente indisponível'
        });
    }
});

// ==========================================
// HORÁRIO DE FUNCIONAMENTO
// ==========================================

// Restrição de horário temporariamente desativada
// durante o desenvolvimento e os testes.
//
// Antes da entrega final do CalZup, restaurar
// o bloqueio das 08h às 18h, horário de Brasília.

// ==========================================
// ROTAS DA API
// ==========================================

// Empresas
app.use('/api/companies', companyRoutes);

// Autenticação
app.use('/api/auth', authRoutes);

// Usuários
app.use('/api/users', userRoutes);

// Administração de grupos
app.use('/api/groups', groupRoutes);

// Grupos do usuário
app.use('/api/my-groups', myGroupRoutes);

// Mensagens dos grupos
app.use('/api/group-messages', groupMessageRoutes);

// Solicitações de conversas privadas
app.use('/api/chat-requests', chatRequestRoutes);

// Conversas privadas
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
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================

const server = app.listen(PORT, () => {
    console.log('================================');
    console.log('CALZUP - BACKEND');
    console.log('================================');
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Endereço local: http://localhost:${PORT}`);
    console.log('================================');
});

// ==========================================
// ERROS DE INICIALIZAÇÃO
// ==========================================

server.on('error', (error) => {
    console.error('Erro ao iniciar servidor:', error);
});
