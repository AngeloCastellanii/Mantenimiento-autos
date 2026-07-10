import { Breadcrumbs, Anchor, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: string;
  crumbs: Crumb[];
}

export function PageHeader({ title, crumbs }: PageHeaderProps) {
  return (
    <>
      <Breadcrumbs mb="sm">
        {crumbs.map((crumb) =>
          crumb.to ? (
            <Anchor component={Link} to={crumb.to} key={crumb.label} size="sm">
              {crumb.label}
            </Anchor>
          ) : (
            <span key={crumb.label}>{crumb.label}</span>
          ),
        )}
      </Breadcrumbs>
      <Title order={2} mb="lg">
        {title}
      </Title>
    </>
  );
}
