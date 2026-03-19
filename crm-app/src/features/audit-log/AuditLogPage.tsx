import { useState } from 'react';
import { Stack, Table, Paper, Group, TextInput, Select, Pagination, Badge, Text, Skeleton } from '@mantine/core';
import { IconSearch, IconHistory } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/PageHeader';
import { EmptyState } from '../../components/EmptyState';
import { auditLogsApi } from '../../services/api';
import dayjs from 'dayjs';

const ACTION_COLORS: Record<string, string> = {
  create: 'green', update: 'blue', delete: 'red', login: 'cyan', export: 'grape',
};

const MODULES = [
  { value: '', label: 'All Modules' },
  { value: 'leads', label: 'Leads' },
  { value: 'contacts', label: 'Contacts' },
  { value: 'companies', label: 'Companies' },
  { value: 'deals', label: 'Deals' },
  { value: 'tasks', label: 'Tasks' },
  { value: 'tickets', label: 'Tickets' },
  { value: 'products', label: 'Products' },
  { value: 'orders', label: 'Orders' },
  { value: 'invoices', label: 'Invoices' },
  { value: 'users', label: 'Users' },
  { value: 'settings', label: 'Settings' },
];

export function AuditLogPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', page, search, moduleFilter],
    queryFn: () => auditLogsApi.list({
      page,
      pageSize: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      search: search || undefined,
      filters: moduleFilter ? { module: moduleFilter } : undefined,
    }),
  });

  const logs = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, totalPages: 0 };

  return (
    <Stack>
      <PageHeader title="Audit Log" breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Audit Log' }]} />

      <Paper withBorder p="md" radius="md">
        <Group mb="md">
          <TextInput
            placeholder="Search actions..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => { setSearch(e.currentTarget.value); setPage(1); }}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Filter by module"
            data={MODULES}
            value={moduleFilter}
            onChange={(v) => { setModuleFilter(v || ''); setPage(1); }}
            clearable
            w={200}
          />
        </Group>

        {isLoading ? (
          <Stack>{[1,2,3,4,5].map(i => <Skeleton key={i} height={40} />)}</Stack>
        ) : logs.length === 0 ? (
          <EmptyState
            title="No audit logs"
            description="Actions will appear here as users interact with the system."
            icon={<IconHistory size={48} />}
          />
        ) : (
          <>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Timestamp</Table.Th>
                  <Table.Th>User</Table.Th>
                  <Table.Th>Action</Table.Th>
                  <Table.Th>Module</Table.Th>
                  <Table.Th>Entity ID</Table.Th>
                  <Table.Th>Details</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {logs.map((log: any) => (
                  <Table.Tr key={log.id}>
                    <Table.Td>
                      <Text size="sm">{dayjs(log.createdAt).format('MMM D, YYYY HH:mm')}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{log.user ? `${log.user.firstName} ${log.user.lastName}` : log.userId}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge size="sm" color={ACTION_COLORS[log.action] || 'gray'} variant="light">{log.action}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge size="sm" variant="outline">{log.module}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace' }}>{log.entityId?.slice(0, 8)}...</Text>
                    </Table.Td>
                    <Table.Td>
                      {log.changes ? (
                        <Text size="xs" c="dimmed" lineClamp={1}>{JSON.stringify(log.changes)}</Text>
                      ) : (
                        <Text size="xs" c="dimmed">—</Text>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
            {meta.totalPages > 1 && (
              <Group justify="center" mt="md">
                <Pagination total={meta.totalPages} value={page} onChange={setPage} />
              </Group>
            )}
          </>
        )}
      </Paper>
    </Stack>
  );
}
