import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Pressable } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { analyzeRide } from '../services/RideAnalyzer';
import { isValidRide } from '../services/RideParser';
import { Ride, RideAnalysis } from '../types/Ride';
import { OverlayCard } from '../components/Overlay/OverlayCard';
import { colors } from '../constants/colors';
import { sizes } from '../constants/sizes';

// Tela de simulação: permite digitar os mesmos dados que o Accessibility
// Service capturaria da tela da Uber Driver (preço, distância, duração,
// origem, destino) e rodar o RideAnalyzer real, sem precisar do módulo
// nativo Android. Útil para testar as regras de aceitar/negar isoladamente.
export default function TestScreen() {
  const { config } = useSettings();

  const [priceText, setPriceText] = useState('18,50');
  const [distanceText, setDistanceText] = useState('7,2');
  const [durationText, setDurationText] = useState('15');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const [result, setResult] = useState<RideAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  function parseNumber(text: string): number {
    // aceita vírgula ou ponto como separador decimal
    return parseFloat(text.replace(',', '.'));
  }

  function handleAnalyze() {
    const ride: Ride = {
      price: parseNumber(priceText),
      distance: parseNumber(distanceText),
      duration: parseNumber(durationText),
      origin: origin.trim(),
      destination: destination.trim(),
    };

    if (!isValidRide(ride)) {
      setError('Preencha preço, distância e duração com valores maiores que zero.');
      setResult(null);
      return;
    }

    setError(null);
    setResult(analyzeRide(ride, config));
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Simulador de Corrida</Text>
      <Text style={styles.subtitle}>
        Digite os dados de uma oferta manualmente e veja a decisão do RideAnalyzer,
        sem depender do Accessibility Service nativo.
      </Text>

      <Field label="Preço (R$)" value={priceText} onChangeText={setPriceText} />
      <Field label="Distância (km)" value={distanceText} onChangeText={setDistanceText} />
      <Field label="Duração (min)" value={durationText} onChangeText={setDurationText} />
      <Field label="Origem (opcional)" value={origin} onChangeText={setOrigin} />
      <Field label="Destino (opcional)" value={destination} onChangeText={setDestination} />

      <Pressable style={styles.button} onPress={handleAnalyze}>
        <Text style={styles.buttonText}>Analisar</Text>
      </Pressable>

      {error && <Text style={styles.error}>{error}</Text>}

      {result && (
        <View style={styles.resultBlock}>
          <OverlayCard analysis={result} />

          <Text style={styles.sectionTitle}>Motivos</Text>
          {result.reasons.length === 0 ? (
            <Text style={styles.reasonText}>Nenhuma regra bateu (oferta limpa).</Text>
          ) : (
            result.reasons.map((reason, i) => (
              <Text key={i} style={styles.reasonText}>
                • {reason}
              </Text>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

function Field({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor={colors.textMuted}
      />
    </View>
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
  subtitle: {
    color: colors.textSecondary,
    fontSize: sizes.fontSm,
    marginBottom: sizes.spacingSm,
  },
  field: {
    gap: sizes.spacingXs,
  },
  label: {
    color: colors.textSecondary,
    fontSize: sizes.fontSm,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: sizes.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: sizes.spacingMd,
    paddingVertical: sizes.spacingSm,
    color: colors.textPrimary,
    fontSize: sizes.fontMd,
  },
  button: {
    backgroundColor: colors.info,
    borderRadius: sizes.radiusMd,
    paddingVertical: sizes.spacingSm,
    alignItems: 'center',
    marginTop: sizes.spacingSm,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  error: {
    color: colors.deny,
    fontSize: sizes.fontSm,
  },
  resultBlock: {
    marginTop: sizes.spacingLg,
    gap: sizes.spacingSm,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: sizes.fontLg,
    fontWeight: '600',
    marginTop: sizes.spacingMd,
  },
  reasonText: {
    color: colors.textSecondary,
    fontSize: sizes.fontSm,
  },
});
