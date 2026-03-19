import { Paper, TextInput, PasswordInput, Select, Switch, Button, Group, Stack, SimpleGrid } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { useCrudQuery } from '../../hooks/use-crud-query';
import { usersApi } from '../../services/api';
import { ROLE_LABELS } from '../../constants';
import type { User, RoleName } from '../../types';

const roleOptions = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }));

export function UserInvitePage() {
  const navigate = useNavigate();
  const { createMutation } = useCrudQuery<User>('users', usersApi);

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      role: 'sales_rep' as RoleName,
      isActive: true,
    },
    validate: {
      firstName: (v) => (v.trim() ? null : 'Required'),
      lastName: (v) => (v.trim() ? null : 'Required'),
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Invalid email'),
      password: (v) => (v.length >= 6 ? null : 'Minimum 6 characters'),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    createMutation.mutate(values as unknown as Partial<User>, {
      onSuccess: () => navigate('/users'),
    });
  });

  return (
    <>
      <PageHeader
        title="Invite User"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Users', to: '/users' },
          { label: 'Invite' },
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
            <PasswordInput label="Password" required description="Minimum 6 characters" {...form.getInputProps('password')} />
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
              <Button type="submit" loading={createMutation.isPending}>Create User</Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </>
  );
}
