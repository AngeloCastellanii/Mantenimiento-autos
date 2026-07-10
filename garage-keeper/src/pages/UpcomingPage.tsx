import { PageHeader } from '../components/layout/PageHeader';
import { UpcomingAlerts } from '../components/dashboard/UpcomingAlerts';

export function UpcomingPage() {
  return (
    <>
      <PageHeader
        title="Próximos mantenimientos"
        crumbs={[{ label: 'Inicio', to: '/' }, { label: 'Próximos' }]}
      />
      <UpcomingAlerts />
    </>
  );
}
