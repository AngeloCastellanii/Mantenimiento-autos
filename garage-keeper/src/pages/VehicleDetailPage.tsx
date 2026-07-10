import {
  Badge,
  Button,
  Group,
  Loader,
  Modal,
  Overlay,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { EmptyMaintenanceState } from '../components/maintenance/EmptyMaintenanceState';
import { MaintenanceDetailModal } from '../components/maintenance/MaintenanceDetailModal';
import {
  MaintenanceForm,
  type MaintenanceFormValues,
} from '../components/maintenance/MaintenanceForm';
import { MaintenanceTable } from '../components/maintenance/MaintenanceTable';
import { VehicleForm, type VehicleFormValues } from '../components/vehicles/VehicleForm';
import { useGarage } from '../context/GarageContext';
import { totalCostByVehicle } from '../services/selectors';
import type { Maintenance, MaintenanceType } from '../types';

export function VehicleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, addMaintenance, updateVehicle, deleteVehicle, deleteMaintenance } =
    useGarage();

  const vehicle = state.vehicles.find((v) => v.id === id);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Maintenance | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const maintenances = useMemo(() => {
    const list = state.maintenances
      .filter((m) => m.vehicleId === id)
      .sort((a, b) => b.date.localeCompare(a.date));
    if (!typeFilter) return list;
    return list.filter((m) => m.type === typeFilter);
  }, [state.maintenances, id, typeFilter]);

  if (!vehicle) {
    return <Text>Vehículo no encontrado</Text>;
  }

  const total = totalCostByVehicle(state, vehicle.id);

  const handleAddMaintenance = async (values: MaintenanceFormValues) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    const maintenance: Maintenance = {
      id: crypto.randomUUID(),
      vehicleId: vehicle.id,
      type: values.type as MaintenanceType,
      date: values.date!.toISOString().slice(0, 10),
      mileage: Number(values.mileage),
      cost: Number(values.cost),
      provider: values.provider.trim(),
      notes: values.notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    addMaintenance(maintenance);
    setSaving(false);
    setFormOpen(false);
  };

  const handleEditVehicle = (values: VehicleFormValues) => {
    updateVehicle({
      ...vehicle,
      alias: values.alias.trim(),
      brand: values.brand.trim(),
      model: values.model.trim(),
      year: Number(values.year),
      currentMileage: Number(values.currentMileage),
      plate: values.plate.trim() || undefined,
    });
    setEditOpen(false);
    notifications.show({ title: 'Vehículo actualizado', message: vehicle.alias, color: 'green' });
  };

  const handleDeleteVehicle = () => {
    deleteVehicle(vehicle.id);
    notifications.show({ title: 'Vehículo eliminado', message: vehicle.alias, color: 'red' });
    navigate('/vehiculos');
  };

  const handleDeleteMaintenance = (maintenanceId: string) => {
    deleteMaintenance(maintenanceId);
    setDetailOpen(false);
    setSelected(null);
    notifications.show({ title: 'Mantenimiento eliminado', message: 'Registro borrado', color: 'red' });
  };

  return (
    <>
      <PageHeader
        title={vehicle.alias}
        crumbs={[
          { label: 'Inicio', to: '/' },
          { label: 'Vehículos', to: '/vehiculos' },
          { label: vehicle.alias },
        ]}
      />
      <Stack gap="sm" mb="lg">
        <Group>
          <Badge size="lg" variant="light">
            {vehicle.brand} {vehicle.model} {vehicle.year}
          </Badge>
          <Text>{vehicle.currentMileage.toLocaleString()} km</Text>
        </Group>
        <Text fw={600}>Total en mantenimiento: ${total.toLocaleString()}</Text>
        <Group>
          <Button onClick={() => setFormOpen(true)}>+ Registrar mantenimiento</Button>
          <Button variant="light" onClick={() => setEditOpen(true)}>
            Editar
          </Button>
          <Button variant="light" color="red" onClick={() => setDeleteOpen(true)}>
            Eliminar
          </Button>
        </Group>
      </Stack>

      <Group justify="space-between" mb="md">
        <Title order={4}>Historial</Title>
        <Select
          placeholder="Filtrar por tipo"
          clearable
          data={[
            { value: 'oil_change', label: 'Cambio de aceite' },
            { value: 'brakes', label: 'Frenos' },
            { value: 'tires', label: 'Llantas' },
            { value: 'battery', label: 'Batería' },
            { value: 'alignment', label: 'Alineación' },
            { value: 'general_inspection', label: 'Revisión general' },
            { value: 'other', label: 'Otro' },
          ]}
          value={typeFilter}
          onChange={setTypeFilter}
          w={220}
        />
      </Group>

      {maintenances.length === 0 ? (
        <EmptyMaintenanceState onAdd={() => setFormOpen(true)} />
      ) : (
        <MaintenanceTable
          items={maintenances}
          onSelect={(item) => {
            setSelected(item);
            setDetailOpen(true);
          }}
        />
      )}

      <Modal opened={formOpen} onClose={() => setFormOpen(false)} title="Registrar mantenimiento" centered>
        {saving && (
          <Overlay backgroundOpacity={0.35} blur={1}>
            <Loader style={{ position: 'absolute', top: '50%', left: '50%' }} />
          </Overlay>
        )}
        <MaintenanceForm onSubmit={handleAddMaintenance} onCancel={() => setFormOpen(false)} />
      </Modal>

      <Modal opened={editOpen} onClose={() => setEditOpen(false)} title="Editar vehículo" centered>
        <VehicleForm
          initial={vehicle}
          onSubmit={handleEditVehicle}
          onCancel={() => setEditOpen(false)}
        />
      </Modal>

      <Modal opened={deleteOpen} onClose={() => setDeleteOpen(false)} title="Eliminar vehículo" centered>
        <Text mb="md">
          Se eliminarán también {state.maintenances.filter((m) => m.vehicleId === vehicle.id).length}{' '}
          mantenimientos asociados.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setDeleteOpen(false)}>
            Cancelar
          </Button>
          <Button color="red" onClick={handleDeleteVehicle}>
            Eliminar
          </Button>
        </Group>
      </Modal>

      <MaintenanceDetailModal
        maintenance={selected}
        opened={detailOpen}
        onClose={() => setDetailOpen(false)}
        onDelete={handleDeleteMaintenance}
      />
    </>
  );
}
