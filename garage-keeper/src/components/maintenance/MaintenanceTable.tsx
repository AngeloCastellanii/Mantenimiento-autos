// Tabla de historial con filtro por tipo (ESPECIFICACION §6.4, RF-03).
// MANTENIMIENTOS — owner: Marcial.
import { useMemo, useState } from 'react';
import {
  Badge,
  Card,
  Group,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  MAINTENANCE_LABELS,
  MAINTENANCE_OPTIONS,
} from '../../constants/maintenance';
import { useIsMobile } from '../../hooks/useIsMobile';
import { formatCurrency, formatDate, formatMileage, dayjs } from '../../lib/format';
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
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const filtered = useMemo(() => {
    let rows = filterType
      ? maintenances.filter((m) => m.type === filterType)
      : maintenances;

    if (fromDate) {
      const from = dayjs(fromDate).startOf('day');
      rows = rows.filter((m) => !dayjs(m.date).isBefore(from));
    }
    if (toDate) {
      const to = dayjs(toDate).endOf('day');
      rows = rows.filter((m) => !dayjs(m.date).isAfter(to));
    }

    return [...rows].sort((a, b) => b.date.localeCompare(a.date));
  }, [maintenances, filterType, fromDate, toDate]);

  if (maintenances.length === 0) {
    return <EmptyMaintenanceState onAdd={onAdd} />;
  }

  return (
    <>
      <Stack gap="sm" mb="sm">
        <Text size="sm" c="dimmed">
          {filtered.length} de {maintenances.length} servicios · Toca una fila para ver el detalle
        </Text>
        <Select
          label="Tipo de servicio"
          placeholder="Todos los tipos"
          clearable
          w={isMobile ? '100%' : 240}
          data={MAINTENANCE_OPTIONS}
          value={filterType}
          onChange={setFilterType}
          aria-label="Filtrar por tipo de servicio"
        />
        <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="sm">
          <DatePickerInput
            label="Desde"
            placeholder="Fecha inicial"
            clearable
            valueFormat="DD/MM/YYYY"
            value={fromDate}
            onChange={(value) =>
              setFromDate(value ? dayjs(value).toDate() : null)
            }
          />
          <DatePickerInput
            label="Hasta"
            placeholder="Fecha final"
            clearable
            valueFormat="DD/MM/YYYY"
            value={toDate}
            onChange={(value) => setToDate(value ? dayjs(value).toDate() : null)}
            minDate={fromDate ?? undefined}
          />
        </SimpleGrid>
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
                <Table.Th>PitsTienda</Table.Th>
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
