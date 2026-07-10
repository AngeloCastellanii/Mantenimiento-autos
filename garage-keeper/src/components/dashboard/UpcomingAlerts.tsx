// Panel "Próximos mantenimientos" (ESPECIFICACION §6.3, RF-04).
// DASHBOARD — owner: Marcial.
import {
  Badge,
  Card,
  Group,
  Stack,
  Text,
  ThemeIcon,
  UnstyledButton,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconExclamationCircle,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { ALERT_COLOR } from '../../app/theme';
import { useMaintenanceAlerts } from '../../hooks/useMaintenanceAlerts';
import type { AlertSeverity, MaintenanceAlert } from '../../types';

interface UpcomingAlertsProps {
  /** Si se omite, usa las alertas de toda la flota (dashboard/próximos). */
  alerts?: MaintenanceAlert[];
  /** Limita cuántas alertas se muestran (dashboard). */
  limit?: number;
  emptyLabel?: string;
}

const SEVERITY_ICON: Record<AlertSeverity, typeof IconAlertTriangle> = {
  critical: IconExclamationCircle,
  warning: IconAlertTriangle,
  ok: IconCircleCheck,
};

const SEVERITY_TEXT: Record<AlertSeverity, string> = {
  critical: 'Vencido',
  warning: 'Próximo',
  ok: 'Al día',
};

export function UpcomingAlerts({
  alerts: alertsProp,
  limit,
  emptyLabel = 'Todo al día. Sin mantenimientos próximos.',
}: UpcomingAlertsProps) {
  const navigate = useNavigate();
  const fleetAlerts = useMaintenanceAlerts();
  const alerts = alertsProp ?? fleetAlerts;
  const shown = limit ? alerts.slice(0, limit) : alerts;

  if (alerts.length === 0) {
    return (
      <Card withBorder padding="lg" radius="md">
        <Group>
          <ThemeIcon variant="light" color="green" size="lg" radius="md">
            <IconCircleCheck size={20} />
          </ThemeIcon>
          <Text c="dimmed">{emptyLabel}</Text>
        </Group>
      </Card>
    );
  }

  return (
    <Stack gap="xs">
      {shown.map((alert, i) => {
        const Icon = SEVERITY_ICON[alert.severity];
        const color = ALERT_COLOR[alert.severity];
        return (
          <UnstyledButton
            key={`${alert.vehicleId}-${alert.type}-${i}`}
            onClick={() => navigate(`/vehiculos/${alert.vehicleId}`)}
          >
            <Card
              withBorder
              padding="sm"
              radius="md"
              style={{ transition: 'transform 150ms ease, box-shadow 150ms ease' }}
            >
              <Group justify="space-between" wrap="nowrap">
                <Group wrap="nowrap" gap="sm">
                  <ThemeIcon variant="light" color={color} size="lg" radius="md">
                    <Icon size={20} />
                  </ThemeIcon>
                  <div>
                    <Text fw={600} size="sm">
                      {alert.vehicleAlias}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {alert.message}
                    </Text>
                  </div>
                </Group>
                <Badge color={color} variant="light">
                  {SEVERITY_TEXT[alert.severity]}
                </Badge>
              </Group>
            </Card>
          </UnstyledButton>
        );
      })}
    </Stack>
  );
}
