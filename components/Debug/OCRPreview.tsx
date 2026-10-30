import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RawRideText } from '../../types/Ride';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

interface OCRPreviewProps {
  raw: RawRideText | null;
}

// Apenas exibe o texto bruto capturado, para debug do Accessibility Service.
// Não faz parsing, não calcula nada.
export function OCRPreview({ raw }: OCRPreviewProps) {
  if (!raw) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Nenhuma oferta capturada ainda.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.line}>price: {raw.rawPrice ?? '-'}</Text>
      <Text style={styles.line}>distance: {raw.rawDistance ?? '-'}</Text>
      <Text style={styles.line}>duration: {raw.rawDuration ?? '-'}</Text>
      <Text style={styles.line}>origin: {raw.rawOrigin ?? '-'}</Text>
      <Text style={styles.line}>destination: {raw.rawDestination ?? '-'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceLight,
    borderRadius: sizes.radiusMd,
    padding: sizes.spacingMd,
  },
  line: {
    color: colors.textSecondary,
    fontSize: sizes.fontSm,
    fontFamily: 'monospace',
  },
  empty: {
    color: colors.textMuted,
    fontSize: sizes.fontSm,
    fontStyle: 'italic',
  },
});
