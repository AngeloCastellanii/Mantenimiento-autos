import { Button, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { IconAlertTriangle, IconCarSuv, IconPlus } from '@tabler/icons-react';
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
        background: 'var(--mantine-color-forest-7)',
        color: '#fff',
      }}
    >
      <Stack gap="sm">
        <Title order={3} c="white">
          Bienvenido a tu garaje digital
        </Title>
        <Text size="sm" maw={640} c="rgba(255,255,255,0.85)">
          {APP_DESCRIPTION} Empieza agregando un vehículo y luego registra cada
          visita a tu PitsTienda de confianza.
        </Text>
        <Group mt="xs" wrap="wrap">
          <Button
            color="white"
            variant="white"
            c="forest.7"
            leftSection={<IconPlus size={16} />}
            onClick={onAddVehicle}
            fullWidth={isMobile}
          >
            Agregar vehículo
          </Button>
          {alerts.length > 0 && (
            <Button
              variant="white"
              color="white"
              c="red.7"
              leftSection={<IconAlertTriangle size={16} />}
              onClick={() => navigate('/proximos')}
              fullWidth={isMobile}
            >
              Ver {alerts.length} alerta{alerts.length === 1 ? '' : 's'}
            </Button>
          )}
          {state.vehicles.length > 0 && (
            <Button
              variant="outline"
              color="white"
              leftSection={<IconCarSuv size={16} />}
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
