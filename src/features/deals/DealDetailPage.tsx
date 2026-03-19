import { Paper, Group, Text, Stack, SimpleGrid, Button, Center, Loader, Progress } from '@mantine/core';
import { IconEdit, IconCash, IconCalendar } from '@tabler/icons-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/PageHeader';
import { EntityAvatar } from '../../components/EntityAvatar';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import { dealsApi } from '../../services/api';
import { DEAL_STAGE_COLOR } from '../../constants';

export function DealDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: deal, isLoading } = useQuery({
    queryKey: ['deals', id], queryFn: () => dealsApi.getById(id!), enabled: !!id,
  });

  if (isLoading) return <Center py="xl"><Loader /></Center>;
  if (!deal) return <EmptyState title="Deal not found" />;

  return (
    <Stack>
      <PageHeader
        title={deal.title}
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Deals', to: '/deals' }, { label: deal.title }]}
        actions={
          <PermissionGuard module="deals" action="edit">
            <Button leftSection={<IconEdit size={16} />} onClick={() => navigate(`/deals/${id}/edit`)}>Edit</Button>
          </PermissionGuard>
        }
      />
      <SimpleGrid cols={{ base: 1, md: 3 }}>
        <Paper withBorder p="md" radius="md" style={{ gridColumn: 'span 2' }}>
          <Group mb="md">
            <EntityAvatar name={deal.title} size="lg" color="green" />
            <div>
              <Text fw={600} size="lg">{deal.title}</Text>
              <Text c="dimmed" size="sm">{deal.contact ? `${deal.contact.firstName} ${deal.contact.lastName}` : 'No contact'}</Text>
            </div>
            <StatusBadge status={deal.stage} colorMap={DEAL_STAGE_COLOR} />
          </Group>
          <SimpleGrid cols={2}>
            <Group gap="xs"><IconCash size={16} /><Text size="sm" fw={500}>${deal.value.toLocaleString()}</Text></Group>
            <Group gap="xs"><IconCalendar size={16} /><Text size="sm">Close: {new Date(deal.expectedCloseDate).toLocaleDateString()}</Text></Group>
            <Group gap="xs"><Text size="sm" c="dimmed">Probability:</Text><Text size="sm">{deal.probability}%</Text></Group>
            <Group gap="xs"><Text size="sm" c="dimmed">Currency:</Text><Text size="sm">{deal.currency}</Text></Group>
          </SimpleGrid>
          <Text size="sm" mt="md" fw={500}>Win Probability</Text>
          <Progress value={deal.probability} size="lg" radius="md" mt="xs" color={deal.probability >= 70 ? 'green' : deal.probability >= 40 ? 'yellow' : 'red'} />
          {deal.description && <Text size="sm" mt="md" c="dimmed">{deal.description}</Text>}
          {deal.lostReason && <Text size="sm" mt="md" c="red">Lost reason: {deal.lostReason}</Text>}
        </Paper>
        <Paper withBorder p="md" radius="md">
          <Text fw={500} mb="sm">Quick Actions</Text>
          <Stack gap="xs">
            <Button variant="light" fullWidth size="xs">Log Activity</Button>
            <Button variant="light" fullWidth size="xs">Create Task</Button>
            <Button variant="light" fullWidth size="xs">Add Note</Button>
            <Button variant="light" fullWidth size="xs" color="green">Create Order</Button>
          </Stack>
        </Paper>
      </SimpleGrid>
    </Stack>
  );
}
