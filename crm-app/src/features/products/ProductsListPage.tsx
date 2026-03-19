import { Button, ActionIcon, Menu, Text } from '@mantine/core';
import { IconPlus, IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { DataTable, type Column } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import { openConfirmDialog } from '../../components/ConfirmDialog';
import { useCrudQuery } from '../../hooks/use-crud-query';
import { useTableParams } from '../../hooks/use-table-params';
import { productsApi } from '../../services/api';
import type { Product } from '../../types';

const columns: Column<Product>[] = [
  { key: 'name', label: 'Product', sortable: true },
  { key: 'sku', label: 'SKU' },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'unitPrice', label: 'Price', sortable: true, render: (r) => <Text fw={500}>${r.unitPrice.toFixed(2)}</Text> },
  { key: 'isActive', label: 'Status', render: (r) => <StatusBadge status={r.isActive ? 'active' : 'inactive'} colorMap={{ active: 'green', inactive: 'gray' }} /> },
];

export function ProductsListPage() {
  const navigate = useNavigate();
  const { params, setPage, setPageSize, setSearch, setSort } = useTableParams();
  const { listQuery, deleteMutation } = useCrudQuery<Product>('products', productsApi, params);

  return (
    <>
      <PageHeader
        title="Products"
        subtitle={`${listQuery.data?.meta.total ?? 0} total products`}
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Products' }]}
        actions={
          <PermissionGuard module="products" action="create">
            <Button leftSection={<IconPlus size={16} />} onClick={() => navigate('/products/new')}>Add Product</Button>
          </PermissionGuard>
        }
      />
      <DataTable<Product>
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
              <PermissionGuard module="products" action="edit">
                <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => navigate(`/products/${row.id}/edit`)}>Edit</Menu.Item>
              </PermissionGuard>
              <PermissionGuard module="products" action="delete">
                <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() =>
                  openConfirmDialog({ title: 'Delete Product', onConfirm: () => deleteMutation.mutate(row.id) })
                }>Delete</Menu.Item>
              </PermissionGuard>
            </Menu.Dropdown>
          </Menu>
        )}
      />
    </>
  );
}
