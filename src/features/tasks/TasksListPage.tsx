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
import { tasksApi } from '../../services/api';
import { TASK_STATUS_COLOR, TASK_PRIORITY_COLOR } from '../../constants';
import type { Task } from '../../types';

const columns: Column<Task>[] = [
  { key: 'title', label: 'Task', sortable: true },
  { key: 'priority', label: 'Priority', sortable: true, render: (r) => <StatusBadge status={r.priority} colorMap={TASK_PRIORITY_COLOR} /> },
  { key: 'status', label: 'Status', sortable: true, render: (r) => <StatusBadge status={r.status} colorMap={TASK_STATUS_COLOR} /> },
  { key: 'dueDate', label: 'Due Date', sortable: true, render: (r) => r.dueDate ? new Date(r.dueDate).toLocaleDateString() : '—' },
];

export function TasksListPage() {
  const navigate = useNavigate();
  const { params, setPage, setPageSize, setSearch, setSort } = useTableParams();
  const { listQuery, deleteMutation } = useCrudQuery<Task>('tasks', tasksApi, params);

  return (
    <>
      <PageHeader
        title="Tasks"
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Tasks' }]}
        actions={
          <PermissionGuard module="tasks" action="create">
            <Button leftSection={<IconPlus size={16} />} onClick={() => navigate('/tasks/new')}>Add Task</Button>
          </PermissionGuard>
        }
      />
      <DataTable<Task>
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
              <Menu.Item leftSection={<IconEye size={14} />} onClick={() => navigate(`/tasks/${row.id}`)}>View</Menu.Item>
              <PermissionGuard module="tasks" action="edit">
                <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => navigate(`/tasks/${row.id}/edit`)}>Edit</Menu.Item>
              </PermissionGuard>
              <PermissionGuard module="tasks" action="delete">
                <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() =>
                  openConfirmDialog({ title: 'Delete Task', onConfirm: () => deleteMutation.mutate(row.id) })
                }>Delete</Menu.Item>
              </PermissionGuard>
            </Menu.Dropdown>
          </Menu>
        )}
      />
    </>
  );
}
