import { Badge, Table, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { MAINTENANCE_LABELS } from '../../constants/maintenance';
import type { Maintenance } from '../../types';

interface MaintenanceTableProps {
  items: Maintenance[];
  onSelect: (item: Maintenance) => void;
}

export function MaintenanceTable({ items, onSelect }: MaintenanceTableProps) {
  if (items.length === 0) return null;

  return (
    <Table highlightOnHover striped>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Fecha</Table.Th>
          <Table.Th>Tipo</Table.Th>
          <Table.Th>Km</Table.Th>
          <Table.Th>Costo</Table.Th>
          <Table.Th>Taller</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.map((item) => (
          <Table.Tr
            key={item.id}
            style={{ cursor: 'pointer' }}
            onClick={() => onSelect(item)}
          >
            <Table.Td>
              <Text size="sm">{dayjs(item.date).format('DD/MM/YYYY')}</Text>
            </Table.Td>
            <Table.Td>
              <Badge variant="light">{MAINTENANCE_LABELS[item.type]}</Badge>
            </Table.Td>
            <Table.Td>{item.mileage.toLocaleString()}</Table.Td>
            <Table.Td>${item.cost.toLocaleString()}</Table.Td>
            <Table.Td>{item.provider}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
