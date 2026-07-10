// Detalle de vehículo: info + historial + alertas (ESPECIFICACION §5.2, §8).
// Página — owner: Marcial. Usa Tabs (Compound Components) como patrón académico.
// Editar/eliminar vehículo son acciones compartidas con Angelo (VEHÍCULOS).
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Badge,
  Button,
  Card,
  Group,
  Loader,
  Modal,
  Overlay,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconAlertTriangle,
  IconCarSuv,
  IconClipboardList,
  IconInfoCircle,
  IconPencil,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { useGarage } from '../context/GarageContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { useResponsiveModalProps } from '../hooks/useResponsiveModal';
import { useVehicleAlerts } from '../hooks/useMaintenanceAlerts';
import { totalCostByVehicle } from '../services/selectors';
import { PageHeader } from '../components/layout/PageHeader';
import { MaintenanceTable } from '../components/maintenance/MaintenanceTable';
import { MaintenanceDetailModal } from '../components/maintenance/MaintenanceDetailModal';
import { UpcomingAlerts } from '../components/dashboard/UpcomingAlerts';
import {
  MaintenanceForm,
  type MaintenanceFormValues,
} from '../components/maintenance/MaintenanceForm';
import {
  VehicleForm,
  type VehicleFormValues,
} from '../components/vehicles/VehicleForm';
import { dayjs, formatCurrency, formatMileage } from '../lib/format';
import type { Maintenance, MaintenanceType } from '../types';

