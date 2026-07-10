import { Badge, Card, Group, Stack, Text, Title } from '@mantine/core';
import { IconGauge } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { totalCostByVehicle } from '../../services/selectors';
import { useGarage } from '../../context/GarageContext';
import type { Vehicle } from '../../types';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const navigate = useNavigate();
  const { state } = useGarage();
  const total = totalCostByVehicle(state, vehicle.id);

  return (
    <Card
      withBorder
      shadow="sm"
      padding="lg"
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(`/vehiculos/${vehicle.id}`)}
    >
      <Group justify="space-between" mb="xs">
        <Title order={4}>{vehicle.alias}</Title>
        <Badge variant="light">{vehicle.year}</Badge>
      </Group>
      <Text size="sm" c="dimmed">
        {vehicle.brand} {vehicle.model}
      </Text>
      <Stack gap={4} mt="md">
        <Group gap={6}>
          <IconGauge size={16} />
          <Text size="sm">{vehicle.currentMileage.toLocaleString()} km</Text>
        </Group>
        <Text size="sm" fw={600}>
          Mantenimiento: ${total.toLocaleString()}
        </Text>
      </Stack>
    </Card>
  );
}
