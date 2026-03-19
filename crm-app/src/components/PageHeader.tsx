import { Group, Title, Breadcrumbs, Anchor, Text, Box } from '@mantine/core';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <Box mb="lg">
      {breadcrumbs && (
        <Breadcrumbs mb={8} separator="›">
          {breadcrumbs.map((crumb, i) =>
            crumb.to ? (
              <Anchor component={Link} to={crumb.to} key={i} size="sm" c="dimmed">
                {crumb.label}
              </Anchor>
            ) : (
              <Text size="sm" key={i} fw={500}>{crumb.label}</Text>
            ),
          )}
        </Breadcrumbs>
      )}
      <Group justify="space-between" align="flex-end">
        <Box>
          <Title order={2} fw={700}>{title}</Title>
          {subtitle && <Text size="sm" c="dimmed" mt={2}>{subtitle}</Text>}
        </Box>
        {actions && <Group gap="sm">{actions}</Group>}
      </Group>
    </Box>
  );
}
