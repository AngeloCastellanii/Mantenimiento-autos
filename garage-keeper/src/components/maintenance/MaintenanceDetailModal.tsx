// Modal de detalle de un mantenimiento (ESPECIFICACION §8.4).
// MANTENIMIENTOS — owner: Marcial.
import {
  Badge,
  Button,
  Divider,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useResponsiveModalProps } from '../../hooks/useResponsiveModal';
import { MAINTENANCE_LABELS } from '../../constants/maintenance';
import { formatCurrency, formatDate, formatMileage } from '../../lib/format';
import type { Maintenance } from '../../types';
import { TYPE_BADGE_COLOR } from './MaintenanceTable';

interface MaintenanceDetailModalProps {
  maintenance: Maintenance | null;
  opened: boolean;
  onClose: () => void;
  onEdit: (m: Maintenance) => void;
  onDelete: (m: Maintenance) => void;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
        {label}
      </Text>
      <Text>{value}</Text>
    </div>
  );
}

export function MaintenanceDetailModal({
  maintenance,
  opened,
  onClose,
  onEdit,
  onDelete,
}: MaintenanceDetailModalProps) {
  const modalProps = useResponsiveModalProps();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Detalle del mantenimiento"
      {...modalProps}
    >
      {maintenance && (
        <Stack gap="md">
          <Group>
            <Badge
              size="lg"
              variant="light"
              color={TYPE_BADGE_COLOR[maintenance.type]}
            >
              {MAINTENANCE_LABELS[maintenance.type]}
            </Badge>
          </Group>

          <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="md">
            <Field label="Fecha" value={formatDate(maintenance.date)} />
            <Field
              label="Kilometraje"
              value={formatMileage(maintenance.mileage)}
            />
            <Field label="Costo" value={formatCurrency(maintenance.cost)} />
            <Field label="PitsTienda" value={maintenance.provider} />
          </SimpleGrid>

          {maintenance.notes && (
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb={4}>
                Notas
              </Text>
              <Text size="sm">{maintenance.notes}</Text>
            </div>
          )}

          <Divider />

          <Group justify="flex-end" wrap="wrap">
            <Button
              variant="default"
              leftSection={<IconPencil size={16} />}
              onClick={() => onEdit(maintenance)}
            >
              Editar
            </Button>
            <Button
              color="red"
              variant="light"
              leftSection={<IconTrash size={16} />}
              onClick={() => onDelete(maintenance)}
            >
              Eliminar
            </Button>
          </Group>
        </Stack>
      )}
    </Modal>
  );
}
