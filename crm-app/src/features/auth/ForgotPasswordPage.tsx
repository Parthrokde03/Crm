import { Paper, TextInput, Button, Title, Text, Anchor, Stack, Center, Box, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { IconArrowLeft, IconMail } from '@tabler/icons-react';
import { authApi } from '../../services/api';
import { APP_NAME } from '../../constants';

export function ForgotPasswordPage() {
  const form = useForm({
    initialValues: { email: '' },
    validate: { email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Invalid email') },
  });

  const mutation = useMutation({
    mutationFn: (values: { email: string }) => authApi.forgotPassword(values.email),
  });

  return (
    <Center h="100vh" bg="var(--mantine-color-body)">
      <Box w="100%" maw={420} px="md">
        <Group gap="xs" mb="xl">
          <Box style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'var(--mantine-color-indigo-filled)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Text c="white" fw={700} size="sm">C</Text>
          </Box>
          <Text fw={700} size="lg">{APP_NAME}</Text>
        </Group>

        <Title order={2} mb={4}>Forgot password?</Title>
        <Text c="dimmed" size="sm" mb="xl">
          Enter your email and we'll send you instructions to reset your password.
        </Text>

        {mutation.isSuccess ? (
          <Paper withBorder p="lg" radius="md" bg="var(--mantine-color-green-light)">
            <Group gap="sm">
              <IconMail size={20} />
              <Text size="sm" fw={500}>Check your email for a reset link.</Text>
            </Group>
          </Paper>
        ) : (
          <form onSubmit={form.onSubmit((v) => mutation.mutate(v))}>
            <Stack>
              <TextInput label="Email address" placeholder="you@company.com" required size="md" {...form.getInputProps('email')} />
              <Button type="submit" fullWidth size="md" loading={mutation.isPending}>Send reset link</Button>
            </Stack>
          </form>
        )}

        <Anchor component={Link} to="/login" size="sm" mt="lg" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <IconArrowLeft size={14} /> Back to login
        </Anchor>
      </Box>
    </Center>
  );
}
