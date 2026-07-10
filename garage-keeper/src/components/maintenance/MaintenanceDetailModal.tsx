import { Button, Group, Modal, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { MAINTENANCE_LABELS } from '../../constants/maintenance';
import type { Maintenance } from '../../types';

interface MaintenanceDetailModalProps {
  maintenance: Maintenance | null;
  opened: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export function MaintenanceDetailModal({
  maintenance,
  opened,
  onClose,
  onDelete,
}: MaintenanceDetailModalProps) {
  if (!maintenance) return null;

  return (
    <Modal opened={opened} onClose={onClose} title="Detalle del servicio" centered>
      <Stack gap="xs">
        <Text>
          <strong>Tipo:</strong> {MAINTENANCE_LABELS[maintenance.type]}
        </Text>
        <Text>
          <strong>Fecha:</strong> {dayjs(maintenance.date).format('DD/MM/YYYY')}
        </Text>
        <Text>
          <strong>Kilometraje:</strong> {maintenance.mileage.toLocaleString()} km
        </Text>
        <Text>
          <strong>Costo:</strong> ${maintenance.cost.toLocaleString()}
        </Text>
        <Text>
          <strong>Taller:</strong> {maintenance.provider}
        </Text>
        {maintenance.notes && (
          <Text>
            <strong>Notas:</strong> {maintenance.notes}
          </Text>
        )}
        <Group justify="flex-end" mt="md">
          <Button color="red" variant="light" onClick={() => onDelete(maintenance.id)}>
            Eliminar
          </Button>
          <Button variant="default" onClick={onClose}>
            Cerrar
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
