import { Badge, Button, Card, Group, Stack, Text, ThemeIcon, Title, Avatar } from '@mantine/core';
import { IconArrowRight, IconCarSuv, IconGauge } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { totalCostByVehicle } from '../../services/selectors';
import { formatCurrency, formatMileage } from '../../lib/format';
import { useGarage } from '../../context/GarageContext';
import type { Vehicle } from '../../types';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const navigate = useNavigate();
  const { state } = useGarage();
  const total = totalCostByVehicle(state, vehicle.id);
  const serviceCount = state.maintenances.filter((m) => m.vehicleId === vehicle.id).length;

  return (
    <Card
      padding="lg"
      style={{
        cursor: 'pointer',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
      }}
      onClick={() => navigate(`/vehiculos/${vehicle.id}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = 'var(--mantine-shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'var(--mantine-shadow-sm)';
      }}
    >
      <Group justify="space-between" mb="sm" wrap="nowrap">
        {vehicle.photoDataUrl ? (
          <Avatar src={vehicle.photoDataUrl} size="lg" radius="md" />
        ) : (
          <ThemeIcon variant="light" color="forest" size="lg" radius="md">
            <IconCarSuv size={20} />
          </ThemeIcon>
        )}
        <Badge variant="light" color="forest">
          {vehicle.year}
        </Badge>
      </Group>
      <Title order={4} mb={4}>
        {vehicle.alias}
      </Title>
      <Text size="sm" c="dimmed" mb="md">
        {vehicle.brand} {vehicle.model}
        {vehicle.plate ? ` · ${vehicle.plate}` : ''}
      </Text>
      <Stack gap={6}>
        <Group gap={6}>
          <IconGauge size={16} color="var(--mantine-color-dimmed)" />
          <Text size="sm">{formatMileage(vehicle.currentMileage)}</Text>
        </Group>
        <Text size="sm">
          <Text span fw={600}>
            {formatCurrency(total)}
          </Text>{' '}
          en mantenimiento
        </Text>
        <Text size="xs" c="dimmed">
          {serviceCount} servicio{serviceCount === 1 ? '' : 's'} registrado
          {serviceCount === 1 ? '' : 's'}
        </Text>
      </Stack>
      <Button
        variant="subtle"
        size="compact-sm"
        mt="md"
        rightSection={<IconArrowRight size={14} />}
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/vehiculos/${vehicle.id}`);
        }}
      >
        Ver historial
      </Button>
    </Card>
  );
}
