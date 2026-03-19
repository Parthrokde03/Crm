import { Button, ActionIcon, Menu } from '@mantine/core';
import { IconPlus, IconDotsVertical, IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { DataTable, type Column } from '../../components/DataTable';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import { openConfirmDialog } from '../../components/ConfirmDialog';
import { useCrudQuery } from '../../hooks/use-crud-query';
import { useTableParams } from '../../hooks/use-table-params';
import { companiesApi } from '../../services/api';
import type { Company } from '../../types';

const columns: Column<Company>[] = [
  { key: 'name', label: 'Company', sortable: true },
  { key: 'industry', label: 'Industry', sortable: true },
  { key: 'size', label: 'Size' },
  { key: 'website', label: 'Website' },
  { key: 'country', label: 'Country' },
];

export function CompaniesListPage() {
  const navigate = useNavigate();
  const { params, setPage, setPageSize, setSearch, setSort } = useTableParams();
  const { listQuery, deleteMutation } = useCrudQuery<Company>('companies', companiesApi, params);

  return (
    <>
      <PageHeader
        title="Companies"
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Companies' }]}
        actions={
          <PermissionGuard module="companies" action="create">
            <Button leftSection={<IconPlus size={16} />} onClick={() => navigate('/companies/new')}>Add Company</Button>
          </PermissionGuard>
        }
      />
      <DataTable<Company>
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
              <Menu.Item leftSection={<IconEye size={14} />} onClick={() => navigate(`/companies/${row.id}`)}>View</Menu.Item>
              <PermissionGuard module="companies" action="edit">
                <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => navigate(`/companies/${row.id}/edit`)}>Edit</Menu.Item>
              </PermissionGuard>
              <PermissionGuard module="companies" action="delete">
                <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() =>
                  openConfirmDialog({ title: 'Delete Company', onConfirm: () => deleteMutation.mutate(row.id) })
                }>Delete</Menu.Item>
              </PermissionGuard>
            </Menu.Dropdown>
          </Menu>
        )}
      />
    </>
  );
}
