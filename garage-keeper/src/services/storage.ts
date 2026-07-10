import { seedData } from '../data/seed';
import type { GarageState } from '../types';

const STORAGE_KEY = 'carroservizio-v2';

export function loadState(): GarageState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedData;
    return JSON.parse(raw) as GarageState;
  } catch {
    return seedData;
  }
}

export function saveState(state: GarageState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
