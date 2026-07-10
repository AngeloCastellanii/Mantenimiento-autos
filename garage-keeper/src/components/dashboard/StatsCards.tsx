import { Card, Group, SimpleGrid, Text, ThemeIcon } from '@mantine/core';
import {
  IconAlertTriangle,
  IconCar,
  IconCoin,
  IconTool,
} from '@tabler/icons-react';
import { globalCost } from '../../services/selectors';
import { useGarage } from '../../context/GarageContext';
import { useMaintenanceAlerts } from '../../hooks/useMaintenanceAlerts';

export function StatsCards() {
  const { state } = useGarage();
  const alerts = useMaintenanceAlerts();
  const activeAlerts = alerts.filter((a) => a.severity !== 'ok').length;

  const stats = [
    {
      label: 'Gasto total',
      value: `$${globalCost(state).toLocaleString()}`,
      icon: IconCoin,
      color: 'blue',
    },
    {
      label: 'Vehículos',
      value: state.vehicles.length,
      icon: IconCar,
      color: 'teal',
    },
    {
      label: 'Servicios',
      value: state.maintenances.length,
      icon: IconTool,
      color: 'violet',
    },
    {
      label: 'Alertas activas',
      value: activeAlerts,
      icon: IconAlertTriangle,
      color: 'orange',
    },
  ];

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="xl">
      {stats.map((stat) => (
        <Card key={stat.label} withBorder padding="lg" radius="md">
          <Group>
            <ThemeIcon size={40} radius="md" variant="light" color={stat.color}>
              <stat.icon size={22} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                {stat.label}
              </Text>
              <Text fw={700} size="xl">
                {stat.value}
              </Text>
            </div>
          </Group>
        </Card>
      ))}
    </SimpleGrid>
  );
}
