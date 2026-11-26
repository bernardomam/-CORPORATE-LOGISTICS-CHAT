export function errorMiddleware(error, req, res, next) {
    if (res.headersSent) return next(error);
    const status = Number.isInteger(error?.status) &&
        error.status >= 400 && error.status <= 599 ? error.status : 500;
    const mensagens = {
        400: 'Dados da solicitação inválidos.',
        401: 'Autenticação necessária.',
        403: 'Acesso negado.',
        404: 'Recurso não encontrado.',
        409: 'Conflito na solicitação.',
        413: 'Corpo da solicitação excede o limite permitido.',
        415: 'Formato da solicitação não suportado.',
        429: 'Muitas solicitações.'
    };
    if (status >= 500) console.error('Erro interno da API:', error?.code || error?.name || 'Error');
    return res.status(status).json({
        sucesso: false,
        mensagem: status >= 500 ? 'Erro interno do servidor.' :
            mensagens[status] || 'Não foi possível processar a solicitação.'
    });
}
