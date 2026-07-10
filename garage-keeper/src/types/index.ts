export type MaintenanceType =
  | 'oil_change'
  | 'brakes'
  | 'tires'
  | 'battery'
  | 'alignment'
  | 'general_inspection'
  | 'other';

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
}
