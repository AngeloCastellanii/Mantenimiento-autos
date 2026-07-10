// Hooks de alertas derivadas del estado global (memoizados).
// MANTENIMIENTOS/DASHBOARD — owner: Marcial.
import { useMemo } from 'react';
import {
  computeAllAlerts,
  computeVehicleAlerts,
} from '../services/alertEngine';
import { useGarage } from '../context/GarageContext';
import type { MaintenanceAlert } from '../types';

/**
 * Alertas de toda la flota (excluye `ok` por defecto).
 */
export function useMaintenanceAlerts(includeOk = false): MaintenanceAlert[] {
  const { state } = useGarage();
  return useMemo(
    () =>
      computeAllAlerts(state.vehicles, state.maintenances, state.serviceTypes, {
        includeOk,
      }),
    [state, includeOk],
  );
}

/**
 * Alertas de un solo vehículo (todos los tipos, incluye `ok`).
 */
export function useVehicleAlerts(vehicleId: string): MaintenanceAlert[] {
  const { state } = useGarage();
  return useMemo(() => {
    const vehicle = state.vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return [];
    return computeVehicleAlerts(vehicle, state.maintenances, state.serviceTypes);
  }, [state, vehicleId]);
}
