// Motor de alertas de mantenimiento (ESPECIFICACION §4).
// MANTENIMIENTOS/DASHBOARD — owner: Marcial.
//
// Calcula, por vehículo y tipo de servicio, si un mantenimiento está OK,
// próximo (warning) o vencido (critical), combinando umbrales de km y tiempo.
import { MAINTENANCE_LABELS } from '../constants/maintenance';
import { dayjs, formatMileage } from '../lib/format';
import type {
  AlertSeverity,
  GarageState,
  Maintenance,
  MaintenanceAlert,
  MaintenanceType,
  Vehicle,
} from '../types';

interface Threshold {
  km?: number;
  months?: number;
  // Si es true, alerta cuando NO hay registro previo del tipo.
  // Solo para servicios rutinarios; evita saturar el panel con "sin registro".
  warnIfMissing?: boolean;
}

// §4.1 — Umbrales por defecto (v1).
export const THRESHOLDS: Record<MaintenanceType, Threshold> = {
  oil_change: { km: 5000, months: 6, warnIfMissing: true },
  brakes: { km: 30000 },
  tires: { km: 40000 },
  battery: { months: 24 },
  alignment: { km: 15000 },
  general_inspection: { months: 12, warnIfMissing: true },
  other: {}, // sin alerta automática
};

const WARNING_KM = 1000;
const WARNING_DAYS = 30;

// Tipos que participan del motor (tienen al menos un umbral).
export const ALERTABLE_TYPES = (
  Object.keys(THRESHOLDS) as MaintenanceType[]
).filter((t) => THRESHOLDS[t].km != null || THRESHOLDS[t].months != null);

/**
 * Calcula la alerta de un tipo de servicio para un vehículo.
 * Devuelve `null` si el tipo no tiene umbral (ej. "other") o si no hay
 * registro previo y el tipo no exige alerta por ausencia.
 * `now` es inyectable para testeo determinista.
 */
export function computeAlert(
  vehicle: Vehicle,
  maintenances: Maintenance[],
  type: MaintenanceType,
  now: Date = new Date(),
): MaintenanceAlert | null {
  const threshold = THRESHOLDS[type];
  if (threshold.km == null && threshold.months == null) return null;

  const label = MAINTENANCE_LABELS[type];
  const base = {
    vehicleId: vehicle.id,
    vehicleAlias: vehicle.alias,
    type,
  } as const;

  // §4.2.1 — último mantenimiento del tipo T para el vehículo V.
  const last = maintenances
    .filter((m) => m.vehicleId === vehicle.id && m.type === type)
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  // §4.2.2 — sin registro previo.
  // Solo alerta en servicios rutinarios (warnIfMissing) para no saturar el panel.
  if (!last) {
    if (!threshold.warnIfMissing) return null;
    return {
      ...base,
      severity: 'warning',
      message: `Sin registro de ${label.toLowerCase()}. Se recomienda programar.`,
    };
  }

  // §4.2.3 — cálculo por km y por fecha (según umbrales disponibles).
  const kmRestantes =
    threshold.km != null
      ? last.mileage + threshold.km - vehicle.currentMileage
      : undefined;

  const fechaLimite =
    threshold.months != null
      ? dayjs(last.date).add(threshold.months, 'month')
      : undefined;
  const diasRestantes = fechaLimite
    ? fechaLimite.diff(dayjs(now), 'day')
    : undefined;

  const kmVencido = kmRestantes != null && kmRestantes <= 0;
  const fechaVencida = diasRestantes != null && diasRestantes <= 0;
  const kmCerca = kmRestantes != null && kmRestantes <= WARNING_KM;
  const fechaCerca = diasRestantes != null && diasRestantes <= WARNING_DAYS;

  let severity: AlertSeverity = 'ok';
  if (kmVencido || fechaVencida) severity = 'critical';
  else if (kmCerca || fechaCerca) severity = 'warning';

  return {
    ...base,
    severity,
    message: buildMessage(label, severity, {
      kmRestantes,
      diasRestantes,
      kmVencido,
      fechaVencida,
    }),
    dueByMileage: kmRestantes,
    dueByDate: fechaLimite?.toISOString(),
  };
}

interface MsgCtx {
  kmRestantes?: number;
  diasRestantes?: number;
  kmVencido: boolean;
  fechaVencida: boolean;
}

function buildMessage(
  label: string,
  severity: AlertSeverity,
  ctx: MsgCtx,
): string {
  const { kmRestantes, diasRestantes, kmVencido, fechaVencida } = ctx;

  if (severity === 'critical') {
    if (kmVencido && kmRestantes != null) {
      const exceso = Math.abs(kmRestantes);
      return exceso === 0
        ? `${label}: alcanzó el límite de kilometraje.`
        : `${label} vencido: excede por ${formatMileage(exceso)}.`;
    }
    if (fechaVencida && diasRestantes != null) {
      const dias = Math.abs(diasRestantes);
      return dias === 0
        ? `${label} vence hoy.`
        : `${label} vencido hace ${dias} días.`;
    }
    return `${label} vencido.`;
  }

  if (severity === 'warning') {
    const partes: string[] = [];
    if (kmRestantes != null && kmRestantes <= WARNING_KM) {
      partes.push(`en ~${formatMileage(Math.max(kmRestantes, 0))}`);
    }
    if (diasRestantes != null && diasRestantes <= WARNING_DAYS) {
      partes.push(`vence en ${Math.max(diasRestantes, 0)} días`);
    }
    return `${label} ${partes.join(' · ') || 'próximo'}.`;
  }

  return `${label} al día.`;
}

/**
 * Alertas de un vehículo (todos los tipos alertables), ordenadas por severidad.
 */
export function computeVehicleAlerts(
  vehicle: Vehicle,
  maintenances: Maintenance[],
  now: Date = new Date(),
): MaintenanceAlert[] {
  return ALERTABLE_TYPES.map((t) => computeAlert(vehicle, maintenances, t, now))
    .filter((a): a is MaintenanceAlert => a !== null)
    .sort(bySeverity);
}

/**
 * Alertas de toda la flota. Por defecto excluye las `ok` (panel principal).
 */
export function computeAllAlerts(
  vehicles: Vehicle[],
  maintenances: Maintenance[],
  options: { includeOk?: boolean; now?: Date } = {},
): MaintenanceAlert[] {
  const { includeOk = false, now = new Date() } = options;
  return vehicles
    .flatMap((v) => computeVehicleAlerts(v, maintenances, now))
    .filter((a) => includeOk || a.severity !== 'ok')
    .sort(bySeverity);
}

/**
 * Compat: alertas de toda la flota a partir del estado global.
 */
export function computeAlerts(
  state: GarageState,
  now: Date = new Date(),
): MaintenanceAlert[] {
  return computeAllAlerts(state.vehicles, state.maintenances, {
    includeOk: false,
    now,
  });
}

const SEVERITY_RANK: Record<AlertSeverity, number> = {
  critical: 0,
  warning: 1,
  ok: 2,
};

function bySeverity(a: MaintenanceAlert, b: MaintenanceAlert): number {
  return SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
}
