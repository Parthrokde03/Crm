import { Stack, Text, ThemeIcon, Button, Box } from '@mantine/core';
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
      <Box
        style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'var(--mantine-color-gray-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <ThemeIcon size={40} radius="xl" variant="transparent" color="dimmed">
          {icon || <IconInbox size={32} />}
        </ThemeIcon>
      </Box>
      <Text fw={600} size="lg">{title}</Text>
      <Text c="dimmed" size="sm" ta="center" maw={400}>{message}</Text>
      {action && (
        <Button variant="light" onClick={action.onClick} mt="xs">{action.label}</Button>
      )}
    </Stack>
  );
}
