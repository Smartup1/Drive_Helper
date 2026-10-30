import { Ride, RideAnalysis } from '../types/Ride';
import { Config } from '../types/Config';
import { safeDivide, clamp, toScore } from '../utils/math';

// Recebe um Ride + a Config do usuário e devolve a análise completa.
// Não conhece React, não desenha nada, só calcula.
// Versão melhorada: scoring ponderado, imutável, com penalidades e bônus mais claros.
export function analyzeRide(ride: Ride, config: Config): RideAnalysis {
  const reasons: string[] = [];
  let penalties = 0;
  let bonuses = 0;

  const effectivePrice = config.considerToll
    ? ride.price - config.estimatedTollCost
    : ride.price;

  const pricePerKm = safeDivide(effectivePrice, ride.distance);
  const pricePerMinute = safeDivide(effectivePrice, ride.duration);

  let accept = true;

  // Regra: valor mínimo por km
  if (pricePerKm < config.minPricePerKm) {
    accept = false;
    penalties += 15;
    reasons.push(`R$/km abaixo do mínimo (${pricePerKm.toFixed(2)} < ${config.minPricePerKm})`);
  }

  // Regra: valor mínimo por minuto
  if (pricePerMinute < config.minPricePerMinute) {
    accept = false;
    penalties += 15;
    reasons.push(`R$/min abaixo do mínimo (${pricePerMinute.toFixed(2)} < ${config.minPricePerMinute})`);
  }

  // Regra: distância máxima
  if (ride.distance > config.maxDistance) {
    accept = false;
    penalties += 10;
    reasons.push(`Distância acima do máximo (${ride.distance}km > ${config.maxDistance}km)`);
  }

  // Regra: duração máxima
  if (ride.duration > config.maxDuration) {
    accept = false;
    penalties += 10;
    reasons.push(`Duração acima do máximo (${ride.duration}min > ${config.maxDuration}min)`);
  }

  // Regra: destino proibido
  const destinationLower = ride.destination.toLowerCase();
  const isForbidden = config.forbiddenDestinations.some((d) =>
    destinationLower.includes(d.toLowerCase())
  );
  if (isForbidden) {
    accept = false;
    penalties += 30;
    reasons.push(`Destino está na lista de proibidos: ${ride.destination}`);
  }

  // Bônus: destino favorito
  const isFavorite = config.favoriteDestinations.some((d) =>
    destinationLower.includes(d.toLowerCase())
  );
  if (isFavorite) {
    bonuses += 15;
    reasons.push(`Destino favorito: bônus aplicado (+15)`);
  }

  // Score combinado (0-100) com pesos configuráveis
  // Peso padrão: 60% R$/km, 40% R$/min (km é geralmente mais relevante para motoristas)
  const scoreKm = toScore(pricePerKm, config.minPricePerKm, config.minPricePerKm * 2.5);
  const scoreMin = toScore(pricePerMinute, config.minPricePerMinute, config.minPricePerMinute * 2.5);

  const weightedBase = Math.round(scoreKm * 0.6 + scoreMin * 0.4);
  let score = clamp(weightedBase + bonuses - penalties, 0, 100);

  // Destino proibido zera o score independentemente
  if (isForbidden) score = 0;

  return {
    accept,
    score,
    pricePerKm,
    pricePerMinute,
    reasons,
  };
}