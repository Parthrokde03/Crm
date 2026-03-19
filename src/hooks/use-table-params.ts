import { useState, useCallback } from 'react';
import { DEFAULT_PAGE_SIZE } from '../constants';
import type { ListParams } from '../types';

export function useTableParams(defaults?: Partial<ListParams>) {
  const [params, setParams] = useState<ListParams>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    search: '',
    filters: {},
    ...defaults,
  });

  const setPage = useCallback((page: number) => setParams((p) => ({ ...p, page })), []);
  const setPageSize = useCallback((pageSize: number) => setParams((p) => ({ ...p, pageSize, page: 1 })), []);
  const setSearch = useCallback((search: string) => setParams((p) => ({ ...p, search, page: 1 })), []);
  const setSort = useCallback(
    (sortBy: string, sortOrder: 'asc' | 'desc') => setParams((p) => ({ ...p, sortBy, sortOrder })),
    [],
  );
  const setFilter = useCallback(
    (key: string, value: unknown) =>
      setParams((p) => ({ ...p, filters: { ...p.filters, [key]: value }, page: 1 })),
    [],
  );
  const resetFilters = useCallback(() => setParams((p) => ({ ...p, filters: {}, page: 1 })), []);

  return { params, setPage, setPageSize, setSearch, setSort, setFilter, resetFilters };
}
