import 'dotenv/config';

export async function notificarSolicitacao(solicitacao, companyId) {
    if (process.env.EMAIL_NOTIFICATIONS_ENABLED !== 'true') {
        return false;
    }

    const empresaAutorizada = process.env.EMAIL_COMPANY_ID?.trim();

    if (!empresaAutorizada || companyId !== empresaAutorizada) {
        return false;
    }

    const apiKey = process.env.RESEND_API_KEY;
    const remetente = process.env.EMAIL_FROM;
    const destinatario = process.env.EMAIL_TO;

    if (!apiKey || !remetente || !destinatario) {
        throw new Error('EMAIL_CONFIG_MISSING');
    }

    const dataHora = new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        dateStyle: 'short',
        timeStyle: 'medium'
    }).format(new Date(solicitacao.createdAt));

    const texto = [
        'Nova solicitação de conversa privada no CallZUP.',
        '',
        `Solicitante: ${solicitacao.requester.name}`,
        `E-mail: ${solicitacao.requester.email}`,
        `Usuário solicitado: ${solicitacao.requestedUser.name}`,
        `Data e horário: ${dataHora}`,
        `Protocolo: ${solicitacao.id}`,
        'Status: Pendente de aprovação da TI.',
        '',
        'Acesse o painel administrativo do CallZUP.'
    ].join('\n');

    const resposta = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Idempotency-Key': `chat-request-${solicitacao.id}`
        },
        body: JSON.stringify({
            from: remetente,
            to: [destinatario],
            subject: 'Nova solicitação de conversa privada - CallZUP',
            text: texto
        }),
        signal: AbortSignal.timeout(5000)
    });

    if (!resposta.ok) {
        throw new Error(`EMAIL_HTTP_${resposta.status}`);
    }

    return true;
}