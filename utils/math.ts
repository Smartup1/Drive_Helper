// Limita um valor entre um mínimo e um máximo
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Divisão segura, evita divisão por zero
export function safeDivide(numerator: number, denominator: number): number {
  if (!denominator) return 0;
  return numerator / denominator;
}

// Converte um valor em uma pontuação de 0 a 100 dado um mínimo aceitável
// Ex: se minAcceptable = 1.5 e value = 3.0, o score tende a 100
export function toScore(value: number, minAcceptable: number, maxReference: number): number {
  if (minAcceptable <= 0) return 0;

  const ratio = safeDivide(value - minAcceptable, maxReference - minAcceptable);
  return Math.round(clamp(ratio * 100, 0, 100));
}

// Média ponderada simples entre valores e pesos
export function weightedAverage(values: number[], weights: number[]): number {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  if (totalWeight === 0) return 0;

  const sum = values.reduce((acc, v, i) => acc + v * weights[i], 0);
  return sum / totalWeight;
}
