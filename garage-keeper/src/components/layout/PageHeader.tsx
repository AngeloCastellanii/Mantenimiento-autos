import { Breadcrumbs, Anchor, Group, Title } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: string;
  crumbs?: Crumb[];
  action?: ReactNode;
}

export function PageHeader({ title, crumbs, action }: PageHeaderProps) {
  return (
    <>
      {crumbs && crumbs.length > 0 && (
        <Breadcrumbs mb="sm" separator={<IconChevronRight size={14} />}>
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
      <Group justify="space-between" align="center" wrap="nowrap" mb="lg">
        <Title order={2}>{title}</Title>
        {action}
      </Group>
    </>
  );
}
