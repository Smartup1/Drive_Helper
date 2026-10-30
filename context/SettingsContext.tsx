import React, { createContext, useContext, useEffect, useState, useRef, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Config, DEFAULT_CONFIG } from '../types/Config';

const STORAGE_KEY = '@uber-helper/config';

interface SettingsContextValue {
  config: Config;
  loading: boolean;
  updateConfig: (partial: Partial<Config>) => void;
  resetConfig: () => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

// Provider único: guarda a Config na memória e persiste no AsyncStorage.
// Versão melhorada: serializa escritas para evitar race conditions.
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const writeQueueRef = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setConfig({ ...DEFAULT_CONFIG, ...JSON.parse(stored) });
        }
      } catch (e) {
        console.warn('[SettingsContext] Falha ao carregar config:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Serializa escritas no AsyncStorage para evitar que updates rápidos
  // sobrescrevam valores mais recentes com dados obsoletos.
  const persistConfig = useCallback((nextConfig: Config): void => {
    writeQueueRef.current = writeQueueRef.current.then(async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextConfig));
      } catch (e) {
        console.warn('[SettingsContext] Falha ao salvar config:', e);
      }
    });
  }, []);

  const updateConfig = useCallback((partial: Partial<Config>) => {
    setConfig((prev) => {
      const next = { ...prev, ...partial };
      persistConfig(next);
      return next;
    });
  }, [persistConfig]);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    persistConfig(DEFAULT_CONFIG);
  }, [persistConfig]);

  return (
    <SettingsContext.Provider value={{ config, loading, updateConfig, resetConfig }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings deve ser usado dentro de SettingsProvider');
  return ctx;
}