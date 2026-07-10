// Tabla de historial con filtro por tipo (ESPECIFICACION §6.4, RF-03).
// MANTENIMIENTOS — owner: Marcial.
import { useMemo, useState } from 'react';
import {
  Badge,
  Card,
  Group,
  Select,
  Stack,
  Table,
  Text,
  UnstyledButton,
} from '@mantine/core';
import {
  MAINTENANCE_LABELS,
  MAINTENANCE_OPTIONS,
} from '../../constants/maintenance';
import { useIsMobile } from '../../hooks/useIsMobile';
import { formatCurrency, formatDate, formatMileage } from '../../lib/format';
import type { Maintenance, MaintenanceType } from '../../types';
import { EmptyMaintenanceState } from './EmptyMaintenanceState';

interface MaintenanceTableProps {
  maintenances: Maintenance[];
  onRowClick: (m: Maintenance) => void;
  onAdd?: () => void;
}

const TYPE_BADGE_COLOR: Record<MaintenanceType, string> = {
  oil_change: 'yellow',
  brakes: 'red',
  tires: 'dark',
  battery: 'grape',
  alignment: 'cyan',
  general_inspection: 'blue',
  other: 'gray',
};

function MaintenanceMobileList({
  items,
  onRowClick,
}: {
  items: Maintenance[];
  onRowClick: (m: Maintenance) => void;
}) {
  return (
    <Stack gap="sm">
      {items.map((m) => (
        <UnstyledButton key={m.id} onClick={() => onRowClick(m)} w="100%">
          <Card withBorder padding="md" radius="md">
            <Group justify="space-between" align="flex-start" wrap="nowrap" mb="xs">
              <Badge variant="light" color={TYPE_BADGE_COLOR[m.type]}>
                {MAINTENANCE_LABELS[m.type]}
              </Badge>
              <Text size="sm" fw={600}>
                {formatCurrency(m.cost)}
              </Text>
            </Group>
            <Text size="sm" c="dimmed">
              {formatDate(m.date)} · {formatMileage(m.mileage)}
            </Text>
            <Text size="sm" mt={4} lineClamp={1}>
              {m.provider}
            </Text>
          </Card>
        </UnstyledButton>
      ))}
    </Stack>
  );
}

export function MaintenanceTable({
  maintenances,
  onRowClick,
  onAdd,
}: MaintenanceTableProps) {
  const isMobile = useIsMobile();
  const [filterType, setFilterType] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const rows = filterType
      ? maintenances.filter((m) => m.type === filterType)
      : maintenances;
    return [...rows].sort((a, b) => b.date.localeCompare(a.date));
  }, [maintenances, filterType]);

  if (maintenances.length === 0) {
    return <EmptyMaintenanceState onAdd={onAdd} />;
  }

  return (
    <>
      <Stack gap="sm" mb="sm">
        <Text size="sm" c="dimmed">
          {filtered.length} de {maintenances.length} servicios
        </Text>
        <Select
          placeholder="Todos los tipos"
          clearable
          w={isMobile ? '100%' : 220}
          data={MAINTENANCE_OPTIONS}
          value={filterType}
          onChange={setFilterType}
          aria-label="Filtrar por tipo de servicio"
        />
      </Stack>

      {filtered.length === 0 ? (
        <EmptyMaintenanceState filtered />
      ) : isMobile ? (
        <MaintenanceMobileList items={filtered} onRowClick={onRowClick} />
      ) : (
        <Table.ScrollContainer minWidth={640}>
          <Table highlightOnHover verticalSpacing="sm" striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Fecha</Table.Th>
                <Table.Th>Tipo</Table.Th>
                <Table.Th ta="right">Km</Table.Th>
                <Table.Th ta="right">Costo</Table.Th>
                <Table.Th>Taller</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filtered.map((m) => (
                <Table.Tr
                  key={m.id}
                  onClick={() => onRowClick(m)}
                  style={{ cursor: 'pointer' }}
                >
                  <Table.Td>{formatDate(m.date)}</Table.Td>
                  <Table.Td>
                    <Badge variant="light" color={TYPE_BADGE_COLOR[m.type]}>
                      {MAINTENANCE_LABELS[m.type]}
                    </Badge>
                  </Table.Td>
                  <Table.Td ta="right">{formatMileage(m.mileage)}</Table.Td>
                  <Table.Td ta="right">{formatCurrency(m.cost)}</Table.Td>
                  <Table.Td>{m.provider}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}
    </>
  );
}

export { TYPE_BADGE_COLOR };
