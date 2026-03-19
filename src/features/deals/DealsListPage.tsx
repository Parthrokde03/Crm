import { Button, ActionIcon, Menu, Text } from '@mantine/core';
import { IconPlus, IconDotsVertical, IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { DataTable, type Column } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import { openConfirmDialog } from '../../components/ConfirmDialog';
import { useCrudQuery } from '../../hooks/use-crud-query';
import { useTableParams } from '../../hooks/use-table-params';
import { dealsApi } from '../../services/api';
import { DEAL_STAGE_COLOR } from '../../constants';
import type { Deal } from '../../types';

const columns: Column<Deal>[] = [
  { key: 'title', label: 'Deal', sortable: true },
  { key: 'value', label: 'Value', sortable: true, render: (r) => <Text fw={500}>${r.value.toLocaleString()}</Text> },
  { key: 'stage', label: 'Stage', sortable: true, render: (r) => <StatusBadge status={r.stage} colorMap={DEAL_STAGE_COLOR} /> },
  { key: 'probability', label: 'Probability', render: (r) => `${r.probability}%` },
  { key: 'expectedCloseDate', label: 'Close Date', sortable: true, render: (r) => new Date(r.expectedCloseDate).toLocaleDateString() },
];

export function DealsListPage() {
  const navigate = useNavigate();
  const { params, setPage, setPageSize, setSearch, setSort } = useTableParams();
  const { listQuery, deleteMutation } = useCrudQuery<Deal>('deals', dealsApi, params);

  return (
    <>
      <PageHeader
        title="Deals"
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Deals' }]}
        actions={
          <PermissionGuard module="deals" action="create">
            <Button leftSection={<IconPlus size={16} />} onClick={() => navigate('/deals/new')}>Add Deal</Button>
          </PermissionGuard>
        }
      />
      <DataTable<Deal>
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
              <Menu.Item leftSection={<IconEye size={14} />} onClick={() => navigate(`/deals/${row.id}`)}>View</Menu.Item>
              <PermissionGuard module="deals" action="edit">
                <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => navigate(`/deals/${row.id}/edit`)}>Edit</Menu.Item>
              </PermissionGuard>
              <PermissionGuard module="deals" action="delete">
                <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() =>
                  openConfirmDialog({ title: 'Delete Deal', onConfirm: () => deleteMutation.mutate(row.id) })
                }>Delete</Menu.Item>
              </PermissionGuard>
            </Menu.Dropdown>
          </Menu>
        )}
      />
    </>
  );
}
