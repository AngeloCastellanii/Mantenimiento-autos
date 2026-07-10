import dayjs from 'dayjs';
import { MAINTENANCE_LABELS } from '../constants/maintenance';
import type {
  GarageState,
  MaintenanceAlert,
  MaintenanceType,
  AlertSeverity,
} from '../types';

const THRESHOLDS: Record<
  MaintenanceType,
  { km?: number; months?: number }
> = {
  oil_change: { km: 5000, months: 6 },
  brakes: { km: 30000 },
  tires: { km: 40000 },
  battery: { months: 24 },
  alignment: { km: 15000 },
  general_inspection: { months: 12 },
  other: {},
};

const ALERT_TYPES: MaintenanceType[] = [
  'oil_change',
  'brakes',
  'tires',
  'battery',
  'alignment',
  'general_inspection',
];

function worstSeverity(a: AlertSeverity, b: AlertSeverity): AlertSeverity {
  const order = { ok: 0, warning: 1, critical: 2 };
  return order[a] >= order[b] ? a : b;
}

export function computeAlerts(state: GarageState): MaintenanceAlert[] {
  const alerts: MaintenanceAlert[] = [];
  const today = dayjs();

  for (const vehicle of state.vehicles) {
    for (const type of ALERT_TYPES) {
      const label = MAINTENANCE_LABELS[type];
      const threshold = THRESHOLDS[type];
      const last = state.maintenances
        .filter((m) => m.vehicleId === vehicle.id && m.type === type)
        .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())[0];

      if (!last) {
        alerts.push({
          vehicleId: vehicle.id,
          vehicleAlias: vehicle.alias,
          type,
          severity: 'warning',
          message: `Sin registro de ${label}. Se recomienda programar.`,
        });
        continue;
      }

      let severity: AlertSeverity = 'ok';
      let message = `${label} al día`;
      let dueByMileage: number | undefined;
      let dueByDate: string | undefined;

      if (threshold.km) {
        const remaining = last.mileage + threshold.km - vehicle.currentMileage;
        dueByMileage = remaining;
        if (remaining <= 0) {
          severity = 'critical';
          message = `${label} vencido por kilometraje`;
        } else if (remaining <= 1000) {
          severity = worstSeverity(severity, 'warning');
          message = `${label} en ~${remaining.toLocaleString()} km`;
        }
      }

      if (threshold.months) {
        const due = dayjs(last.date).add(threshold.months, 'month');
        dueByDate = due.format('YYYY-MM-DD');
        const daysLeft = due.diff(today, 'day');
        if (daysLeft <= 0) {
          severity = 'critical';
          message = `${label} vencido por fecha`;
        } else if (daysLeft <= 30) {
          severity = worstSeverity(severity, 'warning');
          message = `${label} vence en ${daysLeft} días`;
        }
      }

      if (severity !== 'ok') {
        alerts.push({
          vehicleId: vehicle.id,
          vehicleAlias: vehicle.alias,
          type,
          severity,
          message,
          dueByMileage,
          dueByDate,
        });
      }
    }
  }

  return alerts.sort((a, b) => {
    const order = { critical: 0, warning: 1, ok: 2 };
    return order[a.severity] - order[b.severity];
  });
}
