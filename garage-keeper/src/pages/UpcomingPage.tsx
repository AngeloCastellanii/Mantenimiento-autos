// Página "Próximos mantenimientos" — lista completa (ESPECIFICACION §5.1, RF-04).
// DASHBOARD — owner: Marcial.
import { SegmentedControl, Stack } from '@mantine/core';
import { useMemo, useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { UpcomingAlerts } from '../components/dashboard/UpcomingAlerts';
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
  const alerts = useMaintenanceAlerts();
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(
    () =>
      filter === 'all' ? alerts : alerts.filter((a) => a.severity === filter),
    [alerts, filter],
  );

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
