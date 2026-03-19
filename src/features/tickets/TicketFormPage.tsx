import { Paper, TextInput, Select, Textarea, Button, Group, Stack, SimpleGrid, Center, Loader } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/PageHeader';
import { useCrudQuery } from '../../hooks/use-crud-query';
import { ticketsApi, contactsApi } from '../../services/api';
import type { Ticket, TicketPriority, TicketStatus } from '../../types';

const priorityOptions: { value: TicketPriority; label: string }[] = [
  { value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }, { value: 'critical', label: 'Critical' },
];
const statusOptions: { value: TicketStatus; label: string }[] = [
  { value: 'open', label: 'Open' }, { value: 'in_progress', label: 'In Progress' },
  { value: 'waiting', label: 'Waiting' }, { value: 'resolved', label: 'Resolved' }, { value: 'closed', label: 'Closed' },
];

export function TicketFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { createMutation, updateMutation } = useCrudQuery<Ticket>('tickets', ticketsApi);

  const { data: existing, isLoading } = useQuery({ queryKey: ['tickets', id], queryFn: () => ticketsApi.getById(id!), enabled: isEdit });
  const { data: contactsData } = useQuery({ queryKey: ['contacts-select'], queryFn: () => contactsApi.list({ pageSize: 100 }) });
  const contactOptions = (contactsData?.data ?? []).map((c) => ({ value: c.id, label: `${c.firstName} ${c.lastName}` }));

  const form = useForm({
    initialValues: { subject: '', description: '', priority: 'medium' as TicketPriority, status: 'open' as TicketStatus, contactId: '', category: '' },
    validate: { subject: (v) => (v.trim() ? null : 'Required'), description: (v) => (v.trim() ? null : 'Required') },
  });

  if (isEdit && existing && form.values.subject === '' && existing.subject !== '') {
    form.setValues({ subject: existing.subject, description: existing.description, priority: existing.priority, status: existing.status, contactId: existing.contactId, category: existing.category ?? '' });
  }
  if (isEdit && isLoading) return <Center py="xl"><Loader /></Center>;

  const handleSubmit = form.onSubmit((values) => {
    if (isEdit) updateMutation.mutate({ id: id!, data: values as unknown as Partial<Ticket> }, { onSuccess: () => navigate('/tickets') });
    else createMutation.mutate(values as unknown as Partial<Ticket>, { onSuccess: () => navigate('/tickets') });
  });

  return (
    <>
      <PageHeader title={isEdit ? 'Edit Ticket' : 'New Ticket'} breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Tickets', to: '/tickets' }, { label: isEdit ? 'Edit' : 'New' }]} />
      <Paper withBorder p="lg" radius="md" maw={700}>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput label="Subject" required {...form.getInputProps('subject')} />
            <SimpleGrid cols={{ base: 1, sm: 3 }}>
              <Select label="Priority" data={priorityOptions} allowDeselect={false} {...form.getInputProps('priority')} />
              <Select label="Status" data={statusOptions} allowDeselect={false} {...form.getInputProps('status')} />
              <TextInput label="Category" {...form.getInputProps('category')} />
            </SimpleGrid>
            <Select label="Contact" data={contactOptions} clearable searchable {...form.getInputProps('contactId')} />
            <Textarea label="Description" required rows={5} {...form.getInputProps('description')} />
            <Group justify="flex-end">
              <Button variant="default" onClick={() => navigate('/tickets')}>Cancel</Button>
              <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>{isEdit ? 'Update Ticket' : 'Create Ticket'}</Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </>
  );
}
