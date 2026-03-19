import { Button, ActionIcon, Menu, Text } from '@mantine/core';
import { IconPlus, IconDotsVertical, IconEye } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { DataTable, type Column } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import { useCrudQuery } from '../../hooks/use-crud-query';
import { useTableParams } from '../../hooks/use-table-params';
import { invoicesApi } from '../../services/api';
import { INVOICE_STATUS_COLOR } from '../../constants';
import type { Invoice } from '../../types';

const columns: Column<Invoice>[] = [
  { key: 'invoiceNumber', label: 'Invoice #', sortable: true },
  { key: 'status', label: 'Status', sortable: true, render: (r) => <StatusBadge status={r.status} colorMap={INVOICE_STATUS_COLOR} /> },
  { key: 'total', label: 'Total', sortable: true, render: (r) => <Text fw={500}>${r.total.toLocaleString()}</Text> },
  { key: 'dueDate', label: 'Due Date', sortable: true, render: (r) => new Date(r.dueDate).toLocaleDateString() },
];

export function InvoicesListPage() {
  const navigate = useNavigate();
  const { params, setPage, setPageSize, setSearch, setSort } = useTableParams();
  const { listQuery } = useCrudQuery<Invoice>('invoices', invoicesApi, params);

  return (
    <>
      <PageHeader
        title="Invoices"
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Invoices' }]}
        actions={
          <PermissionGuard module="invoices" action="create">
            <Button leftSection={<IconPlus size={16} />} onClick={() => navigate('/invoices/new')}>New Invoice</Button>
          </PermissionGuard>
        }
      />
      <DataTable<Invoice>
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
              <Menu.Item leftSection={<IconEye size={14} />} onClick={() => navigate(`/invoices/${row.id}`)}>View</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      />
    </>
  );
}
