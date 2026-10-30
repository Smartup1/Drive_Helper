// Representa uma oferta de corrida extraída da tela da Uber Driver
export interface Ride {
  price: number;       // valor total da corrida (R$)
  distance: number;     // distância estimada (km)
  duration: number;      // duração estimada (minutos)
  origin: string;         // local de origem (opcional, pode vir vazio)
  destination: string;     // local de destino (opcional, pode vir vazio)
}

// Resultado da análise feita pelo RideAnalyzer
export interface RideAnalysis {
  accept: boolean;         // decisão final (aceitar ou negar)
  score: number;            // pontuação de 0 a 100
  pricePerKm: number;        // R$ por km
  pricePerMinute: number;     // R$ por minuto
  reasons: string[];           // motivos que levaram à decisão (debug/exibição)
}

// Texto bruto capturado pelo Accessibility Service, antes do parsing
export interface RawRideText {
  rawPrice?: string;
  rawDistance?: string;
  rawDuration?: string;
  rawOrigin?: string;
  rawDestination?: string;
}
