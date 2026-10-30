import { NativeModules, Platform } from 'react-native';

// ATENÇÃO: Este serviço é apenas a CAMADA DE ABSTRAÇÃO.
// A implementação real do overlay (SYSTEM_ALERT_WINDOW) exige um módulo
// nativo Android próprio, que só funciona em um Development Build
// (não funciona no Expo Go / Managed Workflow).
//
// Aqui deixamos a interface pronta para quando o módulo nativo existir,
// com um fallback seguro (no-op) enquanto isso.

interface OverlayNativeModule {
  requestPermission(): Promise<boolean>;
  hasPermission(): Promise<boolean>;
  showOverlay(payload: string): void;
  updateOverlay(payload: string): void;
  hideOverlay(): void;
}

const NativeOverlay: OverlayNativeModule | undefined =
  Platform.OS === 'android' ? (NativeModules as any).OverlayModule : undefined;

function isAvailable(): boolean {
  return !!NativeOverlay;
}

async function requestPermission(): Promise<boolean> {
  if (!isAvailable()) {
    console.warn('[OverlayService] Módulo nativo indisponível (rode em Development Build).');
    return false;
  }
  return NativeOverlay!.requestPermission();
}

async function hasPermission(): Promise<boolean> {
  if (!isAvailable()) return false;
  return NativeOverlay!.hasPermission();
}

function show(payload: object): void {
  if (!isAvailable()) return;
  NativeOverlay!.showOverlay(JSON.stringify(payload));
}

function update(payload: object): void {
  if (!isAvailable()) return;
  NativeOverlay!.updateOverlay(JSON.stringify(payload));
}

function hide(): void {
  if (!isAvailable()) return;
  NativeOverlay!.hideOverlay();
}

export const OverlayService = {
  isAvailable,
  requestPermission,
  hasPermission,
  show,
  update,
  hide,
};
