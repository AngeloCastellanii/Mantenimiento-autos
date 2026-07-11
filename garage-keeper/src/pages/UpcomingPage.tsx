// Página "Próximos mantenimientos" — lista completa (ESPECIFICACION §5.1, RF-04).
// DASHBOARD — owner: Marcial.
import { Button, SegmentedControl, Stack } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState } from '../components/layout/EmptyState';
import { UpcomingAlerts } from '../components/dashboard/UpcomingAlerts';
import { useGarage } from '../context/GarageContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { useMaintenanceAlerts } from '../hooks/useMaintenanceAlerts';

type Filter = 'all' | 'critical' | 'warning';

const filterData = (alerts: ReturnType<typeof useMaintenanceAlerts>) => [
  { label: `Todas (${alerts.length})`, value: 'all' },
  {
    label: `Vencidas (${alerts.filter((a) => a.severity === 'critical').length})`,
    value: 'critical',
  },
  {
    label: `Próximas (${alerts.filter((a) => a.severity === 'warning').length})`,
    value: 'warning',
  },
];

export function UpcomingPage() {
  const navigate = useNavigate();
  const { state } = useGarage();
  const alerts = useMaintenanceAlerts();
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(
    () =>
      filter === 'all' ? alerts : alerts.filter((a) => a.severity === filter),
    [alerts, filter],
  );

  if (state.vehicles.length === 0) {
    return (
      <>
        <PageHeader
          title="Próximos mantenimientos"
          subtitle="Revisa qué servicios están vencidos o se acercan por km o tiempo."
          crumbs={[{ label: 'Inicio', to: '/' }, { label: 'Próximos' }]}
        />
        <EmptyState
          icon={IconAlertTriangle}
          title="Sin alertas todavía"
          description="Cuando agregues vehículos y servicios, aquí verás los mantenimientos próximos o vencidos."
          action={
            <Button onClick={() => navigate('/vehiculos')}>
              Agregar vehículo
            </Button>
          }
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Próximos mantenimientos"
        subtitle="Revisa qué servicios están vencidos o se acercan por km o tiempo."
        crumbs={[{ label: 'Inicio', to: '/' }, { label: 'Próximos' }]}
      />
      <Stack gap="md">
        <SegmentedControl
          value={filter}
          onChange={(v) => setFilter(v as Filter)}
          data={filterData(alerts)}
          fullWidth={isMobile}
          orientation={isMobile ? 'vertical' : 'horizontal'}
        />
        <UpcomingAlerts
          alerts={filtered}
          emptyLabel="No hay alertas en esta categoría."
        />
      </Stack>
    </>
  );
}
