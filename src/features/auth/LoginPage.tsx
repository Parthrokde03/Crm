import { Paper, TextInput, PasswordInput, Button, Title, Text, Anchor, Stack, Center, Alert, Code } from '@mantine/core';
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
      : 'Invalid email or password. Use any registered user email.'
    : null;

  return (
    <Center h="100vh" bg="var(--mantine-color-body)">
      <Paper radius="md" p="xl" withBorder w={440}>
        <Title order={2} ta="center" mb="md">{APP_NAME}</Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">Sign in to your account</Text>

        <form onSubmit={form.onSubmit((v) => mutation.mutate(v))}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="you@company.com"
              required
              {...form.getInputProps('email')}
            />
            <PasswordInput
              label="Password"
              placeholder="Any password works (mock)"
              required
              {...form.getInputProps('password')}
            />
            {errorMessage && <Text c="red" size="sm">{errorMessage}</Text>}
            <Button type="submit" fullWidth loading={mutation.isPending}>
              Sign in
            </Button>
          </Stack>
        </form>

        <Text c="dimmed" size="sm" ta="center" mt="md">
          <Anchor component={Link} to="/forgot-password" size="sm">Forgot password?</Anchor>
        </Text>

        <Alert icon={<IconInfoCircle size={16} />} title="Demo Accounts" mt="lg" variant="light" color="blue">
          <Stack gap={4}>
            <Text size="xs"><Code>admin@crmapp.com</Code> — Administrator</Text>
            <Text size="xs"><Code>jane.smith@crmapp.com</Code> — Sales Manager</Text>
            <Text size="xs"><Code>bob.jones@crmapp.com</Code> — Sales Rep</Text>
            <Text size="xs"><Code>carol.white@crmapp.com</Code> — Support Agent</Text>
            <Text size="xs">Any password works in demo mode</Text>
          </Stack>
        </Alert>
      </Paper>
    </Center>
  );
}
