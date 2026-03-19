import { Paper, TextInput, Button, Title, Text, Anchor, Stack, Center } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
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
      <Paper radius="md" p="xl" withBorder w={420}>
        <Title order={2} ta="center" mb="md">{APP_NAME}</Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Enter your email and we'll send you a reset link
        </Text>

        {mutation.isSuccess ? (
          <Text ta="center" c="green">Check your email for a reset link.</Text>
        ) : (
          <form onSubmit={form.onSubmit((v) => mutation.mutate(v))}>
            <Stack>
              <TextInput label="Email" placeholder="you@company.com" required {...form.getInputProps('email')} />
              <Button type="submit" fullWidth loading={mutation.isPending}>Send reset link</Button>
            </Stack>
          </form>
        )}

        <Text c="dimmed" size="sm" ta="center" mt="md">
          <Anchor component={Link} to="/login" size="sm">Back to login</Anchor>
        </Text>
      </Paper>
    </Center>
  );
}
