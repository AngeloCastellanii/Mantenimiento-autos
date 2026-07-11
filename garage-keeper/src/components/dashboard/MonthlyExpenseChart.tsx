import { Card, Group, Stack, Text, Tooltip } from '@mantine/core';
import { useMemo } from 'react';
import { dayjs, formatCurrency } from '../../lib/format';
import type { Maintenance } from '../../types';

interface MonthlyExpenseChartProps {
  maintenances: Maintenance[];
  months?: number;
}

export function MonthlyExpenseChart({
  maintenances,
  months = 6,
}: MonthlyExpenseChartProps) {
  const data = useMemo(() => {
    const totals = new Map<string, number>();
    for (const m of maintenances) {
      const key = dayjs(m.date).format('YYYY-MM');
      totals.set(key, (totals.get(key) ?? 0) + m.cost);
    }
    const now = dayjs();
    const buckets: { key: string; label: string; total: number }[] = [];
    for (let i = months - 1; i >= 0; i--) {
      const d = now.subtract(i, 'month');
      const key = d.format('YYYY-MM');
      buckets.push({
        key,
        label: d.format('MMM').replace('.', ''),
        total: totals.get(key) ?? 0,
      });
    }
    return buckets;
  }, [maintenances, months]);

  const max = Math.max(...data.map((d) => d.total), 1);

  return (
    <Card>
      <Text size="sm" c="dimmed" mb="md">
        Gasto por mes (últimos {months} meses)
      </Text>
      <Group align="flex-end" gap="sm" h={160} wrap="nowrap">
        {data.map((d) => (
          <Stack key={d.key} gap={6} align="center" style={{ flex: 1 }} h="100%" justify="flex-end">
            <Tooltip label={formatCurrency(d.total)} withArrow>
              <div
                style={{
                  width: '100%',
                  maxWidth: 44,
                  height: `${Math.max((d.total / max) * 120, d.total > 0 ? 6 : 2)}px`,
                  borderRadius: 'var(--mantine-radius-sm)',
                  background:
                    d.total > 0
                      ? 'var(--mantine-color-forest-6)'
                      : 'var(--mantine-color-default-border)',
                  transition: 'height 200ms ease',
                }}
              />
            </Tooltip>
            <Text size="xs" c="dimmed" tt="capitalize">
              {d.label}
            </Text>
          </Stack>
        ))}
      </Group>
    </Card>
  );
}
