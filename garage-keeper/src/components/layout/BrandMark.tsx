import { Text, Title } from '@mantine/core';
import { APP_NAME, APP_TAGLINE } from '../../constants/brand';

interface BrandMarkProps {
  compact?: boolean;
}

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <div style={{ minWidth: 0, marginBottom: compact ? 0 : 'var(--mantine-spacing-lg)' }}>
      <Title order={compact ? 5 : 4} lineClamp={1}>
        {APP_NAME}
      </Title>
      <Text size="xs" c="dimmed" lineClamp={1}>
        {APP_TAGLINE}
      </Text>
    </div>
  );
}
