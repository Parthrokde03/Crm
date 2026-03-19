import { Button, ActionIcon, Menu } from '@mantine/core';
import { IconPlus, IconDotsVertical, IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { DataTable, type Column } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import { openConfirmDialog } from '../../components/ConfirmDialog';
import { useCrudQuery } from '../../hooks/use-crud-query';
import { useTableParams } from '../../hooks/use-table-params';
import { ticketsApi } from '../../services/api';
import { TICKET_STATUS_COLOR, TICKET_PRIORITY_COLOR } from '../../constants';
import type { Ticket } from '../../types';

const columns: Column<Ticket>[] = [
  { key: 'subject', label: 'Subject', sortable: true },
  { key: 'priority', label: 'Priority', sortable: true, render: (r) => <StatusBadge status={r.priority} colorMap={TICKET_PRIORITY_COLOR} /> },
  { key: 'status', label: 'Status', sortable: true, render: (r) => <StatusBadge status={r.status} colorMap={TICKET_STATUS_COLOR} /> },
  { key: 'category', label: 'Category' },
  { key: 'createdAt', label: 'Created', sortable: true, render: (r) => new Date(r.createdAt).toLocaleDateString() },
];

export function TicketsListPage() {
  const navigate = useNavigate();
  const { params, setPage, setPageSize, setSearch, setSort } = useTableParams();
  const { listQuery, deleteMutation } = useCrudQuery<Ticket>('tickets', ticketsApi, params);

  return (
    <>
      <PageHeader
        title="Support Tickets"
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Tickets' }]}
        actions={
          <PermissionGuard module="tickets" action="create">
            <Button leftSection={<IconPlus size={16} />} onClick={() => navigate('/tickets/new')}>New Ticket</Button>
          </PermissionGuard>
        }
      />
      <DataTable<Ticket>
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
              <Menu.Item leftSection={<IconEye size={14} />} onClick={() => navigate(`/tickets/${row.id}`)}>View</Menu.Item>
              <PermissionGuard module="tickets" action="edit">
                <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => navigate(`/tickets/${row.id}/edit`)}>Edit</Menu.Item>
              </PermissionGuard>
              <PermissionGuard module="tickets" action="delete">
                <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() =>
                  openConfirmDialog({ title: 'Delete Ticket', onConfirm: () => deleteMutation.mutate(row.id) })
                }>Delete</Menu.Item>
              </PermissionGuard>
            </Menu.Dropdown>
          </Menu>
        )}
      />
    </>
  );
}
