import React from 'react';
import { View, Text, TextInput, Switch, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

interface ConfigCardNumberProps {
  type: 'number';
  label: string;
  value: number;
  onChange: (value: number) => void;
}

interface ConfigCardSwitchProps {
  type: 'switch';
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

type ConfigCardProps = ConfigCardNumberProps | ConfigCardSwitchProps;

// Apenas desenha uma linha de configuração. Quem decide o que fazer com o
// valor é o SettingsContext, via callback onChange.
export function ConfigCard(props: ConfigCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{props.label}</Text>

      {props.type === 'number' ? (
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(props.value)}
          onChangeText={(text) => {
            const parsed = parseFloat(text.replace(',', '.'));
            props.onChange(isNaN(parsed) ? 0 : parsed);
          }}
        />
      ) : (
        <Switch
          value={props.value}
          onValueChange={props.onChange}
          trackColor={{ false: colors.surfaceLight, true: colors.accept }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: sizes.spacingSm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    color: colors.textPrimary,
    fontSize: sizes.fontMd,
    flex: 1,
  },
  input: {
    color: colors.textPrimary,
    backgroundColor: colors.surfaceLight,
    borderRadius: sizes.radiusSm,
    paddingHorizontal: sizes.spacingSm,
    paddingVertical: sizes.spacingXs,
    minWidth: 70,
    textAlign: 'right',
  },
});
