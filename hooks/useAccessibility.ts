import { useEffect, useState } from 'react';
import { AccessibilityService } from '../services/AccessibilityService';
import { parseRide, isValidRide } from '../services/RideParser';
import { Ride } from '../types/Ride';

// Único responsável por: escutar o Accessibility Service e devolver um Ride.
// Não calcula score, não decide nada, só entrega o dado pronto.
export function useAccessibility() {
  const [ride, setRide] = useState<Ride | null>(null);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!AccessibilityService.isAvailable()) return;

    AccessibilityService.startListening();
    setListening(true);

    const unsubscribe = AccessibilityService.onRideOffer((raw) => {
      const parsed = parseRide(raw);
      if (isValidRide(parsed)) {
        setRide(parsed);
      }
    });

    return () => {
      AccessibilityService.stopListening();
      unsubscribe();
      setListening(false);
    };
  }, []);

  function clearRide() {
    setRide(null);
  }

  return { ride, listening, clearRide };
}
