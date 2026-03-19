import { Group, Title, Breadcrumbs, Anchor, Text } from '@mantine/core';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
}

export function PageHeader({ title, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      {breadcrumbs && (
        <Breadcrumbs mb="xs">
          {breadcrumbs.map((crumb, i) =>
            crumb.to ? (
              <Anchor component={Link} to={crumb.to} key={i} size="sm">
                {crumb.label}
              </Anchor>
            ) : (
              <Text size="sm" key={i}>{crumb.label}</Text>
            ),
          )}
        </Breadcrumbs>
      )}
      <Group justify="space-between" align="center">
        <Title order={2}>{title}</Title>
        {actions && <Group gap="sm">{actions}</Group>}
      </Group>
    </div>
  );
}
