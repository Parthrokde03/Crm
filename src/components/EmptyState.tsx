import { Stack, Text, ThemeIcon, Button } from '@mantine/core';
import { IconInbox } from '@tabler/icons-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: ReactNode;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({
  title = 'No data found',
  message = 'There are no records to display.',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <Stack align="center" py={60} gap="md">
      <ThemeIcon size={64} radius="xl" variant="light" color="gray">
        {icon || <IconInbox size={32} />}
      </ThemeIcon>
      <Text fw={500} size="lg">{title}</Text>
      <Text c="dimmed" size="sm" ta="center" maw={400}>{message}</Text>
      {action && (
        <Button variant="light" onClick={action.onClick}>{action.label}</Button>
      )}
    </Stack>
  );
}
