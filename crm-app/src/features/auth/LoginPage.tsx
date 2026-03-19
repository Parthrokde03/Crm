import {
  TextInput, PasswordInput, Button, Title, Text, Anchor, Stack,
  Box, Alert, Code, Group, Divider,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { IconInfoCircle } from '@tabler/icons-react';
import { authApi } from '../../services/api';
import { useAuthStore } from '../../store/auth-store';
import { APP_NAME } from '../../constants';

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Invalid email'),
      password: (v) => (v.length >= 1 ? null : 'Password is required'),
    },
  });

  const mutation = useMutation({
    mutationFn: (values: { email: string; password: string }) =>
      authApi.login(values.email, values.password),
    onSuccess: (data) => {
      login(data.user, data.tokens);
      navigate('/');
    },
  });

  const errorMessage = mutation.isError
    ? (mutation.error as Error)?.message === 'Account is inactive'
      ? 'This account is inactive. Contact your administrator.'
      : 'Invalid email or password.'
    : null;

  return (
    <Box style={{ display: 'flex', minHeight: '100vh' }}>
      <LeftPanel />
      <RightPanel form={form} mutation={mutation} errorMessage={errorMessage} />
    </Box>
  );
}

function LeftPanel() {
  return (
    <Box
      visibleFrom="md"
      style={{
        width: '45%',
        background: 'linear-gradient(135deg, var(--mantine-color-indigo-7) 0%, var(--mantine-color-indigo-9) 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', padding: 48, position: 'relative', overflow: 'hidden',
      }}
    >
      <Box style={{ position: 'relative', zIndex: 1, maxWidth: 420 }}>
        <Group gap="sm" mb="xl">
          <Box style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Text c="white" fw={700} size="xl">C</Text>
          </Box>
          <Title order={2} c="white">{APP_NAME}</Title>
        </Group>
        <Title order={1} c="white" mb="md" style={{ fontSize: 36, lineHeight: 1.2 }}>
          Manage your customer relationships with confidence
        </Title>
        <Text c="rgba(255,255,255,0.8)" size="lg" lh={1.6}>
          Track leads, close deals, and grow your business with a CRM built for modern teams.
        </Text>
      </Box>
      <Box style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
      <Box style={{ position: 'absolute', bottom: -120, left: -60, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
    </Box>
  );
}

function RightPanel({ form, mutation, errorMessage }: { form: any; mutation: any; errorMessage: string | null }) {
  return (
    <Box style={{
      flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
      alignItems: 'center', padding: '48px 24px', background: 'var(--mantine-color-body)',
    }}>
      <Box w="100%" maw={420}>
        <Group gap="xs" mb="xs" hiddenFrom="md">
          <Box style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'var(--mantine-color-indigo-filled)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Text c="white" fw={700} size="sm">C</Text>
          </Box>
          <Text fw={700} size="lg">{APP_NAME}</Text>
        </Group>

        <Title order={2} mb={4}>Welcome back</Title>
        <Text c="dimmed" size="sm" mb="xl">Sign in to your account to continue</Text>

        <form onSubmit={form.onSubmit((v: any) => mutation.mutate(v))}>
          <Stack gap="md">
            <TextInput label="Email address" placeholder="you@company.com" required size="md" {...form.getInputProps('email')} />
            <PasswordInput label="Password" placeholder="Enter your password" required size="md" {...form.getInputProps('password')} />
            {errorMessage && <Text c="red" size="sm">{errorMessage}</Text>}
            <Button type="submit" fullWidth size="md" loading={mutation.isPending}>Sign in</Button>
          </Stack>
        </form>

        <Text c="dimmed" size="sm" ta="center" mt="md">
          <Anchor component={Link} to="/forgot-password" size="sm">Forgot your password?</Anchor>
        </Text>

        <Divider my="lg" label="Demo accounts" labelPosition="center" />

        <Alert icon={<IconInfoCircle size={16} />} variant="light" color="gray" radius="md">
          <Stack gap={3}>
            <Text size="xs"><Code>admin@crmapp.com</Code> / <Code>admin123</Code></Text>
            <Text size="xs"><Code>sales.mgr@crmapp.com</Code> / <Code>sales123</Code></Text>
            <Text size="xs"><Code>sales@crmapp.com</Code> / <Code>sales123</Code></Text>
            <Text size="xs"><Code>support@crmapp.com</Code> / <Code>support123</Code></Text>
            <Text size="xs"><Code>ops@crmapp.com</Code> / <Code>ops123</Code></Text>
            <Text size="xs"><Code>marketing@crmapp.com</Code> / <Code>mkt123</Code></Text>
            <Text size="xs"><Code>finance@crmapp.com</Code> / <Code>fin123</Code></Text>
          </Stack>
        </Alert>
      </Box>
    </Box>
  );
}
