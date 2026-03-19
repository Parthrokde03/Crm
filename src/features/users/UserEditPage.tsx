import { Paper, TextInput, Select, Switch, Button, Group, Stack, SimpleGrid, Center, Loader } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/PageHeader';
import { useCrudQuery } from '../../hooks/use-crud-query';
import { usersApi } from '../../services/api';
import { ROLE_LABELS } from '../../constants';
import type { User, RoleName } from '../../types';

const roleOptions = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }));

export function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateMutation } = useCrudQuery<User>('users', usersApi);

  const { data: user, isLoading } = useQuery({
    queryKey: ['users', id],
    queryFn: () => usersApi.getById(id!),
    enabled: !!id,
  });

  const form = useForm({
    initialValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      role: (user?.role?.name ?? 'sales_rep') as RoleName,
      isActive: user?.isActive ?? true,
    },
    validate: {
      firstName: (v) => (v.trim() ? null : 'Required'),
      lastName: (v) => (v.trim() ? null : 'Required'),
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Invalid email'),
    },
  });

  // Re-initialize form when user data loads
  if (user && form.values.email === '' && user.email !== '') {
    form.setValues({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone ?? '',
      role: user.role.name,
      isActive: user.isActive,
    });
  }

  if (isLoading) return <Center py="xl"><Loader /></Center>;

  const handleSubmit = form.onSubmit((values) => {
    updateMutation.mutate(
      { id: id!, data: values as unknown as Partial<User> },
      { onSuccess: () => navigate('/users') },
    );
  });

  return (
    <>
      <PageHeader
        title={`Edit User — ${user?.firstName} ${user?.lastName}`}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Users', to: '/users' },
          { label: 'Edit' },
        ]}
      />

      <Paper withBorder p="lg" radius="md" maw={600}>
        <form onSubmit={handleSubmit}>
          <Stack>
            <SimpleGrid cols={2}>
              <TextInput label="First Name" required {...form.getInputProps('firstName')} />
              <TextInput label="Last Name" required {...form.getInputProps('lastName')} />
            </SimpleGrid>
            <TextInput label="Email" required {...form.getInputProps('email')} />
            <TextInput label="Phone" {...form.getInputProps('phone')} />
            <Select
              label="Role"
              data={roleOptions}
              allowDeselect={false}
              {...form.getInputProps('role')}
            />
            <Switch
              label="Active"
              description="Inactive users cannot log in"
              checked={form.values.isActive}
              onChange={(e) => form.setFieldValue('isActive', e.currentTarget.checked)}
            />
            <Group justify="flex-end">
              <Button variant="default" onClick={() => navigate('/users')}>Cancel</Button>
              <Button type="submit" loading={updateMutation.isPending}>Save Changes</Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </>
  );
}
