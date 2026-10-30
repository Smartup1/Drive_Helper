import { useState, useEffect, useCallback, useRef } from 'react';
import { Ride, RideAnalysis } from '../types/Ride';
import {
  saveRideEntry,
  loadHistory,
  computeStats,
  clearHistory,
  RideHistoryEntry,
  RideStats,
} from '../services/RideHistory';

interface UseRideHistoryReturn {
  history: RideHistoryEntry[];
  stats: RideStats;
  loading: boolean;
  recordRide: (ride: Ride, analysis: RideAnalysis) => Promise<void>;
  refresh: () => Promise<void>;
  clear: () => Promise<void>;
}

export function useRideHistory(): UseRideHistoryReturn {
  const [history, setHistory] = useState<RideHistoryEntry[]>([]);
  const [stats, setStats] = useState<RideStats>(computeStats([]));
  const [loading, setLoading] = useState(true);
  const lastSavedRef = useRef<string>('');

  const refresh = useCallback(async () => {
    try {
      const entries = await loadHistory();
      setHistory(entries);
      setStats(computeStats(entries));
    } catch (e) {
      console.warn('[useRideHistory] Falha ao carregar histórico:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const recordRide = useCallback(
    async (ride: Ride, analysis: RideAnalysis) => {
      // Evita salvar a mesma corrida duas vezes (ex: re-render do overlay)
      const rideKey = `${ride.price}-${ride.distance}-${ride.duration}-${ride.destination}`;
      if (rideKey === lastSavedRef.current) return;
      lastSavedRef.current = rideKey;

      await saveRideEntry(ride, analysis);
      await refresh();
    },
    [refresh]
  );

  const clear = useCallback(async () => {
    await clearHistory();
    lastSavedRef.current = '';
    await refresh();
  }, [refresh]);

  return { history, stats, loading, recordRide, refresh, clear };
}