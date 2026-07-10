import { Card, Group, SimpleGrid, Text, ThemeIcon } from '@mantine/core';
import {
  IconAlertTriangle,
  IconCar,
  IconCoin,
  IconTool,
} from '@tabler/icons-react';
import { globalCost } from '../../services/selectors';
import { formatCurrency } from '../../lib/format';
import { useGarage } from '../../context/GarageContext';
import { useMaintenanceAlerts } from '../../hooks/useMaintenanceAlerts';

export function StatsCards() {
  const { state } = useGarage();
  const alerts = useMaintenanceAlerts();
  const activeAlerts = alerts.filter((a) => a.severity !== 'ok').length;

  const stats = [
    {
      label: 'Gasto total',
      hint: 'Suma de todos los servicios',
      value: formatCurrency(globalCost(state)),
      icon: IconCoin,
      color: 'indigo',
    },
    {
      label: 'Vehículos',
      hint: 'Autos en tu garaje',
      value: String(state.vehicles.length),
      icon: IconCar,
      color: 'teal',
    },
    {
      label: 'Servicios',
      hint: 'Mantenimientos registrados',
      value: String(state.maintenances.length),
      icon: IconTool,
      color: 'violet',
    },
    {
      label: 'Alertas',
      hint: 'Servicios por revisar',
      value: String(activeAlerts),
      icon: IconAlertTriangle,
      color: activeAlerts > 0 ? 'orange' : 'green',
    },
  ];

  return (
    <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }} mb="xl" spacing="md">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          padding="lg"
          style={{
            transition: 'transform 150ms ease, box-shadow 150ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--mantine-shadow-md)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'var(--mantine-shadow-sm)';
          }}
        >
          <Group wrap="nowrap" align="flex-start">
            <ThemeIcon size={44} radius="md" variant="light" color={stat.color}>
              <stat.icon size={22} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                {stat.label}
              </Text>
              <Text fw={800} size="xl" lh={1.2}>
                {stat.value}
              </Text>
              <Text size="xs" c="dimmed" mt={4}>
                {stat.hint}
              </Text>
            </div>
          </Group>
        </Card>
      ))}
    </SimpleGrid>
  );
}
