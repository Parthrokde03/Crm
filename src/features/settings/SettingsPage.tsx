import { useState } from 'react';
import { Paper, Tabs, TextInput, Button, Stack, SimpleGrid, PasswordInput, Group, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { PageHeader } from '../../components/PageHeader';
import { useAuthStore } from '../../store/auth-store';

export function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

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
    // Simulate API call
    await new Promise((r) => setTimeout(r, 500));
    if (user) {
      setUser({ ...user, ...values });
    }
    setProfileSaving(false);
    notifications.show({ title: 'Profile updated', message: 'Your profile has been saved.', color: 'green' });
  });

  const handlePasswordChange = passwordForm.onSubmit(async () => {
    setPasswordSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 500));
    setPasswordSaving(false);
    passwordForm.reset();
    notifications.show({ title: 'Password updated', message: 'Your password has been changed successfully.', color: 'green' });
  });

  return (
    <>
      <PageHeader title="Settings" breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Settings' }]} />

      <Tabs defaultValue="profile">
        <Tabs.List>
          <Tabs.Tab value="profile">Profile</Tabs.Tab>
          <Tabs.Tab value="password">Password</Tabs.Tab>
          <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="profile" pt="md">
          <Paper withBorder p="lg" radius="md" maw={600}>
            <form onSubmit={handleProfileSave}>
              <Stack>
                <SimpleGrid cols={2}>
                  <TextInput label="First Name" required {...profileForm.getInputProps('firstName')} />
                  <TextInput label="Last Name" required {...profileForm.getInputProps('lastName')} />
                </SimpleGrid>
                <TextInput label="Email" required {...profileForm.getInputProps('email')} />
                <TextInput label="Phone" {...profileForm.getInputProps('phone')} />
                <Group justify="flex-end">
                  <Button type="submit" loading={profileSaving}>Save Changes</Button>
                </Group>
              </Stack>
            </form>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="password" pt="md">
          <Paper withBorder p="lg" radius="md" maw={600}>
            <form onSubmit={handlePasswordChange}>
              <Stack>
                <PasswordInput label="Current Password" required {...passwordForm.getInputProps('currentPassword')} />
                <PasswordInput label="New Password" required {...passwordForm.getInputProps('newPassword')} />
                <PasswordInput label="Confirm Password" required {...passwordForm.getInputProps('confirmPassword')} />
                <Group justify="flex-end">
                  <Button type="submit" loading={passwordSaving}>Update Password</Button>
                </Group>
              </Stack>
            </form>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="notifications" pt="md">
          <Paper withBorder p="lg" radius="md" maw={600}>
            <Text c="dimmed">Notification preferences coming soon.</Text>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
