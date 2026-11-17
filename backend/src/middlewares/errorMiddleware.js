
export function errorMiddleware(error, req, res, next) {

    // Verificar se a resposta já começou a ser enviada
    if (res.headersSent) {
        return next(error);
    }

    // Registrar o erro no terminal para análise
    console.error('Erro não tratado na API:', error);

    // Determinar o código HTTP
    const status =
        Number.isInteger(error.status) &&
        error.status >= 400 &&
        error.status <= 599
            ? error.status
            : 500;

    // Não expor detalhes internos do servidor
    const mensagem = status >= 500
        ? 'Erro interno do servidor.'
        : 'Não foi possível processar a solicitação.';

    return res.status(status).json({
        sucesso: false,
        mensagem
    });
}
