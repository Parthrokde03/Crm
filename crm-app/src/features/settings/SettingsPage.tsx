import { useState } from 'react';
import { Paper, Tabs, TextInput, Button, Stack, SimpleGrid, PasswordInput, Group, Text, Box, Avatar, Divider } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconUser, IconLock, IconBell } from '@tabler/icons-react';
import { PageHeader } from '../../components/PageHeader';
import { useAuthStore } from '../../store/auth-store';
import { authApi, usersApi } from '../../services/api';

export function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const fullName = user ? `${user.firstName} ${user.lastName}` : '';
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase();

  const profileForm = useForm({
    initialValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
    },
    validate: {
      firstName: (v) => (v.trim() ? null : 'Required'),
      lastName: (v) => (v.trim() ? null : 'Required'),
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Invalid email'),
    },
  });

  const passwordForm = useForm({
    initialValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    validate: {
      currentPassword: (v) => (v.length > 0 ? null : 'Current password is required'),
      newPassword: (v) => (v.length >= 8 ? null : 'Minimum 8 characters'),
      confirmPassword: (v, values) => (v === values.newPassword ? null : 'Passwords do not match'),
    },
  });

  const handleProfileSave = profileForm.onSubmit(async (values) => {
    setProfileSaving(true);
    try {
      if (user) {
        const updated = await usersApi.update(user.id, values);
        setUser({ ...user, ...updated });
      }
      notifications.show({ title: 'Profile updated', message: 'Your profile has been saved.', color: 'green' });
    } catch {
      notifications.show({ title: 'Error', message: 'Failed to update profile.', color: 'red' });
    }
    setProfileSaving(false);
  });

  const handlePasswordChange = passwordForm.onSubmit(async (values) => {
    setPasswordSaving(true);
    try {
      await authApi.changePassword(values.currentPassword, values.newPassword);
      passwordForm.reset();
      notifications.show({ title: 'Password updated', message: 'Your password has been changed successfully.', color: 'green' });
    } catch {
      notifications.show({ title: 'Error', message: 'Failed to change password. Check your current password.', color: 'red' });
    }
    setPasswordSaving(false);
  });

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your account preferences" breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Settings' }]} />

      <Tabs defaultValue="profile" variant="outline">
        <Tabs.List mb="lg">
          <Tabs.Tab value="profile" leftSection={<IconUser size={14} />}>Profile</Tabs.Tab>
          <Tabs.Tab value="password" leftSection={<IconLock size={14} />}>Password</Tabs.Tab>
          <Tabs.Tab value="notifications" leftSection={<IconBell size={14} />}>Notifications</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="profile">
          <Paper withBorder p="xl" radius="md" maw={640}>
            <Group gap="lg" mb="lg" pb="lg" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
              <Avatar size={64} color="indigo" radius="xl">{initials}</Avatar>
              <Box>
                <Text fw={600} size="lg">{fullName}</Text>
                <Text size="sm" c="dimmed">{user?.email}</Text>
              </Box>
            </Group>
            <form onSubmit={handleProfileSave}>
              <Stack gap="md">
                <SimpleGrid cols={2}>
                  <TextInput label="First Name" required {...profileForm.getInputProps('firstName')} />
                  <TextInput label="Last Name" required {...profileForm.getInputProps('lastName')} />
                </SimpleGrid>
                <TextInput label="Email" required {...profileForm.getInputProps('email')} />
                <TextInput label="Phone" placeholder="+1 (555) 000-0000" {...profileForm.getInputProps('phone')} />
                <Group justify="flex-end" mt="sm">
                  <Button type="submit" loading={profileSaving}>Save Changes</Button>
                </Group>
              </Stack>
            </form>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="password">
          <Paper withBorder p="xl" radius="md" maw={640}>
            <Text fw={600} mb="xs">Change Password</Text>
            <Text size="sm" c="dimmed" mb="lg">Ensure your account is using a strong password for security.</Text>
            <form onSubmit={handlePasswordChange}>
              <Stack gap="md">
                <PasswordInput label="Current Password" required {...passwordForm.getInputProps('currentPassword')} />
                <PasswordInput label="New Password" required {...passwordForm.getInputProps('newPassword')} />
                <PasswordInput label="Confirm New Password" required {...passwordForm.getInputProps('confirmPassword')} />
                <Group justify="flex-end" mt="sm">
                  <Button type="submit" loading={passwordSaving}>Update Password</Button>
                </Group>
              </Stack>
            </form>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="notifications">
          <Paper withBorder p="xl" radius="md" maw={640}>
            <Text fw={600} mb="xs">Notification Preferences</Text>
            <Text c="dimmed" size="sm">Notification preferences coming soon.</Text>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
