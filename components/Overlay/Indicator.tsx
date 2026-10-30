import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

interface IndicatorProps {
  label: string;
  value: string;
}

// Apenas desenha um label + valor. Não calcula nada.
export function Indicator({ label, value }: IndicatorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    color: colors.textSecondary,
    fontSize: sizes.fontXs,
  },
  value: {
    color: colors.textPrimary,
    fontSize: sizes.fontMd,
    fontWeight: '600',
  },
});
