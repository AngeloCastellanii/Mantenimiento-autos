// Página "Próximos mantenimientos" — lista completa (ESPECIFICACION §5.1, RF-04).
// DASHBOARD — owner: Marcial.
import { SegmentedControl, Stack } from '@mantine/core';
import { useMemo, useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { UpcomingAlerts } from '../components/dashboard/UpcomingAlerts';
import { useMaintenanceAlerts } from '../hooks/useMaintenanceAlerts';

type Filter = 'all' | 'critical' | 'warning';

export function UpcomingPage() {
  const alerts = useMaintenanceAlerts();
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
        crumbs={[{ label: 'Inicio', to: '/' }, { label: 'Próximos' }]}
      />
      <Stack gap="md">
        <SegmentedControl
          value={filter}
          onChange={(v) => setFilter(v as Filter)}
          data={[
            { label: `Todas (${alerts.length})`, value: 'all' },
            {
              label: `Vencidas (${alerts.filter((a) => a.severity === 'critical').length})`,
              value: 'critical',
            },
            {
              label: `Próximas (${alerts.filter((a) => a.severity === 'warning').length})`,
              value: 'warning',
            },
          ]}
        />
        <UpcomingAlerts
          alerts={filtered}
          emptyLabel="No hay alertas en esta categoría."
        />
      </Stack>
    </>
  );
}
