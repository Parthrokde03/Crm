import { Paper, TextInput, Select, Textarea, Button, Group, Stack, SimpleGrid, Center, Loader } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { useCrudQuery } from '../../hooks/use-crud-query';
import { tasksApi } from '../../services/api';
import type { Task, TaskPriority, TaskStatus } from '../../types';

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }, { value: 'urgent', label: 'Urgent' },
];
const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' }, { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' }, { value: 'cancelled', label: 'Cancelled' },
];

export function TaskFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [initialized, setInitialized] = useState(false);
  const { createMutation, updateMutation } = useCrudQuery<Task>('tasks', tasksApi);

  const { data: existing, isLoading } = useQuery({
    queryKey: ['tasks', id], queryFn: () => tasksApi.getById(id!), enabled: isEdit,
  });

  const form = useForm({
    initialValues: {
      title: '', description: '', priority: 'medium' as TaskPriority,
      status: 'todo' as TaskStatus, dueDate: '',
    },
    validate: { title: (v) => (v.trim() ? null : 'Required') },
  });

  useEffect(() => {
    if (isEdit && existing && !initialized) {
      form.setValues({
        title: existing.title, description: existing.description ?? '',
        priority: existing.priority, status: existing.status,
        dueDate: existing.dueDate?.split('T')[0] ?? '',
      });
      setInitialized(true);
    }
  }, [existing, isEdit, initialized]);

  if (isEdit && isLoading) return <Center py="xl"><Loader /></Center>;

  const handleSubmit = form.onSubmit((values) => {
    const payload = { ...values, assignedToId: 'user-1' } as unknown as Partial<Task>;
    if (isEdit) {
      updateMutation.mutate({ id: id!, data: payload }, { onSuccess: () => navigate('/tasks') });
    } else {
      createMutation.mutate(payload, { onSuccess: () => navigate('/tasks') });
    }
  });

  return (
    <>
      <PageHeader
        title={isEdit ? 'Edit Task' : 'New Task'}
        subtitle={isEdit ? `Editing ${existing?.title ?? ''}` : 'Create a new task'}
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Tasks', to: '/tasks' }, { label: isEdit ? 'Edit' : 'New' }]}
      />
      <Paper withBorder p="lg" radius="md" maw={600}>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput label="Title" required {...form.getInputProps('title')} />
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <Select label="Priority" data={priorityOptions} allowDeselect={false} {...form.getInputProps('priority')} />
              <Select label="Status" data={statusOptions} allowDeselect={false} {...form.getInputProps('status')} />
            </SimpleGrid>
            <TextInput label="Due Date" type="date" {...form.getInputProps('dueDate')} />
            <Textarea label="Description" rows={4} {...form.getInputProps('description')} />
            <Group justify="flex-end">
              <Button variant="default" onClick={() => navigate('/tasks')}>Cancel</Button>
              <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
                {isEdit ? 'Update Task' : 'Create Task'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </>
  );
}
