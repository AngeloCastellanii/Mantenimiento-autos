import { Box, Group, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';

interface SectionBlockProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  mb?: string | number;
}

export function SectionBlock({
  title,
  description,
  action,
  children,
  mb = 'xl',
}: SectionBlockProps) {
  return (
    <Box mb={mb}>
      <Group justify="space-between" align="flex-end" wrap="wrap" gap="sm" mb="md">
        <div>
          <Title order={3}>{title}</Title>
          {description && (
            <Text c="dimmed" size="sm" mt={4}>
              {description}
            </Text>
          )}
        </div>
        {action}
      </Group>
      {children}
    </Box>
  );
}
