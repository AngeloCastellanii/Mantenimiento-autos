import type { GarageState, Maintenance } from '../types';

export interface ExpenseFilter {
  vehicleIds?: string[];
  typeIds?: string[];
}

/** Filtra servicios por vehículos y/o tipos (arrays vacíos = sin filtro). */
export function filterMaintenances(
  maintenances: Maintenance[],
  filter: ExpenseFilter = {},
): Maintenance[] {
  const { vehicleIds, typeIds } = filter;
  return maintenances.filter((m) => {
    if (vehicleIds && vehicleIds.length > 0 && !vehicleIds.includes(m.vehicleId))
      return false;
    if (typeIds && typeIds.length > 0 && !typeIds.includes(m.type)) return false;
    return true;
  });
}

/** Suma de costos agrupada por una clave (vehicleId o type). */
export function sumBy(
  maintenances: Maintenance[],
  key: 'vehicleId' | 'type',
): { key: string; total: number; count: number }[] {
  const map = new Map<string, { total: number; count: number }>();
  for (const m of maintenances) {
    const k = m[key];
    const acc = map.get(k) ?? { total: 0, count: 0 };
    acc.total += m.cost;
    acc.count += 1;
    map.set(k, acc);
  }
  return [...map.entries()]
    .map(([k, v]) => ({ key: k, ...v }))
    .sort((a, b) => b.total - a.total);
}

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
