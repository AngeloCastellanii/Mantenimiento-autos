import { describe, expect, it } from 'vitest';
import { computeAlert, computeVehicleAlerts } from './alertEngine';
import type { Maintenance, ServiceType, Vehicle } from '../types';

const vehicle: Vehicle = {
  id: 'v1',
  alias: 'Test',
  brand: 'Toyota',
  model: 'Corolla',
  year: 2015,
  currentMileage: 16000,
  createdAt: '2025-01-01T00:00:00.000Z',
};

const oilChange: ServiceType = {
  id: 'oil_change',
  label: 'Cambio de aceite',
  km: 5000,
  months: 6,
  warnIfMissing: true,
};

const other: ServiceType = { id: 'other', label: 'Otro' };

function service(partial: Partial<Maintenance>): Maintenance {
  return {
    id: 'm',
    vehicleId: 'v1',
    type: 'oil_change',
    date: '2026-06-01',
    mileage: 15000,
    cost: 50,
    provider: 'AutoFast',
    createdAt: '2026-06-01T00:00:00.000Z',
    ...partial,
  };
}

const NOW = new Date('2026-07-01T00:00:00.000Z');

describe('computeAlert', () => {
  it('devuelve null para tipos sin umbral', () => {
    expect(computeAlert(vehicle, [], other, NOW)).toBeNull();
  });

  it('avisa (warning) cuando no hay registro y warnIfMissing es true', () => {
    const alert = computeAlert(vehicle, [], oilChange, NOW);
    expect(alert?.severity).toBe('warning');
  });

  it('marca critical cuando se excede el kilometraje', () => {
    // último a 10.000 km + 5.000 = 15.000; vehículo va en 16.000 → vencido.
    const alert = computeAlert(
      vehicle,
      [service({ mileage: 10000, date: '2026-06-20' })],
      oilChange,
      NOW,
    );
    expect(alert?.severity).toBe('critical');
  });

  it('marca ok cuando está dentro de los umbrales', () => {
    const near: Vehicle = { ...vehicle, currentMileage: 11000 };
    const alert = computeAlert(
      near,
      [service({ mileage: 10000, date: '2026-06-20' })],
      oilChange,
      NOW,
    );
    expect(alert?.severity).toBe('ok');
  });
});

describe('computeVehicleAlerts', () => {
  it('ordena por severidad (critical primero)', () => {
    const brakes: ServiceType = { id: 'brakes', label: 'Frenos', km: 100 };
    const alerts = computeVehicleAlerts(
      vehicle,
      [service({ mileage: 10000, date: '2026-06-20' })],
      [oilChange, brakes],
      NOW,
    );
    expect(alerts[0].severity).toBe('critical');
  });
});
