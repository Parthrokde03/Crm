import { Button, ActionIcon, Menu } from '@mantine/core';
import { IconPlus, IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { DataTable, type Column } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { EntityAvatar } from '../../components/EntityAvatar';
import { openConfirmDialog } from '../../components/ConfirmDialog';
import { useCrudQuery } from '../../hooks/use-crud-query';
import { useTableParams } from '../../hooks/use-table-params';
import { usersApi } from '../../services/api';
import { ROLE_LABELS } from '../../constants';
import type { User } from '../../types';
import { Group, Text } from '@mantine/core';

const columns: Column<User>[] = [
  {
    key: 'firstName', label: 'User', sortable: true,
    render: (r) => (
      <Group gap="sm">
        <EntityAvatar name={`${r.firstName} ${r.lastName}`} src={r.avatar} size="sm" />
        <div>
          <Text size="sm" fw={500}>{r.firstName} {r.lastName}</Text>
          <Text size="xs" c="dimmed">{r.email}</Text>
        </div>
      </Group>
    ),
  },
  { key: 'role', label: 'Role', render: (r) => ROLE_LABELS[r.role.name] ?? r.role.name },
  { key: 'isActive', label: 'Status', render: (r) => <StatusBadge status={r.isActive ? 'active' : 'inactive'} colorMap={{ active: 'green', inactive: 'gray' }} /> },
  { key: 'lastLoginAt', label: 'Last Login', render: (r) => r.lastLoginAt ? new Date(r.lastLoginAt).toLocaleDateString() : 'Never' },
];

export function UsersListPage() {
  const navigate = useNavigate();
  const { params, setPage, setPageSize, setSearch, setSort } = useTableParams();
  const { listQuery, deleteMutation } = useCrudQuery<User>('users', usersApi, params);

  return (
    <>
      <PageHeader
        title="Users"
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Users' }]}
        actions={
          <Button leftSection={<IconPlus size={16} />} onClick={() => navigate('/users/new')}>Invite User</Button>
        }
      />
      <DataTable<User>
        columns={columns}
        data={listQuery.data?.data ?? []}
        total={listQuery.data?.meta.total ?? 0}
        page={params.page}
        pageSize={params.pageSize}
        sortBy={params.sortBy}
        sortOrder={params.sortOrder}
        isLoading={listQuery.isLoading}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSort={setSort}
        onSearch={setSearch}
        searchValue={params.search}
        actions={(row) => (
          <Menu shadow="md" width={160} position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="subtle" size="sm"><IconDotsVertical size={16} /></ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => navigate(`/users/${row.id}/edit`)}>Edit</Menu.Item>
              <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() =>
                openConfirmDialog({ title: 'Deactivate User', message: 'This will deactivate the user account.', onConfirm: () => deleteMutation.mutate(row.id) })
              }>Deactivate</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      />
    </>
  );
}
