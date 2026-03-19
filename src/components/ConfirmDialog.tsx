import { Text } from '@mantine/core';
import { modals } from '@mantine/modals';

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
    title,
    children: <Text size="sm">{message}</Text>,
    labels: { confirm: confirmLabel, cancel: cancelLabel },
    confirmProps: { color },
    onConfirm,
  });
}
