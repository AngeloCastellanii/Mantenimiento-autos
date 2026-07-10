import type { ServiceType } from '../types';

// Catálogo integrado de tipos de servicio (editable en Ajustes).
// Los ids son estables para conservar historial y alertas.
export const DEFAULT_SERVICE_TYPES: ServiceType[] = [
  {
    id: 'oil_change',
    label: 'Cambio de aceite',
    color: 'yellow',
    km: 5000,
    months: 6,
    warnIfMissing: true,
    builtIn: true,
  },
  { id: 'brakes', label: 'Frenos', color: 'red', km: 30000, builtIn: true },
  { id: 'tires', label: 'Cauchos', color: 'dark', km: 40000, builtIn: true },
  { id: 'battery', label: 'Batería', color: 'grape', months: 24, builtIn: true },
  {
    id: 'alignment',
    label: 'Alineación',
    color: 'cyan',
    km: 15000,
    builtIn: true,
  },
  {
    id: 'general_inspection',
    label: 'Revisión general',
    color: 'blue',
    months: 12,
    warnIfMissing: true,
    builtIn: true,
  },
  { id: 'other', label: 'Otro', color: 'gray', builtIn: true },
];

export const FALLBACK_TYPE_COLOR = 'teal';
