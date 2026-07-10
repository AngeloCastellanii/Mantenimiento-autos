// Los tipos de servicio ahora son dinámicos: el id es una cadena libre.
// Los valores integrados usan ids estables para conservar las alertas.
export type MaintenanceType = string;

export interface ServiceType {
  id: string;
  label: string;
  color?: string;
  /** Umbral de kilometraje para alertar (opcional). */
  km?: number;
  /** Umbral de meses para alertar (opcional). */
  months?: number;
  /** Si es true, alerta cuando no hay registro previo. */
  warnIfMissing?: boolean;
  /** Tipos integrados no se pueden eliminar. */
  builtIn?: boolean;
}

export interface Vehicle {
  id: string;
  alias: string;
  brand: string;
  model: string;
  year: number;
  currentMileage: number;
  plate?: string;
  createdAt: string;
}

export interface Maintenance {
  id: string;
  vehicleId: string;
  type: MaintenanceType;
  date: string;
  mileage: number;
  cost: number;
  provider: string;
  notes?: string;
  createdAt: string;
}

export type AlertSeverity = 'ok' | 'warning' | 'critical';

export interface MaintenanceAlert {
  vehicleId: string;
  vehicleAlias: string;
  type: MaintenanceType;
  severity: AlertSeverity;
  message: string;
  dueByMileage?: number;
  dueByDate?: string;
}

export interface GarageState {
  vehicles: Vehicle[];
  maintenances: Maintenance[];
  serviceTypes: ServiceType[];
}
