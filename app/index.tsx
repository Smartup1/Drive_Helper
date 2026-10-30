import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAccessibility } from '../hooks/useAccessibility';
import { useRideAnalyzer } from '../hooks/useRideAnalyzer';
import { useOverlay } from '../hooks/useOverlay';
import { usePermissions } from '../hooks/usePermissions';
import { useSettings } from '../context/SettingsContext';
import { useRideHistory } from '../hooks/useRideHistory';
import { OverlayCard } from '../components/Overlay/OverlayCard';
import { OCRPreview } from '../components/Debug/OCRPreview';
import { colors } from '../constants/colors';
import { sizes } from '../constants/sizes';

// Esta tela só orquestra: pega dados dos hooks e repassa para os componentes.
// Nenhuma regra de negócio mora aqui.
export default function HomeScreen() {
  const router = useRouter();
  const { config } = useSettings();
  const { ride, listening } = useAccessibility();
  const analysis = useRideAnalyzer(ride, config);
  const { overlayGranted, accessibilityGranted, requestOverlay, requestAccessibility } =
    usePermissions();
  const { stats, recordRide } = useRideHistory();

  useOverlay(analysis, config.overlayEnabled);

  // Salva corrida analisada no histórico (com deduplicação)
  useEffect(() => {
    if (ride && analysis) {
      recordRide(ride, analysis);
    }
  }, [ride, analysis, recordRide]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Uber Helper</Text>

      <View style={styles.statusRow}>
        <Text style={styles.statusText}>
          Accessibility: {accessibilityGranted ? 'ativo' : 'desativado'}
        </Text>
        <Text style={styles.statusText}>
          Overlay: {overlayGranted ? 'ativo' : 'desativado'}
        </Text>
      </View>

      {!accessibilityGranted && (
        <Pressable style={styles.button} onPress={requestAccessibility}>
          <Text style={styles.buttonText}>Ativar Accessibility Service</Text>
        </Pressable>
      )}

      {!overlayGranted && (
        <Pressable style={styles.button} onPress={requestOverlay}>
          <Text style={styles.buttonText}>Ativar permissão de Overlay</Text>
        </Pressable>
      )}

      <Pressable style={styles.button} onPress={() => router.push('/test')}>
        <Text style={styles.buttonText}>Simulador de Corrida (testar sem Accessibility)</Text>
      </Pressable>

      {/* Estatísticas rápidas do histórico */}
      {stats.totalRides > 0 && (
        <View style={styles.statsBox}>
          <Text style={styles.statsTitle}>Estatísticas recentes</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Corridas: {stats.totalRides}</Text>
            <Text style={styles.statsLabel}>Aceitas: {stats.acceptanceRate}%</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Média R$/km: {stats.avgPricePerKm.toFixed(2)}</Text>
            <Text style={styles.statsLabel}>Score médio: {stats.avgScore}</Text>
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>Prévia do overlay</Text>
      {analysis ? (
        <OverlayCard analysis={analysis} />
      ) : (
        <Text style={styles.empty}>
          {listening ? 'Aguardando oferta de corrida...' : 'Accessibility Service não está escutando.'}
        </Text>
      )}

      <Text style={styles.sectionTitle}>Debug (texto capturado)</Text>
      <OCRPreview raw={null} />
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
    gap: sizes.spacingMd,
  },
  title: {
    color: colors.textPrimary,
    fontSize: sizes.fontXl,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusText: {
    color: colors.textSecondary,
    fontSize: sizes.fontSm,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: sizes.fontLg,
    fontWeight: '600',
    marginTop: sizes.spacingLg,
  },
  empty: {
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: colors.info,
    borderRadius: sizes.radiusMd,
    paddingVertical: sizes.spacingSm,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statsBox: {
    backgroundColor: colors.surface,
    borderRadius: sizes.radiusMd,
    padding: sizes.spacingMd,
    gap: sizes.spacingXs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsTitle: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: sizes.fontMd,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsLabel: {
    color: colors.textSecondary,
    fontSize: sizes.fontSm,
  },
});