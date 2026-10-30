import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ride, RideAnalysis } from '../types/Ride';

const HISTORY_KEY = '@uber-helper/ride-history';
const MAX_HISTORY = 200; // mantém últimas 200 corridas para não inflar storage

export interface RideHistoryEntry {
  id: string;
  timestamp: number;
  ride: Ride;
  analysis: RideAnalysis;
}

export interface RideStats {
  totalRides: number;
  acceptedCount: number;
  rejectedCount: number;
  acceptanceRate: number;       // 0-100
  avgPricePerKm: number;
  avgScore: number;
  avgDistance: number;
}

// Gera ID simples baseado em timestamp + random para evitar colisões
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// Salva uma nova entrada no histórico (prepend = mais recente primeiro)
export async function saveRideEntry(ride: Ride, analysis: RideAnalysis): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(HISTORY_KEY);
    const history: RideHistoryEntry[] = stored ? JSON.parse(stored) : [];

    const entry: RideHistoryEntry = {
      id: generateId(),
      timestamp: Date.now(),
      ride,
      analysis,
    };

    // Prepend e limita tamanho
    const updated = [entry, ...history].slice(0, MAX_HISTORY);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('[RideHistory] Falha ao salvar entrada:', e);
  }
}

// Carrega todo o histórico
export async function loadHistory(): Promise<RideHistoryEntry[]> {
  try {
    const stored = await AsyncStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.warn('[RideHistory] Falha ao carregar histórico:', e);
    return [];
  }
}

// Calcula estatísticas agregadas do histórico
export function computeStats(history: RideHistoryEntry[]): RideStats {
  if (history.length === 0) {
    return {
      totalRides: 0,
      acceptedCount: 0,
      rejectedCount: 0,
      acceptanceRate: 0,
      avgPricePerKm: 0,
      avgScore: 0,
      avgDistance: 0,
    };
  }

  const acceptedCount = history.filter((h) => h.analysis.accept).length;
  const rejectedCount = history.length - acceptedCount;

  const sumPricePerKm = history.reduce((acc, h) => acc + h.analysis.pricePerKm, 0);
  const sumScore = history.reduce((acc, h) => acc + h.analysis.score, 0);
  const sumDistance = history.reduce((acc, h) => acc + h.ride.distance, 0);

  return {
    totalRides: history.length,
    acceptedCount,
    rejectedCount,
    acceptanceRate: Math.round((acceptedCount / history.length) * 100),
    avgPricePerKm: sumPricePerKm / history.length,
    avgScore: Math.round(sumScore / history.length),
    avgDistance: sumDistance / history.length,
  };
}

// Limpa todo o histórico
export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.warn('[RideHistory] Falha ao limpar histórico:', e);
  }
}