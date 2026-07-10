import { useMemo } from 'react';
import { useGarage } from '../context/GarageContext';
import { FALLBACK_TYPE_COLOR } from '../constants/maintenance';
import type { ServiceType } from '../types';

export function useServiceTypes() {
  const { state } = useGarage();
  const serviceTypes = state.serviceTypes;

  return useMemo(() => {
    const byId = new Map(serviceTypes.map((t) => [t.id, t]));
    return {
      serviceTypes,
      byId,
      options: serviceTypes.map((t) => ({ value: t.id, label: t.label })),
      getType: (id: string): ServiceType | undefined => byId.get(id),
      getLabel: (id: string): string => byId.get(id)?.label ?? id,
      getColor: (id: string): string => byId.get(id)?.color ?? FALLBACK_TYPE_COLOR,
    };
  }, [serviceTypes]);
}
