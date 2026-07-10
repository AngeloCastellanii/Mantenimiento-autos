import { Button, Group, Modal, Stack, Text, Title } from '@mantine/core';
import { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { StatsCards } from '../components/dashboard/StatsCards';
import { UpcomingAlerts } from '../components/dashboard/UpcomingAlerts';
import { VehicleGrid } from '../components/vehicles/VehicleGrid';
import { VehicleForm, type VehicleFormValues } from '../components/vehicles/VehicleForm';
import { useGarage } from '../context/GarageContext';
import type { Vehicle } from '../types';

export function DashboardPage() {
  const { state, addVehicle } = useGarage();
  const [opened, setOpened] = useState(false);

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
      <PageHeader title="Inicio" crumbs={[{ label: 'Inicio' }]} />
      <StatsCards />
      <Group justify="space-between" mb="md">
        <Title order={3}>Próximos mantenimientos</Title>
      </Group>
      <UpcomingAlerts limit={3} />
      <Group justify="space-between" mt="xl" mb="md">
        <Title order={3}>Mis vehículos</Title>
        <Button onClick={() => setOpened(true)}>Agregar vehículo</Button>
      </Group>
      {state.vehicles.length === 0 ? (
        <Stack align="center" py="lg">
          <Text c="dimmed">No hay vehículos registrados</Text>
          <Button onClick={() => setOpened(true)}>Agregar el primero</Button>
        </Stack>
      ) : (
        <VehicleGrid vehicles={state.vehicles.slice(0, 3)} />
      )}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Nuevo vehículo"
        centered
      >
        <VehicleForm onSubmit={handleAdd} onCancel={() => setOpened(false)} />
      </Modal>
    </>
  );
}
