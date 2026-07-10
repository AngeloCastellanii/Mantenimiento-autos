// Estado vacío del historial (ESPECIFICACION §6.4, RF-03).
// MANTENIMIENTOS — owner: Marcial.
import { Button, Card, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconClipboardList, IconPlus } from '@tabler/icons-react';

interface EmptyMaintenanceStateProps {
  onAdd?: () => void;
  filtered?: boolean;
}

export function EmptyMaintenanceState({
  onAdd,
  filtered = false,
}: EmptyMaintenanceStateProps) {
  return (
    <Card withBorder padding="xl" radius="md">
      <Stack align="center" gap="sm">
        <ThemeIcon variant="light" size={56} radius="xl" color="gray">
          <IconClipboardList size={30} />
        </ThemeIcon>
        <Text fw={600}>
          {filtered ? 'Sin resultados para este filtro' : 'Sin mantenimientos'}
        </Text>
        <Text c="dimmed" size="sm" ta="center">
          {filtered
            ? 'Prueba con otro tipo de servicio o limpia el filtro.'
            : 'Este vehículo aún no tiene servicios registrados.'}
        </Text>
        {!filtered && onAdd && (
          <Button leftSection={<IconPlus size={16} />} onClick={onAdd}>
            Registrar mantenimiento
          </Button>
        )}
      </Stack>
    </Card>
  );
}
