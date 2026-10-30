// Converte string tipo "R$ 12,80" em número 12.8
// Versão melhorada: trata edge cases (negativos, parênteses, múltiplos símbolos)
export function parseCurrency(text: string): number {
  if (!text || typeof text !== 'string') return 0;

  let cleaned = text.trim();

  // Detecta notação contábil negativa: (12,50) → -12.50
  const isAccountingNegative = /^\(.*\)$/.test(cleaned);
  if (isAccountingNegative) {
    cleaned = cleaned.slice(1, -1);
  }

  // Remove símbolo de moeda (R$, $, USD, etc.) e espaços
  cleaned = cleaned
    .replace(/R\$/gi, '')
    .replace(/\$/g, '')
    .replace(/USD|BRL|EUR/gi, '')
    .replace(/\s/g, '');

  // Remove separador de milhar (ponto antes da vírgula ou no final)
  // Ex: "1.234,56" → "1234,56" | "1.234" → "1234"
  cleaned = cleaned.replace(/\.(?=\d{3})/g, '');

  // Substitui vírgula decimal por ponto
  cleaned = cleaned.replace(',', '.');

  // Remove caracteres não numéricos restantes (exceto ponto e sinal negativo)
  cleaned = cleaned.replace(/[^\d.\-]/g, '');

  const value = parseFloat(cleaned);
  if (isNaN(value)) return 0;

  return isAccountingNegative ? -Math.abs(value) : value;
}

// Formata número para exibição tipo "R$ 12,80"
export function formatCurrency(value: number): string {
  if (!isFinite(value)) return 'R$ 0,00';
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

// Formata número para exibição tipo "R$/km" com 2 casas decimais
export function formatRate(value: number, suffix: string): string {
  return `${formatCurrency(value)}${suffix}`;
}