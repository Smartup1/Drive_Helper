import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

interface DecisionBadgeProps {
  accept: boolean;
}

// Apenas desenha o badge de decisão. Não decide nada, só recebe "accept".
export function DecisionBadge({ accept }: DecisionBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: accept ? colors.accept : colors.deny }]}>
      <Text style={styles.text}>{accept ? 'ACEITAR' : 'NEGAR'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: sizes.spacingSm,
    paddingHorizontal: sizes.spacingLg,
    borderRadius: sizes.radiusMd,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: sizes.fontLg,
    letterSpacing: 1,
  },
});
