import {
  TextInput, PasswordInput, Button, Title, Text, Anchor, Stack,
  Box, Group, Checkbox, Paper, ThemeIcon, rem,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import {
  IconUsers, IconChartBar, IconShieldCheck, IconBolt,
} from '@tabler/icons-react';
import { authApi } from '../../services/api';
import { useAuthStore } from '../../store/auth-store';
import { APP_NAME } from '../../constants';

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const form = useForm({
    initialValues: { email: '', password: '', remember: false },
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

const features = [
  { icon: IconUsers, title: 'Contact Management', desc: 'Organize and track every customer interaction in one place.' },
  { icon: IconChartBar, title: 'Sales Analytics', desc: 'Real-time dashboards and reports to drive smarter decisions.' },
  { icon: IconShieldCheck, title: 'Role-Based Access', desc: 'Enterprise-grade security with granular permission controls.' },
  { icon: IconBolt, title: 'Workflow Automation', desc: 'Automate repetitive tasks and focus on closing deals.' },
];

function LeftPanel() {
  return (
    <Box
      visibleFrom="md"
      style={{
        width: '48%',
        background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '64px 56px', position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Decorative elements */}
      <Box style={{ position: 'absolute', top: -100, right: -100, width: 350, height: 350, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
      <Box style={{ position: 'absolute', bottom: -150, left: -80, width: 450, height: 450, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
      <Box style={{ position: 'absolute', top: '40%', right: '10%', width: 180, height: 180, borderRadius: '50%', background: 'rgba(99,102,241,0.15)' }} />

      <Box style={{ position: 'relative', zIndex: 1, maxWidth: 460 }}>
        <Group gap="sm" mb={48}>
          <Box style={{
            width: 44, height: 44, borderRadius: 10,
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <Text c="white" fw={800} size="lg">C</Text>
          </Box>
          <Text c="white" fw={700} size="xl" style={{ letterSpacing: '-0.02em' }}>{APP_NAME}</Text>
        </Group>

        <Title order={1} c="white" mb="sm" style={{ fontSize: 40, lineHeight: 1.15, letterSpacing: '-0.03em', fontWeight: 800 }}>
          Everything you need to grow your business
        </Title>
        <Text c="rgba(255,255,255,0.65)" size="lg" lh={1.7} mb={44}>
          A modern CRM platform that helps teams manage leads, close deals, and build lasting customer relationships.
        </Text>

        <Stack gap="lg">
          {features.map((f) => (
            <Group key={f.title} gap="md" align="flex-start" wrap="nowrap">
              <ThemeIcon
                size={42} radius="md" variant="light"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}
              >
                <f.icon size={20} color="white" />
              </ThemeIcon>
              <Box>
                <Text c="white" fw={600} size="sm" mb={2}>{f.title}</Text>
                <Text c="rgba(255,255,255,0.55)" size="xs" lh={1.5}>{f.desc}</Text>
              </Box>
            </Group>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

function RightPanel({ form, mutation, errorMessage }: { form: any; mutation: any; errorMessage: string | null }) {
  return (
    <Box style={{
      flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
      alignItems: 'center', padding: '48px 24px',
      background: '#fafafa',
    }}>
      <Box w="100%" maw={400}>
        {/* Mobile logo */}
        <Group gap="xs" mb="xl" hiddenFrom="md">
          <Box style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'var(--mantine-color-indigo-filled)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Text c="white" fw={700} size="sm">C</Text>
          </Box>
          <Text fw={700} size="lg">{APP_NAME}</Text>
        </Group>

        <Box mb={32}>
          <Title order={2} mb={6} style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>
            Sign in
          </Title>
          <Text c="dimmed" size="sm">
            Enter your credentials to access your account
          </Text>
        </Box>

        <Paper withBorder p="xl" radius="md" bg="white" shadow="xs">
          <form onSubmit={form.onSubmit((v: any) => mutation.mutate(v))}>
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="you@company.com"
                required
                size="md"
                radius="md"
                styles={{ label: { fontWeight: 500, marginBottom: 4 } }}
                {...form.getInputProps('email')}
              />
              <Box>
                <Group justify="space-between" mb={4}>
                  <Text component="label" size="sm" fw={500}>Password <Text component="span" c="red" inherit>*</Text></Text>
                  <Anchor component={Link} to="/forgot-password" size="xs" c="indigo">
                    Forgot password?
                  </Anchor>
                </Group>
                <PasswordInput
                  placeholder="••••••••"
                  required
                  size="md"
                  radius="md"
                  {...form.getInputProps('password')}
                />
              </Box>

              {errorMessage && (
                <Box style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: rem(8), padding: '10px 14px' }}>
                  <Text c="red.7" size="sm">{errorMessage}</Text>
                </Box>
              )}

              <Checkbox
                label="Keep me signed in"
                size="sm"
                color="indigo"
                {...form.getInputProps('remember', { type: 'checkbox' })}
              />

              <Button
                type="submit"
                fullWidth
                size="md"
                radius="md"
                loading={mutation.isPending}
                style={{
                  background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',
                  fontWeight: 600,
                  height: 46,
                }}
              >
                Sign in
              </Button>
            </Stack>
          </form>
        </Paper>

        <Text c="dimmed" size="xs" ta="center" mt="xl">
          By signing in, you agree to our{' '}
          <Anchor size="xs" c="indigo">Terms of Service</Anchor>
          {' '}and{' '}
          <Anchor size="xs" c="indigo">Privacy Policy</Anchor>
        </Text>
      </Box>
    </Box>
  );
}
