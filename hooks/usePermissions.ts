import { useCallback, useEffect, useState } from 'react';
import { OverlayService } from '../services/OverlayService';
import { AccessibilityService } from '../services/AccessibilityService';

interface PermissionsState {
  overlayGranted: boolean;
  accessibilityGranted: boolean;
  checking: boolean;
}

// Único responsável por saber se as permissões nativas estão concedidas.
// Não sabe desenhar nada, não sabe analisar corrida.
export function usePermissions() {
  const [state, setState] = useState<PermissionsState>({
    overlayGranted: false,
    accessibilityGranted: false,
    checking: true,
  });

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, checking: true }));

    const [overlayGranted, accessibilityGranted] = await Promise.all([
      OverlayService.hasPermission(),
      AccessibilityService.isServiceEnabled(),
    ]);

    setState({ overlayGranted, accessibilityGranted, checking: false });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const requestOverlay = useCallback(async () => {
    await OverlayService.requestPermission();
    await refresh();
  }, [refresh]);

  const requestAccessibility = useCallback(() => {
    AccessibilityService.openSettings();
  }, []);

  return {
    ...state,
    refresh,
    requestOverlay,
    requestAccessibility,
  };
}
