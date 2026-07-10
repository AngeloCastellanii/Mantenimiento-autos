import { seedData } from '../data/seed';
import { DEFAULT_SERVICE_TYPES } from '../constants/maintenance';
import type { GarageState } from '../types';

const STORAGE_KEY = 'carroservizio-v2';

export function loadState(): GarageState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedData;
    const parsed = JSON.parse(raw) as Partial<GarageState>;
    return {
      vehicles: parsed.vehicles ?? [],
      maintenances: parsed.maintenances ?? [],
      // Estados guardados antes de tipos dinámicos: rellenar defaults.
      serviceTypes:
        parsed.serviceTypes && parsed.serviceTypes.length > 0
          ? parsed.serviceTypes
          : DEFAULT_SERVICE_TYPES,
    };
  } catch {
    return seedData;
  }
}

export function saveState(state: GarageState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
