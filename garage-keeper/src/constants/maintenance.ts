import type { MaintenanceType } from '../types';

export const MAINTENANCE_LABELS: Record<MaintenanceType, string> = {
  oil_change: 'Cambio de aceite',
  brakes: 'Frenos',
  tires: 'Llantas',
  battery: 'Batería',
  alignment: 'Alineación',
  general_inspection: 'Revisión general',
  other: 'Otro',
};

export const MAINTENANCE_OPTIONS = Object.entries(MAINTENANCE_LABELS).map(
  ([value, label]) => ({ value, label }),
);
