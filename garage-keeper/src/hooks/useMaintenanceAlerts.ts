import { useMemo } from 'react';
import { computeAlerts } from '../services/alertEngine';
import { useGarage } from '../context/GarageContext';

export function useMaintenanceAlerts() {
  const { state } = useGarage();
  return useMemo(() => computeAlerts(state), [state]);
}
