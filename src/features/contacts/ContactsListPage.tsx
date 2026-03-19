import { Button, Group, ActionIcon, Menu } from '@mantine/core';
import { IconPlus, IconDotsVertical, IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { DataTable, type Column } from '../../components/DataTable';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import { openConfirmDialog } from '../../components/ConfirmDialog';
import { useCrudQuery } from '../../hooks/use-crud-query';
import { useTableParams } from '../../hooks/use-table-params';
import { contactsApi } from '../../services/api';
import type { Contact } from '../../types';

const columns: Column<Contact>[] = [
  { key: 'firstName', label: 'Name', sortable: true, render: (r) => `${r.firstName} ${r.lastName}` },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'phone', label: 'Phone' },
  { key: 'jobTitle', label: 'Job Title' },
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
              <ActionIcon variant="subtle" size="sm"><IconDotsVertical size={16} /></ActionIcon>
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