export function VehicleDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const {
    state,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance,
    updateVehicle,
    deleteVehicle,
  } = useGarage();

  const vehicle = state.vehicles.find((v) => v.id === id);
  const alerts = useVehicleAlerts(id);

  const maintenances = useMemo(
    () => state.maintenances.filter((m) => m.vehicleId === id),
    [state.maintenances, id],
  );

  // km máximo previo (regla cruzada del formulario).
  const lastMileage = useMemo(
    () => maintenances.reduce((max, m) => Math.max(max, m.mileage), 0),
    [maintenances],
  );

  // Estado de modales.
  const [formOpened, { open: openForm, close: closeForm }] =
    useDisclosure(false);
  const [editing, setEditing] = useState<Maintenance | null>(null);
  const [detail, setDetail] = useState<Maintenance | null>(null);
  const [detailOpened, { open: openDetail, close: closeDetail }] =
    useDisclosure(false);
  const [pendingDelete, setPendingDelete] = useState<Maintenance | null>(null);
  const [editVehOpened, { open: openEditVeh, close: closeEditVeh }] =
    useDisclosure(false);
  const [delVehOpened, { open: openDelVeh, close: closeDelVeh }] =
    useDisclosure(false);
  const [saving, setSaving] = useState(false);
  const isMobile = useIsMobile();
  const modalProps = useResponsiveModalProps();

  if (!vehicle) {
    return (
      <Card withBorder padding="xl" radius="md">
        <Stack align="center" gap="sm">
          <ThemeIcon variant="light" color="gray" size={56} radius="xl">
            <IconCarSuv size={30} />
          </ThemeIcon>
          <Text fw={600}>Vehículo no encontrado</Text>
          <Button onClick={() => navigate('/vehiculos')}>
            Volver a vehículos
          </Button>
        </Stack>
      </Card>
    );
  }

  // §8.2 — guardado con loader simulado (300 ms).
  async function handleAddOrEdit(values: MaintenanceFormValues) {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));

    const fields = {
      type: values.type as MaintenanceType,
      date: dayjs(values.date).format('YYYY-MM-DD'),
      mileage: Number(values.mileage),
      cost: Number(values.cost),
      provider: values.provider.trim(),
      notes: values.notes.trim() || undefined,
    };

    if (editing) {
      updateMaintenance({ ...editing, ...fields });
      notifications.show({
        title: 'Mantenimiento actualizado',
        message: 'Los cambios se guardaron.',
        color: 'green',
      });
    } else {
      addMaintenance({
        id: crypto.randomUUID(),
        vehicleId: id,
        ...fields,
        createdAt: new Date().toISOString(),
      });
      notifications.show({
        title: 'Mantenimiento registrado',
        message: 'El servicio se agregó al historial.',
        color: 'green',
      });
    }

    setSaving(false);
    setEditing(null);
    closeForm();
  }

  function handleRowClick(m: Maintenance) {
    setDetail(m);
    openDetail();
  }

  function handleEditFromDetail(m: Maintenance) {
    closeDetail();
    setEditing(m);
    openForm();
  }

  function handleDeleteFromDetail(m: Maintenance) {
    closeDetail();
    setPendingDelete(m);
  }

  function confirmDeleteMaintenance() {
    if (!pendingDelete) return;
    deleteMaintenance(pendingDelete.id);
    notifications.show({
      title: 'Mantenimiento eliminado',
      message: 'El servicio se quitó del historial.',
      color: 'red',
    });
    setPendingDelete(null);
  }

  // VehicleForm ya muestra su propia notificación al guardar.
  function handleEditVehicle(values: VehicleFormValues) {
    updateVehicle({
      ...vehicle!,
      alias: values.alias.trim(),
      brand: values.brand.trim(),
      model: values.model.trim(),
      year: Number(values.year),
      currentMileage: Number(values.currentMileage),
      plate: values.plate.trim() || undefined,
    });
    closeEditVeh();
  }

  function confirmDeleteVehicle() {
    deleteVehicle(id);
    notifications.show({
      title: 'Vehículo eliminado',
      message: `${vehicle!.alias} y sus mantenimientos se eliminaron.`,
      color: 'red',
    });
    navigate('/vehiculos');
  }

  const alertCount = alerts.filter((a) => a.severity !== 'ok').length;

  return (
    <>
      <PageHeader
        title={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
        subtitle={`${vehicle.alias} · Historial, alertas y datos del vehículo`}
        crumbs={[
          { label: 'Inicio', to: '/' },
          { label: 'Vehículos', to: '/vehiculos' },
          { label: vehicle.alias },
        ]}
        action={
          <Group gap="xs" wrap="wrap" justify={isMobile ? 'stretch' : 'flex-end'} w={isMobile ? '100%' : 'auto'}>
            <Button
              variant="default"
              leftSection={<IconPencil size={16} />}
              onClick={openEditVeh}
              fullWidth={isMobile}
            >
              Editar
            </Button>
            <Button
              color="red"
              variant="light"
              leftSection={<IconTrash size={16} />}
              onClick={openDelVeh}
              fullWidth={isMobile}
            >
              Eliminar
            </Button>
          </Group>
        }
      />

      {/* Resumen del vehículo */}
      <Card withBorder padding="lg" radius="md" mb="lg">
        <Stack gap="md">
          <Group gap="sm" wrap="nowrap" align="flex-start">
            <ThemeIcon variant="light" size={48} radius="md">
              <IconCarSuv size={26} />
            </ThemeIcon>
            <div style={{ minWidth: 0, flex: 1 }}>
              <Group gap="xs" wrap="wrap">
                <Text fw={600} size="lg">
                  {vehicle.alias}
                </Text>
                {vehicle.plate && (
                  <Badge variant="light">{vehicle.plate}</Badge>
                )}
              </Group>
              <Text c="dimmed" size="sm">
                {formatMileage(vehicle.currentMileage)} · {vehicle.year}
              </Text>
            </div>
          </Group>
          <div>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
              Total mantenimiento
            </Text>
            <Text fw={700} size="xl">
              {formatCurrency(totalCostByVehicle(state, id))}
            </Text>
          </div>
        </Stack>
      </Card>

      <Button
        leftSection={<IconPlus size={16} />}
        onClick={() => {
          setEditing(null);
          openForm();
        }}
        fullWidth={isMobile}
        mb="md"
      >
        Registrar mantenimiento
      </Button>

      {/* Tabs = Compound Components (patrón académico) */}
      <Tabs defaultValue="historial" orientation={isMobile ? 'vertical' : 'horizontal'}>
        <Tabs.List mb="md" grow={isMobile}>
          <Tabs.Tab
            value="historial"
            leftSection={<IconClipboardList size={16} />}
          >
            Historial
          </Tabs.Tab>
          <Tabs.Tab
            value="alertas"
            leftSection={<IconAlertTriangle size={16} />}
            rightSection={
              alertCount > 0 ? (
                <Badge size="xs" color="orange" circle>
                  {alertCount}
                </Badge>
              ) : null
            }
          >
            Alertas
          </Tabs.Tab>
          <Tabs.Tab value="info" leftSection={<IconInfoCircle size={16} />}>
            Info
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="historial">
          <MaintenanceTable
            maintenances={maintenances}
            onRowClick={handleRowClick}
            onAdd={() => {
              setEditing(null);
              openForm();
            }}
          />
        </Tabs.Panel>

        <Tabs.Panel value="alertas">
          <UpcomingAlerts
            alerts={alerts.filter((a) => a.severity !== 'ok')}
            emptyLabel="Este vehículo está al día con sus mantenimientos."
          />
        </Tabs.Panel>

        <Tabs.Panel value="info">
          <Card withBorder padding="lg" radius="md">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <InfoField label="Alias" value={vehicle.alias} />
              <InfoField label="Marca" value={vehicle.brand} />
              <InfoField label="Modelo" value={vehicle.model} />
              <InfoField label="Año" value={String(vehicle.year)} />
              <InfoField
                label="Kilometraje actual"
                value={formatMileage(vehicle.currentMileage)}
              />
              <InfoField label="Placa" value={vehicle.plate ?? '—'} />
            </SimpleGrid>
          </Card>
        </Tabs.Panel>
      </Tabs>

      {/* Modal: crear/editar mantenimiento */}
      <Modal
        opened={formOpened}
        onClose={() => {
          if (saving) return;
          setEditing(null);
          closeForm();
        }}
        title={editing ? 'Editar mantenimiento' : 'Registrar mantenimiento'}
        {...modalProps}
      >
        {saving && (
          <Overlay backgroundOpacity={0.35} blur={1} zIndex={1000}>
            <Loader
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </Overlay>
        )}
        <MaintenanceForm
          initial={editing ?? undefined}
          lastMileage={editing ? undefined : lastMileage || undefined}
          onSubmit={handleAddOrEdit}
          onCancel={() => {
            setEditing(null);
            closeForm();
          }}
        />
      </Modal>

      {/* Modal: detalle mantenimiento */}
      <MaintenanceDetailModal
        maintenance={detail}
        opened={detailOpened}
        onClose={closeDetail}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteFromDetail}
      />

      {/* Modal: confirmar eliminar mantenimiento */}
      <Modal
        opened={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="Eliminar mantenimiento"
        {...modalProps}
      >
        <Stack>
          <Text size="sm">
            ¿Seguro que deseas eliminar este servicio? Esta acción no se puede
            deshacer.
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setPendingDelete(null)}>
              Cancelar
            </Button>
            <Button color="red" onClick={confirmDeleteMaintenance}>
              Eliminar
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Modal: editar vehículo (compartido con Angelo) */}
      <Modal
        opened={editVehOpened}
        onClose={closeEditVeh}
        title="Editar vehículo"
        {...modalProps}
      >
        <VehicleForm
          initial={vehicle}
          onSubmit={handleEditVehicle}
          onCancel={closeEditVeh}
        />
      </Modal>

      {/* Modal: confirmar eliminar vehículo (compartido con Angelo) */}
      <Modal
        opened={delVehOpened}
        onClose={closeDelVeh}
        title="Eliminar vehículo"
        {...modalProps}
      >
        <Stack>
          <Text size="sm">
            Se eliminarán <b>{vehicle.alias}</b> y sus{' '}
            <b>{maintenances.length}</b> mantenimientos asociados. Esta acción no
            se puede deshacer.
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={closeDelVeh}>
              Cancelar
            </Button>
            <Button color="red" onClick={confirmDeleteVehicle}>
              Eliminar
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
        {label}
      </Text>
      <Text>{value}</Text>
    </div>
  );
}
