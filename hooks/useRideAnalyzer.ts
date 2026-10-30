import { useMemo } from 'react';
import { Ride, RideAnalysis } from '../types/Ride';
import { Config } from '../types/Config';
import { analyzeRide } from '../services/RideAnalyzer';

// Único responsável por transformar Ride + Config em RideAnalysis.
// Puro: recalcula só quando ride ou config mudam.
export function useRideAnalyzer(ride: Ride | null, config: Config): RideAnalysis | null {
  return useMemo(() => {
    if (!ride) return null;
    return analyzeRide(ride, config);
  }, [ride, config]);
}
