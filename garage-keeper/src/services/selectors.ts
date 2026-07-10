import type { GarageState } from '../types';

export function totalCostByVehicle(state: GarageState, vehicleId: string): number {
  return state.maintenances
    .filter((m) => m.vehicleId === vehicleId)
    .reduce((sum, m) => sum + m.cost, 0);
}

export function globalCost(state: GarageState): number {
  return state.maintenances.reduce((sum, m) => sum + m.cost, 0);
}

export function maintenanceCountByVehicle(
  state: GarageState,
  vehicleId: string,
): number {
  return state.maintenances.filter((m) => m.vehicleId === vehicleId).length;
}
