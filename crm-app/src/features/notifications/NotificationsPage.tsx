import { useState } from 'react';
import { Stack, Paper, Group, Text, Button, Badge, ActionIcon, SegmentedControl, Skeleton } from '@mantine/core';
import { IconCheck, IconChecks, IconTrash, IconBell } from '@tabler/icons-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { PageHeader } from '../../components/PageHeader';
import { EmptyState } from '../../components/EmptyState';
import { notificationsApi } from '../../services/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const TYPE_COLORS: Record<string, string> = {
  info: 'blue', success: 'green', warning: 'yellow', error: 'red',
};

export function NotificationsPage() {
  const [filter, setFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', filter],
    queryFn: () => notificationsApi.list({
      pageSize: 50,
      ...(filter === 'unread' ? { isRead: false } : filter === 'read' ? { isRead: true } : {}),
    }),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllMutation = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      notifications.show({ title: 'Done', message: 'All notifications marked as read', color: 'green' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const items = data?.data || [];
  const unreadCount = data?.unreadCount || 0;

  return (
    <Stack>
      <PageHeader
        title="Notifications"
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Notifications' }]}
        actions={
          <Button
            variant="light"
            size="sm"
            leftSection={<IconChecks size={16} />}
            onClick={() => markAllMutation.mutate()}
            loading={markAllMutation.isPending}
            disabled={unreadCount === 0}
          >
            Mark all read
          </Button>
        }
      />

      <Group>
        <SegmentedControl
          value={filter}
          onChange={setFilter}
          data={[
            { label: `All (${data?.meta?.total || 0})`, value: 'all' },
            { label: `Unread (${unreadCount})`, value: 'unread' },
            { label: 'Read', value: 'read' },
          ]}
        />
      </Group>

      {isLoading ? (
        <Stack>{[1,2,3].map(i => <Skeleton key={i} height={80} radius="md" />)}</Stack>
      ) : items.length === 0 ? (
        <EmptyState
          title="No notifications"
          description={filter === 'unread' ? "You're all caught up." : 'No notifications yet.'}
          icon={<IconBell size={48} />}
        />
      ) : (
        <Stack gap="xs">
          {items.map((n: any) => (
            <Paper key={n.id} withBorder p="md" radius="md" style={{ opacity: n.isRead ? 0.7 : 1 }}>
              <Group justify="space-between" wrap="nowrap">
                <Stack gap={4} style={{ flex: 1 }}>
                  <Group gap="xs">
                    <Badge size="sm" color={TYPE_COLORS[n.type] || 'gray'} variant="light">{n.type}</Badge>
                    <Text fw={n.isRead ? 400 : 600} size="sm">{n.title}</Text>
                  </Group>
                  <Text size="sm" c="dimmed">{n.message}</Text>
                  <Text size="xs" c="dimmed">{dayjs(n.createdAt).fromNow()}</Text>
                </Stack>
                <Group gap="xs" wrap="nowrap">
                  {!n.isRead && (
                    <ActionIcon variant="light" color="blue" size="sm" onClick={() => markReadMutation.mutate(n.id)} title="Mark as read">
                      <IconCheck size={14} />
                    </ActionIcon>
                  )}
                  <ActionIcon variant="light" color="red" size="sm" onClick={() => deleteMutation.mutate(n.id)} title="Delete">
                    <IconTrash size={14} />
                  </ActionIcon>
                </Group>
              </Group>
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
