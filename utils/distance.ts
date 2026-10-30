// Converte string tipo "4,5 km" ou "800 m" em número de km
export function parseDistance(text: string): number {
  if (!text) return 0;

  const cleaned = text.trim().toLowerCase();
  const numberMatch = cleaned.match(/[\d.,]+/);
  if (!numberMatch) return 0;

  const rawNumber = parseFloat(numberMatch[0].replace(',', '.'));
  if (isNaN(rawNumber)) return 0;

  // Se vier em metros, converte para km
  if (cleaned.includes('m') && !cleaned.includes('km')) {
    return rawNumber / 1000;
  }

  return rawNumber;
}

// Formata número de km para exibição
export function formatDistance(km: number): string {
  return `${km.toFixed(1)} km`;
}
