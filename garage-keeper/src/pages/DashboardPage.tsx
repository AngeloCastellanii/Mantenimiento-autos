import { Button, Group, Modal, Stack, Text } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_TAGLINE } from '../constants/brand';
import { PageHeader } from '../components/layout/PageHeader';
import { SectionBlock } from '../components/layout/SectionBlock';
import { StatsCards } from '../components/dashboard/StatsCards';
import { UpcomingAlerts } from '../components/dashboard/UpcomingAlerts';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { VehicleGrid } from '../components/vehicles/VehicleGrid';
import { VehicleForm, type VehicleFormValues } from '../components/vehicles/VehicleForm';
import { useGarage } from '../context/GarageContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { useResponsiveModalProps } from '../hooks/useResponsiveModal';
import type { Vehicle } from '../types';

export function DashboardPage() {
  const navigate = useNavigate();
  const { state, addVehicle } = useGarage();
  const [opened, setOpened] = useState(false);
  const isMobile = useIsMobile();
  const modalProps = useResponsiveModalProps();

  const handleAdd = (values: VehicleFormValues) => {
    const vehicle: Vehicle = {
      id: crypto.randomUUID(),
      alias: values.alias.trim(),
      brand: values.brand.trim(),
      model: values.model.trim(),
      year: Number(values.year),
      currentMileage: Number(values.currentMileage),
      plate: values.plate.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    addVehicle(vehicle);
    setOpened(false);
  };

  return (
    <>
      <PageHeader
        title="Inicio"
        subtitle={APP_TAGLINE}
        crumbs={[{ label: 'Inicio' }]}
      />

      <WelcomeBanner onAddVehicle={() => setOpened(true)} />
      <StatsCards />

      <SectionBlock
        title="Próximos mantenimientos"
        description="Servicios que vencen pronto o ya están atrasados."
        action={
          <Button
            variant="light"
            size="compact-sm"
            rightSection={<IconArrowRight size={14} />}
            onClick={() => navigate('/proximos')}
          >
            Ver todos
          </Button>
        }
      >
        <UpcomingAlerts limit={3} />
      </SectionBlock>

      <SectionBlock
        title="Mis vehículos"
        description="Selecciona un auto para ver su historial y registrar servicios."
        action={
          <Button onClick={() => setOpened(true)} fullWidth={isMobile} maw={isMobile ? undefined : 200}>
            Agregar vehículo
          </Button>
        }
        mb={0}
      >
        {state.vehicles.length === 0 ? (
          <Stack align="center" py="lg">
            <Text c="dimmed" ta="center">
              Aún no tienes vehículos. Agrega el primero para empezar a llevar el
              control.
            </Text>
            <Button onClick={() => setOpened(true)}>Agregar el primero</Button>
          </Stack>
        ) : (
          <>
            <VehicleGrid vehicles={state.vehicles.slice(0, 3)} />
            {state.vehicles.length > 3 && (
              <Group justify="center" mt="md">
                <Button variant="subtle" onClick={() => navigate('/vehiculos')}>
                  Ver los {state.vehicles.length} vehículos
                </Button>
              </Group>
            )}
          </>
        )}
      </SectionBlock>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Nuevo vehículo"
        {...modalProps}
      >
        <VehicleForm onSubmit={handleAdd} onCancel={() => setOpened(false)} />
      </Modal>
    </>
  );
}
