import { Paper, TextInput, Select, Textarea, NumberInput, Button, Group, Stack, SimpleGrid, Text, Box, Divider } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
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

function SectionLabel({ label }: { label: string }) {
  return (
    <Text size="xs" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: '0.05em' }}>
      {label}
    </Text>
  );
}

export function LeadFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [initialized, setInitialized] = useState(false);

  const { createMutation, updateMutation } = useCrudQuery<Lead>('leads', leadsApi);

  const { data: existing } = useQuery({
    queryKey: ['leads', id],
    queryFn: () => leadsApi.getById(id!),
    enabled: isEdit,
  });

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      jobTitle: '',
      source: 'website' as LeadSource,
      status: 'new' as LeadStatus,
      score: 0,
      notes: '',
    },
    validate: {
      firstName: (v) => (v.trim() ? null : 'First name is required'),
      lastName: (v) => (v.trim() ? null : 'Last name is required'),
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Invalid email'),
    },
  });

  useEffect(() => {
    if (isEdit && existing && !initialized) {
      form.setValues({
        firstName: existing.firstName, lastName: existing.lastName,
        email: existing.email, phone: existing.phone ?? '',
        company: existing.company ?? '', jobTitle: existing.jobTitle ?? '',
        source: existing.source as LeadSource, status: existing.status as LeadStatus,
        score: existing.score ?? 0, notes: existing.notes ?? '',
      });
      setInitialized(true);
    }
  }, [existing, isEdit, initialized]);

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
        subtitle={isEdit ? `Editing ${existing?.firstName ?? ''} ${existing?.lastName ?? ''}` : 'Create a new lead record'}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Leads', to: '/leads' },
          { label: isEdit ? 'Edit' : 'New' },
        ]}
      />

      <Paper withBorder p="xl" radius="md" maw={800}>
        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
            <SectionLabel label="Personal Information" />
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput label="First Name" placeholder="John" required {...form.getInputProps('firstName')} />
              <TextInput label="Last Name" placeholder="Doe" required {...form.getInputProps('lastName')} />
            </SimpleGrid>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput label="Email" placeholder="john@company.com" required {...form.getInputProps('email')} />
              <TextInput label="Phone" placeholder="+1 (555) 000-0000" {...form.getInputProps('phone')} />
            </SimpleGrid>

            <Divider />
            <SectionLabel label="Company Details" />
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput label="Company" placeholder="Acme Inc." {...form.getInputProps('company')} />
              <TextInput label="Job Title" placeholder="Marketing Director" {...form.getInputProps('jobTitle')} />
            </SimpleGrid>

            <Divider />
            <SectionLabel label="Lead Classification" />
            <SimpleGrid cols={{ base: 1, sm: 3 }}>
              <Select label="Source" data={sourceOptions} {...form.getInputProps('source')} allowDeselect={false} />
              <Select label="Status" data={statusOptions} {...form.getInputProps('status')} allowDeselect={false} />
              <NumberInput label="Score" min={0} max={100} {...form.getInputProps('score')} />
            </SimpleGrid>

            <Divider />
            <SectionLabel label="Additional Information" />
            <Textarea label="Notes" placeholder="Add any relevant notes about this lead..." rows={4} {...form.getInputProps('notes')} />

            <Group justify="flex-end" mt="md">
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
