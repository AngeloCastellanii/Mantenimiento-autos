import { Badge, Card, Group, Stack, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { MAINTENANCE_LABELS } from '../../constants/maintenance';
import { useMaintenanceAlerts } from '../../hooks/useMaintenanceAlerts';

interface UpcomingAlertsProps {
  limit?: number;
}

export function UpcomingAlerts({ limit }: UpcomingAlertsProps) {
  const navigate = useNavigate();
  const alerts = useMaintenanceAlerts().filter((a) => a.severity !== 'ok');
  const visible = limit ? alerts.slice(0, limit) : alerts;

  if (visible.length === 0) {
    return (
      <Card withBorder>
        <Text c="dimmed">No hay alertas pendientes</Text>
      </Card>
    );
  }

  return (
    <Stack gap="sm">
      {visible.map((alert) => (
        <Card
          key={`${alert.vehicleId}-${alert.type}`}
          withBorder
          padding="md"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(`/vehiculos/${alert.vehicleId}`)}
        >
          <Group justify="space-between">
            <div>
              <Text fw={600}>{alert.vehicleAlias}</Text>
              <Text size="sm">{alert.message}</Text>
              <Text size="xs" c="dimmed">
                {MAINTENANCE_LABELS[alert.type]}
              </Text>
            </div>
            <Badge color={alert.severity === 'critical' ? 'red' : 'orange'}>
              {alert.severity === 'critical' ? 'Urgente' : 'Pronto'}
            </Badge>
          </Group>
        </Card>
      ))}
    </Stack>
  );
}
