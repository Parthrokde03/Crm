import { Table, Group, Text, Pagination, Select, Checkbox, ActionIcon, TextInput, Loader, Stack } from '@mantine/core';
import { IconSearch, IconArrowUp, IconArrowDown } from '@tabler/icons-react';
import { EmptyState } from './EmptyState';
import { PAGE_SIZE_OPTIONS } from '../constants';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  width?: number | string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  total?: number;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isLoading?: boolean;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onSelect?: (ids: Set<string>) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onSort?: (key: string, order: 'asc' | 'desc') => void;
  onSearch?: (query: string) => void;
  searchValue?: string;
  searchPlaceholder?: string;
  actions?: (row: T) => React.ReactNode;
  getId?: (row: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  total = 0,
  page = 1,
  pageSize = 20,
  sortBy,
  sortOrder,
  isLoading,
  selectable,
  selectedIds,
  onSelect,
  onPageChange,
  onPageSizeChange,
  onSort,
  onSearch,
  searchValue,
  searchPlaceholder = 'Search...',
  actions,
  getId = (row: T) => (row as Record<string, string>).id,
}: DataTableProps<T>) {
  const totalPages = Math.ceil(total / pageSize);
  const allSelected = data.length > 0 && data.every((r) => selectedIds?.has(getId(r)));

  const handleSelectAll = () => {
    if (!onSelect) return;
    if (allSelected) {
      onSelect(new Set());
    } else {
      onSelect(new Set(data.map(getId)));
    }
  };

  const handleSelectRow = (id: string) => {
    if (!onSelect || !selectedIds) return;
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    onSelect(next);
  };

  const handleSort = (key: string) => {
    if (!onSort) return;
    const newOrder = sortBy === key && sortOrder === 'asc' ? 'desc' : 'asc';
    onSort(key, newOrder);
  };

  return (
    <Stack gap="md">
      {onSearch && (
        <TextInput
          placeholder={searchPlaceholder}
          leftSection={<IconSearch size={16} />}
          value={searchValue}
          onChange={(e) => onSearch(e.currentTarget.value)}
          maw={320}
        />
      )}

      <Table.ScrollContainer minWidth={800}>
        <Table striped highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              {selectable && (
                <Table.Th w={40}>
                  <Checkbox checked={allSelected} onChange={handleSelectAll} aria-label="Select all" />
                </Table.Th>
              )}
              {columns.map((col) => (
                <Table.Th
                  key={col.key}
                  w={col.width}
                  style={col.sortable ? { cursor: 'pointer', userSelect: 'none' } : undefined}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <Group gap={4} wrap="nowrap">
                    {col.label}
                    {col.sortable && sortBy === col.key && (
                      <ActionIcon variant="transparent" size="xs">
                        {sortOrder === 'asc' ? <IconArrowUp size={14} /> : <IconArrowDown size={14} />}
                      </ActionIcon>
                    )}
                  </Group>
                </Table.Th>
              ))}
              {actions && <Table.Th w={100}>Actions</Table.Th>}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}>
                  <Group justify="center" py="xl"><Loader size="sm" /></Group>
                </Table.Td>
              </Table.Tr>
            ) : data.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}>
                  <EmptyState />
                </Table.Td>
              </Table.Tr>
            ) : (
              data.map((row) => {
                const id = getId(row);
                return (
                  <Table.Tr key={id}>
                    {selectable && (
                      <Table.Td>
                        <Checkbox
                          checked={selectedIds?.has(id)}
                          onChange={() => handleSelectRow(id)}
                          aria-label={`Select row ${id}`}
                        />
                      </Table.Td>
                    )}
                    {columns.map((col) => (
                      <Table.Td key={col.key}>
                        {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                      </Table.Td>
                    ))}
                    {actions && <Table.Td>{actions(row)}</Table.Td>}
                  </Table.Tr>
                );
              })
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {totalPages > 1 && (
        <Group justify="space-between">
          <Group gap="xs">
            <Text size="sm" c="dimmed">Rows per page:</Text>
            <Select
              size="xs"
              w={70}
              data={PAGE_SIZE_OPTIONS.map(String)}
              value={String(pageSize)}
              onChange={(v) => onPageSizeChange?.(Number(v))}
              allowDeselect={false}
            />
            <Text size="sm" c="dimmed">
              {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
            </Text>
          </Group>
          <Pagination total={totalPages} value={page} onChange={(p) => onPageChange?.(p)} size="sm" />
        </Group>
      )}
    </Stack>
  );
}
