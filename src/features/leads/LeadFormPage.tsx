import { Paper, TextInput, Select, Textarea, NumberInput, Button, Group, Stack, SimpleGrid } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/PageHeader';
import { useCrudQuery } from '../../hooks/use-crud-query';
import { leadsApi } from '../../services/api';
import type { Lead, LeadSource, LeadStatus } from '../../types';

const sourceOptions: { value: LeadSource; label: string }[] = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'cold_call', label: 'Cold Call' },
  { value: 'social', label: 'Social Media' },
  { value: 'advertisement', label: 'Advertisement' },
  { value: 'other', label: 'Other' },
];

const statusOptions: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'unqualified', label: 'Unqualified' },
];

export function LeadFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { createMutation, updateMutation } = useCrudQuery<Lead>('leads', leadsApi);

  const { data: existing } = useQuery({
    queryKey: ['leads', id],
    queryFn: () => leadsApi.getById(id!),
    enabled: isEdit,
  });

  const form = useForm({
    initialValues: {
      firstName: existing?.firstName ?? '',
      lastName: existing?.lastName ?? '',
      email: existing?.email ?? '',
      phone: existing?.phone ?? '',
      company: existing?.company ?? '',
      jobTitle: existing?.jobTitle ?? '',
      source: existing?.source ?? ('website' as LeadSource),
      status: existing?.status ?? ('new' as LeadStatus),
      score: existing?.score ?? 0,
      notes: existing?.notes ?? '',
    },
    validate: {
      firstName: (v) => (v.trim() ? null : 'First name is required'),
      lastName: (v) => (v.trim() ? null : 'Last name is required'),
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Invalid email'),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    if (isEdit) {
      updateMutation.mutate({ id: id!, data: values }, { onSuccess: () => navigate('/leads') });
    } else {
      createMutation.mutate(values, { onSuccess: () => navigate('/leads') });
    }
  });

  return (
    <>
      <PageHeader
        title={isEdit ? 'Edit Lead' : 'New Lead'}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Leads', to: '/leads' },
          { label: isEdit ? 'Edit' : 'New' },
        ]}
      />

      <Paper withBorder p="lg" radius="md" maw={800}>
        <form onSubmit={handleSubmit}>
          <Stack>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput label="First Name" required {...form.getInputProps('firstName')} />
              <TextInput label="Last Name" required {...form.getInputProps('lastName')} />
            </SimpleGrid>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput label="Email" required {...form.getInputProps('email')} />
              <TextInput label="Phone" {...form.getInputProps('phone')} />
            </SimpleGrid>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput label="Company" {...form.getInputProps('company')} />
              <TextInput label="Job Title" {...form.getInputProps('jobTitle')} />
            </SimpleGrid>
            <SimpleGrid cols={{ base: 1, sm: 3 }}>
              <Select label="Source" data={sourceOptions} {...form.getInputProps('source')} allowDeselect={false} />
              <Select label="Status" data={statusOptions} {...form.getInputProps('status')} allowDeselect={false} />
              <NumberInput label="Score" min={0} max={100} {...form.getInputProps('score')} />
            </SimpleGrid>
            <Textarea label="Notes" rows={4} {...form.getInputProps('notes')} />
            <Group justify="flex-end">
              <Button variant="default" onClick={() => navigate('/leads')}>Cancel</Button>
              <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
                {isEdit ? 'Update Lead' : 'Create Lead'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </>
  );
}
