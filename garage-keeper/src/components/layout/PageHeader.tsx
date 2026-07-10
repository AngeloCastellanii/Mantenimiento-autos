import { Breadcrumbs, Anchor, Group, Text, Title } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, crumbs, action }: PageHeaderProps) {
  return (
    <>
      {crumbs && crumbs.length > 0 && (
        <Breadcrumbs
          mb="sm"
          separator={<IconChevronRight size={14} />}
          styles={{ breadcrumb: { lineHeight: 1.4 } }}
        >
          {crumbs.map((crumb) =>
            crumb.to ? (
              <Anchor component={Link} to={crumb.to} key={crumb.label} size="sm">
                {crumb.label}
              </Anchor>
            ) : (
              <span key={crumb.label} style={{ fontSize: 'var(--mantine-font-size-sm)' }}>
                {crumb.label}
              </span>
            ),
          )}
        </Breadcrumbs>
      )}
      <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm" mb="lg">
        <div style={{ flex: 1, minWidth: 0 }}>
          <Title order={2} style={{ wordBreak: 'break-word' }}>
            {title}
          </Title>
          {subtitle && (
            <Text c="dimmed" size="sm" mt={6}>
              {subtitle}
            </Text>
          )}
        </div>
        {action}
      </Group>
    </>
  );
}
