// Configurações definidas pelo motorista na tela de Settings
export interface Config {
  minPricePerKm: number;        // valor mínimo aceitável por km
  minPricePerMinute: number;     // valor mínimo aceitável por minuto
  maxDistance: number;            // distância máxima aceitável (km)
  maxDuration: number;             // tempo máximo aceitável (min)

  forbiddenDestinations: string[];  // bairros/locais que nunca aceitar
  favoriteDestinations: string[];    // bairros/locais preferidos (bônus no score)

  airportFilter: boolean;              // regras especiais para corridas de aeroporto
  neighborhoodFilter: string[];         // bairros permitidos (se vazio, todos permitidos)

  considerToll: boolean;                 // considerar pedágio no cálculo
  estimatedTollCost: number;              // custo médio estimado de pedágio (R$)

  overlayEnabled: boolean;                 // liga/desliga o overlay
  autoAcceptEnabled: boolean;               // (futuro) aceitar automaticamente se score alto
}

// Configuração padrão usada na primeira execução do app
export const DEFAULT_CONFIG: Config = {
  minPricePerKm: 1.5,
  minPricePerMinute: 0.5,
  maxDistance: 15,
  maxDuration: 40,
  forbiddenDestinations: [],
  favoriteDestinations: [],
  airportFilter: false,
  neighborhoodFilter: [],
  considerToll: false,
  estimatedTollCost: 0,
  overlayEnabled: true,
  autoAcceptEnabled: false,
};
