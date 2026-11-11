export const RESTRICAO_ATIVA = false;
export const HORA_INICIO = 8;
export const HORA_FIM = 18;

export function dentroDoHorario(data: Date = new Date()): boolean {
  if (!RESTRICAO_ATIVA) return true;
  const hora = Number(
    new Intl.DateTimeFormat("pt-BR", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: "America/Sao_Paulo",
    }).format(data)
  );
  return hora >= HORA_INICIO && hora < HORA_FIM;
}