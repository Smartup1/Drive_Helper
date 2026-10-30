import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import { RawRideText } from '../types/Ride';

// ATENÇÃO: Este serviço é apenas a CAMADA DE ABSTRAÇÃO.
// A leitura real da tela do app da Uber Driver exige um Accessibility Service
// nativo Android (AccessibilityService.java/kt), registrado no
// AndroidManifest.xml, rodando num Development Build.
//
// Ele escuta a tela e emite eventos com o texto bruto encontrado.
// Este arquivo só escuta — não faz nenhum cálculo (isso é papel do
// RideParser + RideAnalyzer).

interface AccessibilityNativeModule {
  isServiceEnabled(): Promise<boolean>;
  openAccessibilitySettings(): void;
  startListening(): void;
  stopListening(): void;
}

const NativeAccessibility: AccessibilityNativeModule | undefined =
  Platform.OS === 'android' ? (NativeModules as any).AccessibilityModule : undefined;

const emitter = NativeAccessibility
  ? new NativeEventEmitter(NativeModules.AccessibilityModule)
  : undefined;

const RIDE_OFFER_EVENT = 'onRideOfferDetected';

function isAvailable(): boolean {
  return !!NativeAccessibility;
}

async function isServiceEnabled(): Promise<boolean> {
  if (!isAvailable()) return false;
  return NativeAccessibility!.isServiceEnabled();
}

function openSettings(): void {
  if (!isAvailable()) {
    console.warn('[AccessibilityService] Módulo nativo indisponível (rode em Development Build).');
    return;
  }
  NativeAccessibility!.openAccessibilitySettings();
}

function startListening(): void {
  if (!isAvailable()) return;
  NativeAccessibility!.startListening();
}

function stopListening(): void {
  if (!isAvailable()) return;
  NativeAccessibility!.stopListening();
}

// Registra um callback chamado toda vez que uma nova oferta é detectada na tela
function onRideOffer(callback: (raw: RawRideText) => void): () => void {
  if (!emitter) {
    return () => {};
  }

  const subscription = emitter.addListener(RIDE_OFFER_EVENT, callback);
  return () => subscription.remove();
}

export const AccessibilityService = {
  isAvailable,
  isServiceEnabled,
  openSettings,
  startListening,
  stopListening,
  onRideOffer,
};
