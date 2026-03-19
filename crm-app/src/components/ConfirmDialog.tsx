import { Text, Stack, ThemeIcon, Group } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconAlertTriangle } from '@tabler/icons-react';

interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  color?: string;
  onConfirm: () => void;
}

export function openConfirmDialog({
  title = 'Confirm action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  color = 'red',
  onConfirm,
}: ConfirmOptions) {
  modals.openConfirmModal({
    title: (
      <Group gap="sm">
        <ThemeIcon color={color} variant="light" size="md" radius="md">
          <IconAlertTriangle size={16} />
        </ThemeIcon>
        <Text fw={600}>{title}</Text>
      </Group>
    ),
    children: <Text size="sm" c="dimmed">{message}</Text>,
    labels: { confirm: confirmLabel, cancel: cancelLabel },
    confirmProps: { color },
    onConfirm,
    centered: true,
  });
}
