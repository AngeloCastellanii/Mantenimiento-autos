import { Button, Modal, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { VehicleGrid } from '../components/vehicles/VehicleGrid';
import { VehicleForm, type VehicleFormValues } from '../components/vehicles/VehicleForm';
import { useGarage } from '../context/GarageContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { useResponsiveModalProps } from '../hooks/useResponsiveModal';
import type { Vehicle } from '../types';

export function VehiclesPage() {
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
        title="Mis vehículos"
        subtitle="Toca una tarjeta para abrir el historial de mantenimiento."
        crumbs={[{ label: 'Inicio', to: '/' }, { label: 'Vehículos' }]}
        action={
          <Button onClick={() => setOpened(true)} fullWidth={isMobile}>
            + Agregar vehículo
          </Button>
        }
      />
      {state.vehicles.length === 0 ? (
        <Stack align="center" py="xl">
          <Text c="dimmed" ta="center" maw={360}>
            Aquí aparecerán tus autos. Registra marca, modelo y kilometraje para
            comenzar.
          </Text>
          <Button onClick={() => setOpened(true)}>Agregar vehículo</Button>
        </Stack>
      ) : (
        <VehicleGrid vehicles={state.vehicles} />
      )}
      <Modal opened={opened} onClose={() => setOpened(false)} title="Nuevo vehículo" {...modalProps}>
        <VehicleForm
          onSubmit={handleAdd}
          onCancel={() => setOpened(false)}
        />
      </Modal>
    </>
  );
}
