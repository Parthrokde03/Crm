import { Paper, TextInput, Select, NumberInput, Textarea, Button, Group, Stack, SimpleGrid, Center, Loader } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/PageHeader';
import { useCrudQuery } from '../../hooks/use-crud-query';
import { dealsApi, contactsApi, companiesApi } from '../../services/api';
import type { Deal, DealStage } from '../../types';

const stageOptions: { value: DealStage; label: string }[] = [
  { value: 'prospecting', label: 'Prospecting' }, { value: 'qualification', label: 'Qualification' },
  { value: 'proposal', label: 'Proposal' }, { value: 'negotiation', label: 'Negotiation' },
  { value: 'closed_won', label: 'Closed Won' }, { value: 'closed_lost', label: 'Closed Lost' },
];

export function DealFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { createMutation, updateMutation } = useCrudQuery<Deal>('deals', dealsApi);

  const { data: existing, isLoading } = useQuery({
    queryKey: ['deals', id], queryFn: () => dealsApi.getById(id!), enabled: isEdit,
  });
  const { data: contactsData } = useQuery({ queryKey: ['contacts-select'], queryFn: () => contactsApi.list({ pageSize: 100 }) });
  const { data: companiesData } = useQuery({ queryKey: ['companies-select'], queryFn: () => companiesApi.list({ pageSize: 100 }) });

  const contactOptions = (contactsData?.data ?? []).map((c) => ({ value: c.id, label: `${c.firstName} ${c.lastName}` }));
  const companyOptions = (companiesData?.data ?? []).map((c) => ({ value: c.id, label: c.name }));

  const form = useForm({
    initialValues: {
      title: '', value: 0, currency: 'USD', stage: 'prospecting' as DealStage,
      probability: 10, expectedCloseDate: '', contactId: '', companyId: '', description: '',
    },
    validate: { title: (v) => (v.trim() ? null : 'Required'), value: (v) => (v > 0 ? null : 'Must be greater than 0') },
  });

  if (isEdit && existing && form.values.title === '' && existing.title !== '') {
    form.setValues({
      title: existing.title, value: existing.value, currency: existing.currency,
      stage: existing.stage, probability: existing.probability,
      expectedCloseDate: existing.expectedCloseDate?.split('T')[0] ?? '',
      contactId: existing.contactId ?? '', companyId: existing.companyId ?? '',
      description: existing.description ?? '',
    });
  }

  if (isEdit && isLoading) return <Center py="xl"><Loader /></Center>;

  const handleSubmit = form.onSubmit((values) => {
    if (isEdit) {
      updateMutation.mutate({ id: id!, data: values as unknown as Partial<Deal> }, { onSuccess: () => navigate('/deals') });
    } else {
      createMutation.mutate(values as unknown as Partial<Deal>, { onSuccess: () => navigate('/deals') });
    }
  });

  return (
    <>
      <PageHeader
        title={isEdit ? 'Edit Deal' : 'New Deal'}
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Deals', to: '/deals' }, { label: isEdit ? 'Edit' : 'New' }]}
      />
      <Paper withBorder p="lg" radius="md" maw={800}>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput label="Deal Title" required {...form.getInputProps('title')} />
            <SimpleGrid cols={{ base: 1, sm: 3 }}>
              <NumberInput label="Value ($)" required min={0} {...form.getInputProps('value')} />
              <Select label="Stage" data={stageOptions} allowDeselect={false} {...form.getInputProps('stage')} />
              <NumberInput label="Probability (%)" min={0} max={100} {...form.getInputProps('probability')} />
            </SimpleGrid>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <Select label="Contact" data={contactOptions} clearable searchable {...form.getInputProps('contactId')} />
              <Select label="Company" data={companiesData ? companyOptions : []} clearable searchable {...form.getInputProps('companyId')} />
            </SimpleGrid>
            <TextInput label="Expected Close Date" type="date" {...form.getInputProps('expectedCloseDate')} />
            <Textarea label="Description" rows={3} {...form.getInputProps('description')} />
            <Group justify="flex-end">
              <Button variant="default" onClick={() => navigate('/deals')}>Cancel</Button>
              <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
                {isEdit ? 'Update Deal' : 'Create Deal'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </>
  );
}
