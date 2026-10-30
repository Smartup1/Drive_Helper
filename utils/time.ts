// Converte string tipo "17 min" ou "1h 5min" em número de minutos
export function parseDuration(text: string): number {
  if (!text) return 0;

  const cleaned = text.trim().toLowerCase();

  const hourMatch = cleaned.match(/(\d+)\s*h/);
  const minMatch = cleaned.match(/(\d+)\s*min/);

  const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
  const minutes = minMatch ? parseInt(minMatch[1], 10) : 0;

  if (hours === 0 && minutes === 0) {
    // fallback: pega só o primeiro número encontrado, assume minutos
    const numberMatch = cleaned.match(/\d+/);
    return numberMatch ? parseInt(numberMatch[0], 10) : 0;
  }

  return hours * 60 + minutes;
}

// Formata número de minutos para exibição
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)} min`;

  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}
