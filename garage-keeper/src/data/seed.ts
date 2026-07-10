import type { GarageState } from '../types';

export const seedData: GarageState = {
  vehicles: [
    {
      id: 'v1',
      alias: 'Mi Corolla',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2019,
      currentMileage: 85000,
      plate: 'AB123CD',
      createdAt: '2025-01-10T00:00:00.000Z',
    },
    {
      id: 'v2',
      alias: 'Civic Familiar',
      brand: 'Honda',
      model: 'Civic',
      year: 2021,
      currentMileage: 42000,
      createdAt: '2025-03-15T00:00:00.000Z',
    },
  ],
  maintenances: [
    {
      id: 'm1',
      vehicleId: 'v1',
      type: 'oil_change',
      date: '2025-09-01',
      mileage: 80000,
      cost: 45,
      provider: 'AutoFast',
      createdAt: '2025-09-01T00:00:00.000Z',
    },
    {
      id: 'm2',
      vehicleId: 'v1',
      type: 'brakes',
      date: '2025-03-15',
      mileage: 75000,
      cost: 320,
      provider: 'Frenos+',
      createdAt: '2025-03-15T00:00:00.000Z',
    },
    {
      id: 'm3',
      vehicleId: 'v2',
      type: 'oil_change',
      date: '2026-01-10',
      mileage: 40000,
      cost: 50,
      provider: 'Lubricentro Central',
      createdAt: '2026-01-10T00:00:00.000Z',
    },
  ],
};
