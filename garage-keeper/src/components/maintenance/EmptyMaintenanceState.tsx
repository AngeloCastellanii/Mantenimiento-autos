import { Button, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconTool } from '@tabler/icons-react';

interface EmptyMaintenanceStateProps {
  onAdd: () => void;
}

export function EmptyMaintenanceState({ onAdd }: EmptyMaintenanceStateProps) {
  return (
    <Stack align="center" py="xl" gap="sm">
      <ThemeIcon size={48} radius="xl" variant="light" color="gray">
        <IconTool size={24} />
      </ThemeIcon>
      <Text c="dimmed">No hay mantenimientos registrados</Text>
      <Button onClick={onAdd}>Registrar primer servicio</Button>
    </Stack>
  );
}
