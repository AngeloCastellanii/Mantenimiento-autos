import { Button, Group, Modal, Text } from '@mantine/core';
import { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { VehicleGrid } from '../components/vehicles/VehicleGrid';
import { VehicleForm, type VehicleFormValues } from '../components/vehicles/VehicleForm';
import { useGarage } from '../context/GarageContext';
import type { Vehicle } from '../types';

export function VehiclesPage() {
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
      <PageHeader
        title="Mis vehículos"
        crumbs={[{ label: 'Inicio', to: '/' }, { label: 'Vehículos' }]}
      />
      <Group justify="flex-end" mb="md">
        <Button onClick={() => setOpened(true)}>+ Agregar vehículo</Button>
      </Group>
      {state.vehicles.length === 0 ? (
        <Text c="dimmed">No hay vehículos. Agrega el primero.</Text>
      ) : (
        <VehicleGrid vehicles={state.vehicles} />
      )}
      <Modal opened={opened} onClose={() => setOpened(false)} title="Nuevo vehículo" centered>
        <VehicleForm
          onSubmit={handleAdd}
          onCancel={() => setOpened(false)}
        />
      </Modal>
    </>
  );
}
