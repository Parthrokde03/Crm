import { Button, ActionIcon, Menu, Text } from '@mantine/core';
import { IconPlus, IconDotsVertical, IconEye } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { DataTable, type Column } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import { useCrudQuery } from '../../hooks/use-crud-query';
import { useTableParams } from '../../hooks/use-table-params';
import { ordersApi } from '../../services/api';
import { ORDER_STATUS_COLOR } from '../../constants';
import type { Order } from '../../types';

const columns: Column<Order>[] = [
  { key: 'orderNumber', label: 'Order #', sortable: true },
  { key: 'status', label: 'Status', sortable: true, render: (r) => <StatusBadge status={r.status} colorMap={ORDER_STATUS_COLOR} /> },
  { key: 'total', label: 'Total', sortable: true, render: (r) => <Text fw={500}>${r.total.toLocaleString()}</Text> },
  { key: 'createdAt', label: 'Date', sortable: true, render: (r) => new Date(r.createdAt).toLocaleDateString() },
];

export function OrdersListPage() {
  const navigate = useNavigate();
  const { params, setPage, setPageSize, setSearch, setSort } = useTableParams();
  const { listQuery } = useCrudQuery<Order>('orders', ordersApi, params);

  return (
    <>
      <PageHeader
        title="Orders"
        subtitle={`${listQuery.data?.meta.total ?? 0} total orders`}
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Orders' }]}
        actions={
          <PermissionGuard module="orders" action="create">
            <Button leftSection={<IconPlus size={16} />} onClick={() => navigate('/orders/new')}>New Order</Button>
          </PermissionGuard>
        }
      />
      <DataTable<Order>
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
              <ActionIcon variant="subtle" size="sm" color="gray"><IconDotsVertical size={16} /></ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconEye size={14} />} onClick={() => navigate(`/orders/${row.id}`)}>View</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      />
    </>
  );
}
