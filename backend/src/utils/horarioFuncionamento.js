
export function verificarHorarioFuncionamento() {
    const agora = new Date();

    const horarioBrasilia = new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
    }).formatToParts(agora);

    const hora = Number(
        horarioBrasilia.find((parte) => parte.type === 'hour')?.value
    );

    if (!Number.isInteger(hora)) {
        return false;
    }

    // Acesso permitido das 08h00 até as 17h59,
    // considerando o horário oficial de Brasília.
    return hora >= 8 && hora < 18;
}
