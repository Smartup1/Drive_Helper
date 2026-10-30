import { useEffect } from 'react';
import { OverlayService } from '../services/OverlayService';
import { RideAnalysis } from '../types/Ride';

// Único responsável por sincronizar o RideAnalysis com o overlay nativo.
// Não calcula nada, só manda mostrar/atualizar/esconder.
export function useOverlay(analysis: RideAnalysis | null, enabled: boolean) {
  useEffect(() => {
    if (!enabled) {
      OverlayService.hide();
      return;
    }

    if (!analysis) {
      OverlayService.hide();
      return;
    }

    OverlayService.show({
      accept: analysis.accept,
      score: analysis.score,
      pricePerKm: analysis.pricePerKm,
      pricePerMinute: analysis.pricePerMinute,
    });

    return () => {
      OverlayService.hide();
    };
  }, [analysis, enabled]);
}
