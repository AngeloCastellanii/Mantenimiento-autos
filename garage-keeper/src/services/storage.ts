import { get, set } from 'idb-keyval';
import { seedData } from '../data/seed';
import { DEFAULT_SERVICE_TYPES } from '../constants/maintenance';
import type { GarageState } from '../types';

const STORAGE_KEY = 'carroservizio-v2';

export async function loadState(): Promise<GarageState> {
  try {
    // 1. Try loading from IndexedDB
    let raw = await get<string>(STORAGE_KEY);
    
    // 2. If not found in IndexedDB, check localStorage for migration
    if (!raw) {
      const localRaw = localStorage.getItem(STORAGE_KEY);
      if (localRaw) {
        raw = localRaw;
        // Migrate it to IndexedDB
        await set(STORAGE_KEY, localRaw);
        // Clean up localStorage to free quota
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    if (!raw) return seedData;
    
    const parsed = JSON.parse(raw) as Partial<GarageState>;
    return {
      vehicles: parsed.vehicles ?? [],
      maintenances: parsed.maintenances ?? [],
      serviceTypes:
        parsed.serviceTypes && parsed.serviceTypes.length > 0
          ? parsed.serviceTypes
          : DEFAULT_SERVICE_TYPES,
    };
  } catch (error) {
    console.error('Failed to load state from IndexedDB:', error);
    return seedData;
  }
}

export async function saveState(state: GarageState): Promise<void> {
  try {
    await set(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to IndexedDB:', error);
  }
}
