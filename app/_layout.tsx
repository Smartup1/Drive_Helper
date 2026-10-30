import React from 'react';
import { Stack } from 'expo-router';
import { SettingsProvider } from '../context/SettingsContext';

export default function RootLayout() {
  return (
    <SettingsProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="settings" options={{ headerShown: true, title: 'Configurações' }} />
        <Stack.Screen name="test" options={{ headerShown: true, title: 'Simulador de Corrida' }} />
      </Stack>
    </SettingsProvider>
  );
}
