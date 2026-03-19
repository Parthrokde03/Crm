import { Paper, TextInput, Select, Button, Group, Stack, SimpleGrid, TagsInput, Center, Loader } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/PageHeader';
import { useCrudQuery } from '../../hooks/use-crud-query';
import { contactsApi, companiesApi } from '../../services/api';
import type { Contact } from '../../types';

export function ContactFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { createMutation, updateMutation } = useCrudQuery<Contact>('contacts', contactsApi);

  const { data: existing, isLoading } = useQuery({
    queryKey: ['contacts', id],
    queryFn: () => contactsApi.getById(id!),
    enabled: isEdit,
  });

  const { data: companiesData } = useQuery({
    queryKey: ['companies-select'],
    queryFn: () => companiesApi.list({ pageSize: 100 }),
  });

  const companyOptions = (companiesData?.data ?? []).map((c) => ({ value: c.id, label: c.name }));

  const form = useForm({
    initialValues: {
      firstName: '', lastName: '', email: '', phone: '', jobTitle: '',
      companyId: '', address: '', city: '', state: '', country: '', tags: [] as string[],
    },
    validate: {
      firstName: (v) => (v.trim() ? null : 'Required'),
      lastName: (v) => (v.trim() ? null : 'Required'),
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Invalid email'),
    },
  });

  if (isEdit && existing && form.values.email === '' && existing.email !== '') {
    form.setValues({
      firstName: existing.firstName, lastName: existing.lastName, email: existing.email,
      phone: existing.phone ?? '', jobTitle: existing.jobTitle ?? '', companyId: existing.companyId ?? '',
      address: existing.address ?? '', city: existing.city ?? '', state: existing.state ?? '',
      country: existing.country ?? '', tags: existing.tags ?? [],
    });
  }

  if (isEdit && isLoading) return <Center py="xl"><Loader /></Center>;

  const handleSubmit = form.onSubmit((values) => {
    if (isEdit) {
      updateMutation.mutate({ id: id!, data: values as unknown as Partial<Contact> }, { onSuccess: () => navigate('/contacts') });
    } else {
      createMutation.mutate(values as unknown as Partial<Contact>, { onSuccess: () => navigate('/contacts') });
    }
  });

  return (
    <>
      <PageHeader
        title={isEdit ? 'Edit Contact' : 'New Contact'}
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Contacts', to: '/contacts' }, { label: isEdit ? 'Edit' : 'New' }]}
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
              <TextInput label="Job Title" {...form.getInputProps('jobTitle')} />
              <Select label="Company" data={companyOptions} clearable searchable {...form.getInputProps('companyId')} />
            </SimpleGrid>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput label="City" {...form.getInputProps('city')} />
              <TextInput label="Country" {...form.getInputProps('country')} />
            </SimpleGrid>
            <TagsInput label="Tags" placeholder="Add tag and press Enter" {...form.getInputProps('tags')} />
            <Group justify="flex-end">
              <Button variant="default" onClick={() => navigate('/contacts')}>Cancel</Button>
              <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
                {isEdit ? 'Update Contact' : 'Create Contact'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </>
  );
}
