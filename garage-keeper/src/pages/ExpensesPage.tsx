import { useMemo, useState } from 'react';
import {
  Badge,
  Card,
  Group,
  MultiSelect,
  Progress,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Table,
  Text,
  ThemeIcon,
} from '@mantine/core';
import {
  IconCarSuv,
  IconChartBar,
  IconTools,
  IconWallet,
} from '@tabler/icons-react';
import { PageHeader } from '../components/layout/PageHeader';
import { SectionBlock } from '../components/layout/SectionBlock';
import { useGarage } from '../context/GarageContext';
import { useServiceTypes } from '../hooks/useServiceTypes';
import { filterMaintenances, sumBy } from '../services/selectors';
import { formatCurrency } from '../lib/format';

type GroupBy = 'total' | 'vehicle' | 'type';

export function ExpensesPage() {
  const { state } = useGarage();
  const { options: typeOptions, getLabel, getColor } = useServiceTypes();

  const [vehicleIds, setVehicleIds] = useState<string[]>([]);
  const [typeIds, setTypeIds] = useState<string[]>([]);
  const [groupBy, setGroupBy] = useState<GroupBy>('vehicle');

  const vehicleOptions = state.vehicles.map((v) => ({
    value: v.id,
    label: v.alias,
  }));

  const filtered = useMemo(
    () => filterMaintenances(state.maintenances, { vehicleIds, typeIds }),
    [state.maintenances, vehicleIds, typeIds],
  );

  const total = filtered.reduce((sum, m) => sum + m.cost, 0);
  const average = filtered.length > 0 ? total / filtered.length : 0;
  const vehiclesInScope =
    vehicleIds.length > 0 ? vehicleIds.length : state.vehicles.length;

  const rows = useMemo(() => {
    if (groupBy === 'total') {
      return [{ key: 'total', total, count: filtered.length }];
    }
    return sumBy(filtered, groupBy === 'vehicle' ? 'vehicleId' : 'type');
  }, [groupBy, filtered, total]);

  const rowLabel = (key: string) => {
    if (groupBy === 'total') return 'Total general';
    if (groupBy === 'vehicle')
      return state.vehicles.find((v) => v.id === key)?.alias ?? key;
    return getLabel(key);
  };

  const stats = [
    {
      label: 'Gasto total',
      value: formatCurrency(total),
      icon: IconWallet,
      color: 'forest',
    },
    {
      label: 'Servicios',
      value: String(filtered.length),
      icon: IconTools,
      color: 'violet',
    },
    {
      label: 'Promedio',
      value: formatCurrency(average),
      icon: IconChartBar,
      color: 'teal',
    },
    {
      label: 'Vehículos',
      value: String(vehiclesInScope),
      icon: IconCarSuv,
      color: 'blue',
    },
  ];

  return (
    <>
      <PageHeader
        title="Gastos"
        subtitle="Filtra el gasto por vehículo, tipo de servicio o el total general."
        crumbs={[{ label: 'Inicio', to: '/' }, { label: 'Gastos' }]}
      />

      <Card mb="lg">
        <Stack gap="sm">
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
            <MultiSelect
              label="Vehículos"
              placeholder={vehicleIds.length ? undefined : 'Todos los vehículos'}
              data={vehicleOptions}
              value={vehicleIds}
              onChange={setVehicleIds}
              clearable
              searchable
            />
            <MultiSelect
              label="Tipos de servicio"
              placeholder={typeIds.length ? undefined : 'Todos los tipos'}
              data={typeOptions}
              value={typeIds}
              onChange={setTypeIds}
              clearable
              searchable
            />
          </SimpleGrid>
          <div>
            <Text size="sm" fw={500} mb={4}>
              Agrupar por
            </Text>
            <SegmentedControl
              fullWidth
              value={groupBy}
              onChange={(v) => setGroupBy(v as GroupBy)}
              data={[
                { label: 'Vehículo', value: 'vehicle' },
                { label: 'Servicio', value: 'type' },
                { label: 'Total', value: 'total' },
              ]}
            />
          </div>
        </Stack>
      </Card>

      <SimpleGrid cols={{ base: 2, lg: 4 }} mb="xl" spacing="md">
        {stats.map((s) => (
          <Card key={s.label} padding="lg">
            <Group wrap="nowrap" align="flex-start">
              <ThemeIcon size={40} radius="md" variant="light" color={s.color}>
                <s.icon size={20} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  {s.label}
                </Text>
                <Text fw={800} size="lg" lh={1.2}>
                  {s.value}
                </Text>
              </div>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      <SectionBlock
        title="Desglose de gastos"
        description="Distribución del gasto según el filtro seleccionado."
        mb={0}
      >
        {filtered.length === 0 ? (
          <Card padding="xl">
            <Text c="dimmed" ta="center">
              No hay servicios que coincidan con el filtro.
            </Text>
          </Card>
        ) : (
          <Card padding={0}>
            <Table.ScrollContainer minWidth={480}>
              <Table verticalSpacing="sm" horizontalSpacing="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>{groupBy === 'type' ? 'Servicio' : 'Vehículo'}</Table.Th>
                    <Table.Th ta="right">Servicios</Table.Th>
                    <Table.Th ta="right">Gasto</Table.Th>
                    <Table.Th w={140}>% del total</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rows.map((r) => {
                    const pct = total > 0 ? (r.total / total) * 100 : 0;
                    return (
                      <Table.Tr key={r.key}>
                        <Table.Td>
                          {groupBy === 'type' ? (
                            <Badge variant="light" color={getColor(r.key)}>
                              {rowLabel(r.key)}
                            </Badge>
                          ) : (
                            <Text fw={500}>{rowLabel(r.key)}</Text>
                          )}
                        </Table.Td>
                        <Table.Td ta="right">{r.count}</Table.Td>
                        <Table.Td ta="right" fw={600}>
                          {formatCurrency(r.total)}
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs" wrap="nowrap">
                            <Progress
                              value={pct}
                              color="forest"
                              size="sm"
                              style={{ flex: 1 }}
                            />
                            <Text size="xs" c="dimmed" w={38} ta="right">
                              {pct.toFixed(0)}%
                            </Text>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Card>
        )}
      </SectionBlock>
    </>
  );
}
