
export const FUSO_HORARIO = 'America/Sao_Paulo';
export const HORA_INICIO = 8;
export const HORA_FIM = 18;

export function verificarHorarioFuncionamento(
    data = new Date()
) {
    const partes = new Intl.DateTimeFormat('en-US', {
        timeZone: FUSO_HORARIO,
        hour: '2-digit',
        hourCycle: 'h23'
    }).formatToParts(data);

    const hora = Number(
        partes.find(parte => parte.type === 'hour')?.value
    );

    return Number.isInteger(hora) &&
        hora >= HORA_INICIO &&
        hora < HORA_FIM;
}

export function verificarAcessoHorario(req, res, next) {
    if (verificarHorarioFuncionamento()) {
        return next();
    }

    return res.status(403).json({
        sucesso: false,
        codigo: 'FORA_DO_HORARIO',
        mensagem:
            'O Callzup funciona somente das 08:00 às 18:00, no horário de Brasília.',
        horarioInicio: '08:00',
        horarioFim: '18:00',
        fusoHorario: FUSO_HORARIO
    });
}


export function limiteSessao(data = new Date()) {
    if (!verificarHorarioFuncionamento(data)) return 0;
    const partes = new Intl.DateTimeFormat('en-GB', {
        timeZone: FUSO_HORARIO, hour: '2-digit', minute: '2-digit',
        second: '2-digit', hourCycle: 'h23'
    }).formatToParts(data);
    const n = tipo => Number(partes.find(p => p.type === tipo).value);
    return Math.min(28800, (HORA_FIM - n('hour')) * 3600 - n('minute') * 60 - n('second'));
}
