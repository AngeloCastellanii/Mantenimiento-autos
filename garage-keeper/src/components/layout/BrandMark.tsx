import { Group, Text, ThemeIcon, Title } from '@mantine/core';
import { IconCar } from '@tabler/icons-react';
import { APP_NAME, APP_TAGLINE } from '../../constants/brand';

interface BrandMarkProps {
  compact?: boolean;
}

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <Group gap="sm" wrap="nowrap" mb={compact ? 0 : 'lg'}>
      <ThemeIcon size={compact ? 36 : 42} radius="md" variant="gradient" gradient={{ from: 'indigo.6', to: 'blue.4' }}>
        <IconCar size={compact ? 20 : 24} />
      </ThemeIcon>
      <div style={{ minWidth: 0 }}>
        <Title order={compact ? 5 : 4} lineClamp={1}>
          {APP_NAME}
        </Title>
        <Text size="xs" c="dimmed" lineClamp={1}>
          {APP_TAGLINE}
        </Text>
      </div>
    </Group>
  );
}
