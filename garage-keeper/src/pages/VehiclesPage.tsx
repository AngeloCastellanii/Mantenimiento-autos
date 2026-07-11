import { Button, Group, Modal, Select, Stack, Text, TextInput } from '@mantine/core';
import { IconCarSuv, IconSearch } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState } from '../components/layout/EmptyState';
import { VehicleGrid } from '../components/vehicles/VehicleGrid';
import { VehicleForm, type VehicleFormValues } from '../components/vehicles/VehicleForm';
import { useGarage } from '../context/GarageContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { useResponsiveModalProps } from '../hooks/useResponsiveModal';
import { totalCostByVehicle } from '../services/selectors';
import type { Vehicle } from '../types';

type SortBy = 'alias' | 'mileage' | 'cost' | 'recent';

const SORT_OPTIONS = [
  { value: 'recent', label: 'Más recientes' },
  { value: 'alias', label: 'Nombre (A-Z)' },
  { value: 'mileage', label: 'Mayor kilometraje' },
  { value: 'cost', label: 'Mayor gasto' },
];

export function VehiclesPage() {
  const { state, addVehicle } = useGarage();
  const [opened, setOpened] = useState(false);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('recent');
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

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = state.vehicles.filter((v) =>
      q === ''
        ? true
        : [v.alias, v.brand, v.model, v.plate ?? '']
            .join(' ')
            .toLowerCase()
            .includes(q),
    );
    const sorted = [...list];
    switch (sortBy) {
      case 'alias':
        sorted.sort((a, b) => a.alias.localeCompare(b.alias));
        break;
      case 'mileage':
        sorted.sort((a, b) => b.currentMileage - a.currentMileage);
        break;
      case 'cost':
        sorted.sort(
          (a, b) =>
            totalCostByVehicle(state, b.id) - totalCostByVehicle(state, a.id),
        );
        break;
      default:
        sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    return sorted;
  }, [state, query, sortBy]);

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
        <EmptyState
          icon={IconCarSuv}
          title="Aún no tienes vehículos"
          description="Registra marca, modelo y kilometraje para comenzar a llevar el control."
          action={<Button onClick={() => setOpened(true)}>Agregar vehículo</Button>}
        />
      ) : (
        <Stack gap="md">
          <Group grow={isMobile} align="flex-end" wrap="wrap">
            <TextInput
              placeholder="Buscar por nombre, marca, modelo o placa"
              leftSection={<IconSearch size={16} />}
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
              w={isMobile ? undefined : 340}
            />
            <Select
              data={SORT_OPTIONS}
              value={sortBy}
              onChange={(v) => setSortBy((v as SortBy) ?? 'recent')}
              allowDeselect={false}
              w={isMobile ? undefined : 220}
              aria-label="Ordenar vehículos"
            />
          </Group>
          {visible.length === 0 ? (
            <Text c="dimmed" ta="center" py="lg">
              No hay vehículos que coincidan con "{query}".
            </Text>
          ) : (
            <VehicleGrid vehicles={visible} />
          )}
        </Stack>
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
