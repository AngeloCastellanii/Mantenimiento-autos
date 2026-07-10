// Motor de alertas de mantenimiento (ESPECIFICACION §4).
//
// Calcula, por vehículo y tipo de servicio, si un mantenimiento está OK,
// próximo (warning) o vencido (critical), combinando umbrales de km y tiempo.
// Los umbrales ahora vienen de los tipos de servicio del estado (editables).
import { dayjs, formatMileage } from '../lib/format';
import type {
  AlertSeverity,
  GarageState,
  Maintenance,
  MaintenanceAlert,
  ServiceType,
  Vehicle,
} from '../types';

const WARNING_KM = 1000;
const WARNING_DAYS = 30;

/** Tipos que participan del motor (tienen al menos un umbral). */
export function alertableTypes(serviceTypes: ServiceType[]): ServiceType[] {
  return serviceTypes.filter((t) => t.km != null || t.months != null);
}

/**
 * Calcula la alerta de un tipo de servicio para un vehículo.
 * Devuelve `null` si el tipo no tiene umbral o si no hay registro previo y el
 * tipo no exige alerta por ausencia.
 */
export function computeAlert(
  vehicle: Vehicle,
  maintenances: Maintenance[],
  serviceType: ServiceType,
  now: Date = new Date(),
): MaintenanceAlert | null {
  if (serviceType.km == null && serviceType.months == null) return null;

  const label = serviceType.label;
  const base = {
    vehicleId: vehicle.id,
    vehicleAlias: vehicle.alias,
    type: serviceType.id,
  } as const;

  const last = maintenances
    .filter((m) => m.vehicleId === vehicle.id && m.type === serviceType.id)
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  if (!last) {
    if (!serviceType.warnIfMissing) return null;
    return {
      ...base,
      severity: 'warning',
      message: `Sin registro de ${label.toLowerCase()}. Se recomienda programar.`,
    };
  }

  const kmRestantes =
    serviceType.km != null
      ? last.mileage + serviceType.km - vehicle.currentMileage
      : undefined;

  const fechaLimite =
    serviceType.months != null
      ? dayjs(last.date).add(serviceType.months, 'month')
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

/** Alertas de un vehículo (todos los tipos alertables), ordenadas por severidad. */
export function computeVehicleAlerts(
  vehicle: Vehicle,
  maintenances: Maintenance[],
  serviceTypes: ServiceType[],
  now: Date = new Date(),
): MaintenanceAlert[] {
  return alertableTypes(serviceTypes)
    .map((t) => computeAlert(vehicle, maintenances, t, now))
    .filter((a): a is MaintenanceAlert => a !== null)
    .sort(bySeverity);
}

/** Alertas de toda la flota. Por defecto excluye las `ok` (panel principal). */
export function computeAllAlerts(
  vehicles: Vehicle[],
  maintenances: Maintenance[],
  serviceTypes: ServiceType[],
  options: { includeOk?: boolean; now?: Date } = {},
): MaintenanceAlert[] {
  const { includeOk = false, now = new Date() } = options;
  return vehicles
    .flatMap((v) => computeVehicleAlerts(v, maintenances, serviceTypes, now))
    .filter((a) => includeOk || a.severity !== 'ok')
    .sort(bySeverity);
}

/** Compat: alertas de toda la flota a partir del estado global. */
export function computeAlerts(
  state: GarageState,
  now: Date = new Date(),
): MaintenanceAlert[] {
  return computeAllAlerts(state.vehicles, state.maintenances, state.serviceTypes, {
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
