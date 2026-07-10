import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { loadState, saveState } from '../services/storage';
import type { GarageState, Maintenance, ServiceType, Vehicle } from '../types';

type Action =
  | { type: 'LOAD'; payload: GarageState }
  | { type: 'ADD_VEHICLE'; payload: Vehicle }
  | { type: 'UPDATE_VEHICLE'; payload: Vehicle }
  | { type: 'DELETE_VEHICLE'; payload: string }
  | { type: 'ADD_MAINTENANCE'; payload: Maintenance }
  | { type: 'UPDATE_MAINTENANCE'; payload: Maintenance }
  | { type: 'DELETE_MAINTENANCE'; payload: string }
  | { type: 'ADD_SERVICE_TYPE'; payload: ServiceType }
  | { type: 'UPDATE_SERVICE_TYPE'; payload: ServiceType }
  | { type: 'DELETE_SERVICE_TYPE'; payload: string };

function reducer(state: GarageState, action: Action): GarageState {
  switch (action.type) {
    case 'LOAD':
      return action.payload;
    case 'ADD_VEHICLE':
      return { ...state, vehicles: [...state.vehicles, action.payload] };
    case 'UPDATE_VEHICLE':
      return {
        ...state,
        vehicles: state.vehicles.map((v) =>
          v.id === action.payload.id ? action.payload : v,
        ),
      };
    case 'DELETE_VEHICLE':
      return {
        ...state,
        vehicles: state.vehicles.filter((v) => v.id !== action.payload),
        maintenances: state.maintenances.filter(
          (m) => m.vehicleId !== action.payload,
        ),
      };
    case 'ADD_MAINTENANCE': {
      const maintenance = action.payload;
      return {
        ...state,
        vehicles: state.vehicles.map((v) =>
          v.id === maintenance.vehicleId &&
          maintenance.mileage > v.currentMileage
            ? { ...v, currentMileage: maintenance.mileage }
            : v,
        ),
        maintenances: [...state.maintenances, maintenance],
      };
    }
    case 'UPDATE_MAINTENANCE': {
      const maintenance = action.payload;
      return {
        ...state,
        vehicles: state.vehicles.map((v) =>
          v.id === maintenance.vehicleId &&
          maintenance.mileage > v.currentMileage
            ? { ...v, currentMileage: maintenance.mileage }
            : v,
        ),
        maintenances: state.maintenances.map((m) =>
          m.id === maintenance.id ? maintenance : m,
        ),
      };
    }
    case 'DELETE_MAINTENANCE':
      return {
        ...state,
        maintenances: state.maintenances.filter((m) => m.id !== action.payload),
      };
    case 'ADD_SERVICE_TYPE':
      return { ...state, serviceTypes: [...state.serviceTypes, action.payload] };
    case 'UPDATE_SERVICE_TYPE':
      return {
        ...state,
        serviceTypes: state.serviceTypes.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t,
        ),
      };
    case 'DELETE_SERVICE_TYPE': {
      const target = state.serviceTypes.find((t) => t.id === action.payload);
      if (!target || target.builtIn) return state; // no se eliminan integrados
      return {
        ...state,
        serviceTypes: state.serviceTypes.filter((t) => t.id !== action.payload),
        // Reasignar servicios del tipo eliminado a "Otro".
        maintenances: state.maintenances.map((m) =>
          m.type === action.payload ? { ...m, type: 'other' } : m,
        ),
      };
    }
    default:
      return state;
  }
}

interface GarageContextValue {
  state: GarageState;
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (vehicle: Vehicle) => void;
  deleteVehicle: (id: string) => void;
  addMaintenance: (maintenance: Maintenance) => void;
  updateMaintenance: (maintenance: Maintenance) => void;
  deleteMaintenance: (id: string) => void;
  addServiceType: (serviceType: ServiceType) => void;
  updateServiceType: (serviceType: ServiceType) => void;
  deleteServiceType: (id: string) => void;
}

const GarageContext = createContext<GarageContextValue | null>(null);

export function GarageProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = useMemo<GarageContextValue>(
    () => ({
      state,
      addVehicle: (vehicle) =>
        dispatch({ type: 'ADD_VEHICLE', payload: vehicle }),
      updateVehicle: (vehicle) =>
        dispatch({ type: 'UPDATE_VEHICLE', payload: vehicle }),
      deleteVehicle: (id) => dispatch({ type: 'DELETE_VEHICLE', payload: id }),
      addMaintenance: (maintenance) =>
        dispatch({ type: 'ADD_MAINTENANCE', payload: maintenance }),
      updateMaintenance: (maintenance) =>
        dispatch({ type: 'UPDATE_MAINTENANCE', payload: maintenance }),
      deleteMaintenance: (id) =>
        dispatch({ type: 'DELETE_MAINTENANCE', payload: id }),
      addServiceType: (serviceType) =>
        dispatch({ type: 'ADD_SERVICE_TYPE', payload: serviceType }),
      updateServiceType: (serviceType) =>
        dispatch({ type: 'UPDATE_SERVICE_TYPE', payload: serviceType }),
      deleteServiceType: (id) =>
        dispatch({ type: 'DELETE_SERVICE_TYPE', payload: id }),
    }),
    [state],
  );

  return (
    <GarageContext.Provider value={value}>{children}</GarageContext.Provider>
  );
}

export function useGarage() {
  const ctx = useContext(GarageContext);
  if (!ctx) throw new Error('useGarage debe usarse dentro de GarageProvider');
  return ctx;
}
