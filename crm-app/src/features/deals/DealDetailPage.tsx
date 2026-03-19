import { Paper, Group, Text, Stack, SimpleGrid, Button, Center, Loader, Progress, Box, ThemeIcon } from '@mantine/core';
import { IconEdit, IconCash, IconCalendar, IconUser, IconPercentage, IconCoin } from '@tabler/icons-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/PageHeader';
import { EntityAvatar } from '../../components/EntityAvatar';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import { dealsApi } from '../../services/api';
import { DEAL_STAGE_COLOR } from '../../constants';

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <Group gap="sm" py={6}>
      <ThemeIcon variant="light" size="sm" color="gray" radius="md">{icon}</ThemeIcon>
      <Box>
        <Text size="xs" c="dimmed">{label}</Text>
        <Text size="sm" fw={500}>{value}</Text>
      </Box>
    </Group>
  );
}

export function DealDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: deal, isLoading } = useQuery({
    queryKey: ['deals', id], queryFn: () => dealsApi.getById(id!), enabled: !!id,
  });

  if (isLoading) return <Center py="xl"><Loader /></Center>;
  if (!deal) return <EmptyState title="Deal not found" />;

  const contactName = deal.contact ? `${deal.contact.firstName} ${deal.contact.lastName}` : undefined;

  return (
    <Stack>
      <PageHeader
        title={deal.title}
        subtitle={contactName ? `Contact: ${contactName}` : undefined}
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Deals', to: '/deals' }, { label: deal.title }]}
        actions={
          <PermissionGuard module="deals" action="edit">
            <Button leftSection={<IconEdit size={16} />} onClick={() => navigate(`/deals/${id}/edit`)}>Edit Deal</Button>
          </PermissionGuard>
        }
      />
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
        <Paper withBorder p="lg" radius="md" style={{ gridColumn: 'span 2' }}>
          <Group mb="lg" pb="md" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
            <EntityAvatar name={deal.title} size="lg" color="green" />
            <Box flex={1}>
              <Group gap="sm">
                <Text fw={700} size="lg">{deal.title}</Text>
                <StatusBadge status={deal.stage} colorMap={DEAL_STAGE_COLOR} />
              </Group>
              <Text c="dimmed" size="sm">{contactName || 'No contact assigned'}</Text>
            </Box>
            <Text fw={700} size="xl" c="green">${deal.value.toLocaleString()}</Text>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <InfoRow icon={<IconCash size={14} />} label="Value" value={`$${deal.value.toLocaleString()} ${deal.currency}`} />
            <InfoRow icon={<IconCalendar size={14} />} label="Expected Close" value={new Date(deal.expectedCloseDate).toLocaleDateString()} />
            <InfoRow icon={<IconPercentage size={14} />} label="Probability" value={`${deal.probability}%`} />
            <InfoRow icon={<IconCoin size={14} />} label="Currency" value={deal.currency} />
            {contactName && <InfoRow icon={<IconUser size={14} />} label="Contact" value={contactName} />}
          </SimpleGrid>

          <Box mt="lg" pt="md" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb="xs">Win Probability</Text>
            <Progress value={deal.probability} size="lg" radius="md"
              color={deal.probability >= 70 ? 'green' : deal.probability >= 40 ? 'yellow' : 'red'} />
            <Text size="xs" c="dimmed" mt={4}>{deal.probability}% chance of closing</Text>
          </Box>

          {deal.description && (
            <Box mt="lg" pt="md" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb="xs">Description</Text>
              <Text size="sm">{deal.description}</Text>
            </Box>
          )}
          {deal.lostReason && (
            <Box mt="md" p="sm" style={{ background: 'var(--mantine-color-red-light)', borderRadius: 8 }}>
              <Text size="sm" c="red" fw={500}>Lost reason: {deal.lostReason}</Text>
            </Box>
          )}
        </Paper>

        <Stack gap="lg">
          <Paper withBorder p="lg" radius="md">
            <Text fw={600} size="sm" mb="md">Quick Actions</Text>
            <Stack gap="xs">
              <Button variant="light" fullWidth size="xs">Log Activity</Button>
              <Button variant="light" fullWidth size="xs">Create Task</Button>
              <Button variant="light" fullWidth size="xs">Add Note</Button>
              <Button variant="light" fullWidth size="xs" color="green">Create Order</Button>
            </Stack>
          </Paper>
        </Stack>
      </SimpleGrid>
    </Stack>
  );
}
