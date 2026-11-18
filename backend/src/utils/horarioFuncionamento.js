
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
            'O CalZup funciona somente das 08:00 às 18:00, no horário de Brasília.',
        horarioInicio: '08:00',
        horarioFim: '18:00',
        fusoHorario: FUSO_HORARIO
    });
}

