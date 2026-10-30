import { Ride, RawRideText } from '../types/Ride';
import { parseCurrency } from '../utils/currency';
import { parseDistance } from '../utils/distance';
import { parseDuration } from '../utils/time';

// Recebe apenas texto (o que o Accessibility Service capturou da tela)
// e devolve um objeto Ride tipado e pronto para o RideAnalyzer.
export function parseRide(raw: RawRideText): Ride {
  return {
    price: parseCurrency(raw.rawPrice ?? ''),
    distance: parseDistance(raw.rawDistance ?? ''),
    duration: parseDuration(raw.rawDuration ?? ''),
    origin: (raw.rawOrigin ?? '').trim(),
    destination: (raw.rawDestination ?? '').trim(),
  };
}

// Validação básica: garante que a oferta tem dados mínimos utilizáveis
export function isValidRide(ride: Ride): boolean {
  return ride.price > 0 && ride.distance > 0 && ride.duration > 0;
}
