import { Card, Stack, Text, ThemeIcon } from '@mantine/core';
import type { Icon } from '@tabler/icons-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: Icon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: IconCmp, title, description, action }: EmptyStateProps) {
  return (
    <Card withBorder padding="xl" radius="md">
      <Stack align="center" gap="sm" py="md">
        <ThemeIcon variant="light" color="gray" size={56} radius="xl">
          <IconCmp size={28} />
        </ThemeIcon>
        <Text fw={600} ta="center">
          {title}
        </Text>
        {description && (
          <Text c="dimmed" size="sm" ta="center" maw={360}>
            {description}
          </Text>
        )}
        {action}
      </Stack>
    </Card>
  );
}
