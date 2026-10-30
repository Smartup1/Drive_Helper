import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DecisionBadge } from './DecisionBadge';
import { Indicator } from './Indicator';
import { RideAnalysis } from '../../types/Ride';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import { formatRate } from '../../utils/currency';

interface OverlayCardProps {
  analysis: RideAnalysis;
}

// Apenas desenha o card. Recebe um RideAnalysis pronto e exibe.
// Nenhum cálculo acontece aqui.
export function OverlayCard({ analysis }: OverlayCardProps) {
  return (
    <View style={styles.container}>
      <DecisionBadge accept={analysis.accept} />

      <View style={styles.row}>
        <Indicator label="R$/km" value={formatRate(analysis.pricePerKm, '')} />
        <Indicator label="R$/min" value={formatRate(analysis.pricePerMinute, '')} />
        <Indicator label="Score" value={`${analysis.score}`} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: sizes.overlayWidth,
    backgroundColor: colors.surface,
    borderRadius: sizes.radiusLg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: sizes.spacingMd,
    gap: sizes.spacingSm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: sizes.spacingSm,
  },
});
