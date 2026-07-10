import { Button, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { IconAlertTriangle, IconCar, IconPlus } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { APP_DESCRIPTION } from '../../constants/brand';
import { useGarage } from '../../context/GarageContext';
import { useMaintenanceAlerts } from '../../hooks/useMaintenanceAlerts';
import { useIsMobile } from '../../hooks/useIsMobile';

interface WelcomeBannerProps {
  onAddVehicle: () => void;
}

export function WelcomeBanner({ onAddVehicle }: WelcomeBannerProps) {
  const navigate = useNavigate();
  const { state } = useGarage();
  const alerts = useMaintenanceAlerts().filter((a) => a.severity !== 'ok');
  const isMobile = useIsMobile();

  return (
    <Paper
      p="lg"
      radius="md"
      mb="xl"
      withBorder
      style={{
        background:
          'linear-gradient(135deg, var(--mantine-color-indigo-0) 0%, var(--mantine-color-blue-0) 100%)',
      }}
    >
      <Stack gap="sm">
        <Title order={3}>Bienvenido a tu garaje digital</Title>
        <Text c="dimmed" size="sm" maw={640}>
          {APP_DESCRIPTION} Empieza agregando un vehículo y luego registra cada
          visita al taller.
        </Text>
        <Group mt="xs" wrap="wrap">
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={onAddVehicle}
            fullWidth={isMobile}
          >
            Agregar vehículo
          </Button>
          {alerts.length > 0 && (
            <Button
              variant="light"
              color="orange"
              leftSection={<IconAlertTriangle size={16} />}
              onClick={() => navigate('/proximos')}
              fullWidth={isMobile}
            >
              Ver {alerts.length} alerta{alerts.length === 1 ? '' : 's'}
            </Button>
          )}
          {state.vehicles.length > 0 && (
            <Button
              variant="default"
              leftSection={<IconCar size={16} />}
              onClick={() => navigate('/vehiculos')}
              fullWidth={isMobile}
            >
              Mis vehículos
            </Button>
          )}
        </Group>
      </Stack>
    </Paper>
  );
}
