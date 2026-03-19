import { Button, Group, ActionIcon, Menu } from '@mantine/core';
import { IconPlus, IconDotsVertical, IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { DataTable, type Column } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { openConfirmDialog } from '../../components/ConfirmDialog';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import { useCrudQuery } from '../../hooks/use-crud-query';
import { useTableParams } from '../../hooks/use-table-params';
import { leadsApi } from '../../services/api';
import { LEAD_STATUS_COLOR } from '../../constants';
import type { Lead } from '../../types';

const columns: Column<Lead>[] = [
  { key: 'firstName', label: 'Name', sortable: true, render: (r) => `${r.firstName} ${r.lastName}` },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'company', label: 'Company', sortable: true },
  { key: 'source', label: 'Source', sortable: true, render: (r) => r.source.replace(/_/g, ' ') },
  { key: 'status', label: 'Status', sortable: true, render: (r) => <StatusBadge status={r.status} colorMap={LEAD_STATUS_COLOR} /> },
  { key: 'score', label: 'Score', sortable: true },
];

export function LeadsListPage() {
  const navigate = useNavigate();
  const { params, setPage, setPageSize, setSearch, setSort } = useTableParams();
  const { listQuery, deleteMutation } = useCrudQuery<Lead>('leads', leadsApi, params);

  const handleDelete = (id: string) => {
    openConfirmDialog({
      title: 'Delete Lead',
      message: 'Are you sure you want to delete this lead?',
      onConfirm: () => deleteMutation.mutate(id),
    });
  };

  return (
    <>
      <PageHeader
        title="Leads"
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Leads' }]}
        actions={
          <PermissionGuard module="leads" action="create">
            <Button leftSection={<IconPlus size={16} />} onClick={() => navigate('/leads/new')}>
              Add Lead
            </Button>
          </PermissionGuard>
        }
      />

      <DataTable<Lead>
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
        searchPlaceholder="Search leads..."
        actions={(row) => (
          <Group gap={4}>
            <Menu shadow="md" width={160} position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="subtle" size="sm"><IconDotsVertical size={16} /></ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconEye size={14} />} onClick={() => navigate(`/leads/${row.id}`)}>
                  View
                </Menu.Item>
                <PermissionGuard module="leads" action="edit">
                  <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => navigate(`/leads/${row.id}/edit`)}>
                    Edit
                  </Menu.Item>
                </PermissionGuard>
                <PermissionGuard module="leads" action="delete">
                  <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() => handleDelete(row.id)}>
                    Delete
                  </Menu.Item>
                </PermissionGuard>
              </Menu.Dropdown>
            </Menu>
          </Group>
        )}
      />
    </>
  );
}
