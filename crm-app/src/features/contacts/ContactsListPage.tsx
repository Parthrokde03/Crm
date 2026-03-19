import { Button, Group, ActionIcon, Menu, Text, Box } from '@mantine/core';
import { IconPlus, IconDotsVertical, IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { DataTable, type Column } from '../../components/DataTable';
import { EntityAvatar } from '../../components/EntityAvatar';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import { openConfirmDialog } from '../../components/ConfirmDialog';
import { useCrudQuery } from '../../hooks/use-crud-query';
import { useTableParams } from '../../hooks/use-table-params';
import { contactsApi } from '../../services/api';
import type { Contact } from '../../types';

const columns: Column<Contact>[] = [
  {
    key: 'firstName', label: 'Contact', sortable: true,
    render: (r) => (
      <Group gap="sm">
        <EntityAvatar name={`${r.firstName} ${r.lastName}`} size="sm" color="cyan" />
        <Box>
          <Text size="sm" fw={500}>{r.firstName} {r.lastName}</Text>
          <Text size="xs" c="dimmed">{r.email}</Text>
        </Box>
      </Group>
    ),
  },
  { key: 'phone', label: 'Phone', render: (r) => r.phone || '—' },
  { key: 'jobTitle', label: 'Job Title', render: (r) => r.jobTitle || '—' },
  { key: 'company', label: 'Company', render: (r) => r.company?.name ?? '—' },
];

export function ContactsListPage() {
  const navigate = useNavigate();
  const { params, setPage, setPageSize, setSearch, setSort } = useTableParams();
  const { listQuery, deleteMutation } = useCrudQuery<Contact>('contacts', contactsApi, params);

  return (
    <>
      <PageHeader
        title="Contacts"
        subtitle={`${listQuery.data?.meta.total ?? 0} total contacts`}
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Contacts' }]}
        actions={
          <PermissionGuard module="contacts" action="create">
            <Button leftSection={<IconPlus size={16} />} onClick={() => navigate('/contacts/new')}>Add Contact</Button>
          </PermissionGuard>
        }
      />
      <DataTable<Contact>
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
        searchPlaceholder="Search contacts..."
        actions={(row) => (
          <Menu shadow="md" width={160} position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="subtle" size="sm" color="gray"><IconDotsVertical size={16} /></ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconEye size={14} />} onClick={() => navigate(`/contacts/${row.id}`)}>View</Menu.Item>
              <PermissionGuard module="contacts" action="edit">
                <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => navigate(`/contacts/${row.id}/edit`)}>Edit</Menu.Item>
              </PermissionGuard>
              <PermissionGuard module="contacts" action="delete">
                <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() =>
                  openConfirmDialog({ title: 'Delete Contact', onConfirm: () => deleteMutation.mutate(row.id) })
                }>Delete</Menu.Item>
              </PermissionGuard>
            </Menu.Dropdown>
          </Menu>
        )}
      />
    </>
  );
}
