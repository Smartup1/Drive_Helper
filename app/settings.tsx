import React, { useMemo } from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { ConfigCard } from '../components/Settings/ConfigCard';
import { colors } from '../constants/colors';
import { sizes } from '../constants/sizes';
import { analyzeRide } from '../services/RideAnalyzer';
import { Ride } from '../types/Ride';

// Corridas hipotéticas para o motorista testar como suas configs se comportam
const SAMPLE_RIDES: { label: string; ride: Ride }[] = [
  {
    label: 'Curta e barata',
    ride: { price: 8.5, distance: 3, duration: 10, origin: '', destination: 'Centro' },
  },
  {
    label: 'Média equilibrada',
    ride: { price: 22.0, distance: 8, duration: 25, origin: '', destination: 'Shopping' },
  },
  {
    label: 'Longa aeroporto',
    ride: { price: 65.0, distance: 30, duration: 45, origin: '', destination: 'Aeroporto GRU' },
  },
];

export default function SettingsScreen() {
  const { config, updateConfig, resetConfig } = useSettings();

  // Validação em tempo real: detecta configs contraditórias ou irreais
  const warnings = useMemo(() => {
    const w: string[] = [];
    if (config.minPricePerKm > 5) {
      w.push('R$/km mínimo muito alto — poucas corridas serão aceitas.');
    }
    if (config.minPricePerMinute > 2) {
      w.push('R$/min mínimo muito alto — pode filtrar corridas curtas lucrativas.');
    }
    if (config.maxDistance < 3) {
      w.push('Distância máxima muito baixa — você pode rejeitar corridas curtas viáveis.');
    }
    if (config.maxDuration < 10) {
      w.push('Duração máxima muito baixa — quase nenhuma corrida será aceita.');
    }
    if (config.considerToll && config.estimatedTollCost <= 0) {
      w.push('Pedágio ativado mas custo estimado é R$ 0,00 — configure um valor.');
    }
    return w;
  }, [config]);

  // Preview de como as configs atuais avaliam corridas de exemplo
  const previews = useMemo(
    () =>
      SAMPLE_RIDES.map(({ label, ride }) => ({
        label,
        analysis: analyzeRide(ride, config),
      })),
    [config]
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Configurações</Text>

      {/* Avisos de validação */}
      {warnings.length > 0 && (
        <View style={styles.warningBox}>
          {warnings.map((w, i) => (
            <Text key={i} style={styles.warningText}>
              ⚠ {w}
            </Text>
          ))}
        </View>
      )}

      <ConfigCard
        type="number"
        label="Valor mínimo por km (R$)"
        value={config.minPricePerKm}
        onChange={(v) => updateConfig({ minPricePerKm: v })}
      />
      <ConfigCard
        type="number"
        label="Valor mínimo por minuto (R$)"
        value={config.minPricePerMinute}
        onChange={(v) => updateConfig({ minPricePerMinute: v })}
      />
      <ConfigCard
        type="number"
        label="Distância máxima (km)"
        value={config.maxDistance}
        onChange={(v) => updateConfig({ maxDistance: v })}
      />
      <ConfigCard
        type="number"
        label="Tempo máximo (min)"
        value={config.maxDuration}
        onChange={(v) => updateConfig({ maxDuration: v })}
      />
      <ConfigCard
        type="switch"
        label="Considerar pedágio no cálculo"
        value={config.considerToll}
        onChange={(v) => updateConfig({ considerToll: v })}
      />
      <ConfigCard
        type="number"
        label="Custo médio de pedágio (R$)"
        value={config.estimatedTollCost}
        onChange={(v) => updateConfig({ estimatedTollCost: v })}
      />
      <ConfigCard
        type="switch"
        label="Overlay ativado"
        value={config.overlayEnabled}
        onChange={(v) => updateConfig({ overlayEnabled: v })}
      />

      {/* Preview de análise com corridas simuladas */}
      <Text style={styles.sectionTitle}>Simulador de corridas</Text>
      <Text style={styles.previewHint}>
        Veja como suas configurações atuais avaliam estas corridas de exemplo:
      </Text>
      {previews.map(({ label, analysis }) => (
        <View key={label} style={styles.previewRow}>
          <Text style={styles.previewLabel}>{label}</Text>
          <Text
            style={[
              styles.previewDecision,
              { color: analysis.accept ? colors.accept : colors.deny },
            ]}
          >
            {analysis.accept ? 'ACEITAR' : 'NEGAR'} · Score {analysis.score}
          </Text>
          <Text style={styles.previewDetail}>
            R${analysis.pricePerKm.toFixed(2)}/km · R${analysis.pricePerMinute.toFixed(2)}/min
          </Text>
        </View>
      ))}

      <Text style={styles.resetLink} onPress={resetConfig}>
        Restaurar configurações padrão
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: sizes.spacingLg,
    gap: sizes.spacingSm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: sizes.fontXl,
    fontWeight: '700',
    marginBottom: sizes.spacingMd,
  },
  warningBox: {
    backgroundColor: '#FFF3CD',
    borderRadius: sizes.radiusMd,
    padding: sizes.spacingMd,
    gap: sizes.spacingXs,
    marginBottom: sizes.spacingSm,
  },
  warningText: {
    color: '#856404',
    fontSize: sizes.fontSm,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: sizes.fontLg,
    fontWeight: '600',
    marginTop: sizes.spacingLg,
  },
  previewHint: {
    color: colors.textMuted,
    fontSize: sizes.fontSm,
    fontStyle: 'italic',
  },
  previewRow: {
    backgroundColor: colors.surface,
    borderRadius: sizes.radiusMd,
    padding: sizes.spacingMd,
    gap: sizes.spacingXs,
  },
  previewLabel: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: sizes.fontMd,
  },
  previewDecision: {
    fontWeight: '700',
    fontSize: sizes.fontMd,
  },
  previewDetail: {
    color: colors.textSecondary,
    fontSize: sizes.fontSm,
  },
  resetLink: {
    color: colors.warning,
    textAlign: 'center',
    marginTop: sizes.spacingLg,
    textDecorationLine: 'underline',
  },
});