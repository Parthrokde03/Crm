import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import type { PaginatedResponse, ListParams } from '../types';

interface CrudService<T> {
  list: (params?: ListParams) => Promise<PaginatedResponse<T>>;
  getById: (id: string) => Promise<T>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<unknown>;
}

export function useCrudQuery<T>(key: string, service: CrudService<T>, params?: ListParams) {
  const queryClient = useQueryClient();
  const queryKey = [key, params];

  const listQuery = useQuery({
    queryKey,
    queryFn: () => service.list(params),
  });

  const detailQuery = (id: string) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useQuery({
      queryKey: [key, id],
      queryFn: () => service.getById(id),
      enabled: !!id,
    });

  const createMutation = useMutation({
    mutationFn: (data: Partial<T>) => service.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
      notifications.show({ title: 'Created', message: `${key} created successfully`, color: 'green' });
    },
    onError: () => {
      notifications.show({ title: 'Error', message: `Failed to create ${key}`, color: 'red' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<T> }) => service.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
      notifications.show({ title: 'Updated', message: `${key} updated successfully`, color: 'green' });
    },
    onError: () => {
      notifications.show({ title: 'Error', message: `Failed to update ${key}`, color: 'red' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => service.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
      notifications.show({ title: 'Deleted', message: `${key} deleted successfully`, color: 'green' });
    },
    onError: () => {
      notifications.show({ title: 'Error', message: `Failed to delete ${key}`, color: 'red' });
    },
  });

  return { listQuery, detailQuery, createMutation, updateMutation, deleteMutation };
}
