import { Paper, TextInput, Select, NumberInput, Button, Group, Stack, SimpleGrid, Center, Loader, Text, Divider } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { useCrudQuery } from '../../hooks/use-crud-query';
import { companiesApi } from '../../services/api';
import type { Company, CompanySize } from '../../types';

const sizeOptions: { value: CompanySize; label: string }[] = [
  { value: 'startup', label: 'Startup' }, { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' }, { value: 'enterprise', label: 'Enterprise' },
];

export function CompanyFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [initialized, setInitialized] = useState(false);
  const { createMutation, updateMutation } = useCrudQuery<Company>('companies', companiesApi);

  const { data: existing, isLoading } = useQuery({
    queryKey: ['companies', id], queryFn: () => companiesApi.getById(id!), enabled: isEdit,
  });

  const form = useForm({
    initialValues: {
      name: '', industry: '', website: '', phone: '', size: 'small' as CompanySize,
      address: '', city: '', state: '', country: '', annualRevenue: 0, employeeCount: 0,
    },
    validate: { name: (v) => (v.trim() ? null : 'Required') },
  });

  useEffect(() => {
    if (isEdit && existing && !initialized) {
      form.setValues({
        name: existing.name, industry: existing.industry ?? '', website: existing.website ?? '',
        phone: existing.phone ?? '', size: existing.size, address: existing.address ?? '',
        city: existing.city ?? '', state: existing.state ?? '', country: existing.country ?? '',
        annualRevenue: existing.annualRevenue ?? 0, employeeCount: existing.employeeCount ?? 0,
      });
      setInitialized(true);
    }
  }, [existing, isEdit, initialized]);

  if (isEdit && isLoading) return <Center py="xl"><Loader /></Center>;

  const handleSubmit = form.onSubmit((values) => {
    if (isEdit) {
      updateMutation.mutate({ id: id!, data: values as unknown as Partial<Company> }, { onSuccess: () => navigate('/companies') });
    } else {
      createMutation.mutate(values as unknown as Partial<Company>, { onSuccess: () => navigate('/companies') });
    }
  });

  return (
    <>
      <PageHeader
        title={isEdit ? 'Edit Company' : 'New Company'}
        subtitle={isEdit ? `Editing ${existing?.name ?? ''}` : 'Create a new company record'}
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Companies', to: '/companies' }, { label: isEdit ? 'Edit' : 'New' }]}
      />
      <Paper withBorder p="xl" radius="md" maw={800}>
        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
            <Text size="xs" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: '0.05em' }}>Company Information</Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput label="Company Name" placeholder="Acme Inc." required {...form.getInputProps('name')} />
              <TextInput label="Industry" placeholder="Technology" {...form.getInputProps('industry')} />
            </SimpleGrid>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput label="Website" placeholder="https://example.com" {...form.getInputProps('website')} />
              <TextInput label="Phone" placeholder="+1 (555) 000-0000" {...form.getInputProps('phone')} />
            </SimpleGrid>
            <Divider />
            <Text size="xs" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: '0.05em' }}>Business Details</Text>
            <SimpleGrid cols={{ base: 1, sm: 3 }}>
              <Select label="Size" data={sizeOptions} allowDeselect={false} {...form.getInputProps('size')} />
              <NumberInput label="Annual Revenue ($)" min={0} {...form.getInputProps('annualRevenue')} />
              <NumberInput label="Employees" min={0} {...form.getInputProps('employeeCount')} />
            </SimpleGrid>
            <Divider />
            <Text size="xs" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: '0.05em' }}>Location</Text>
            <SimpleGrid cols={{ base: 1, sm: 3 }}>
              <TextInput label="City" {...form.getInputProps('city')} />
              <TextInput label="State" {...form.getInputProps('state')} />
              <TextInput label="Country" {...form.getInputProps('country')} />
            </SimpleGrid>
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={() => navigate('/companies')}>Cancel</Button>
              <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
                {isEdit ? 'Update Company' : 'Create Company'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </>
  );
}
