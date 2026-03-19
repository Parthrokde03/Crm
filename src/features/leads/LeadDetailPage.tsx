import { Paper, Group, Text, Stack, SimpleGrid, Button, Tabs, Timeline } from '@mantine/core';
import { IconEdit, IconPhone, IconMail, IconBuilding } from '@tabler/icons-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { EntityAvatar } from '../../components/EntityAvatar';
import { EmptyState } from '../../components/EmptyState';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import { leadsApi } from '../../services/api';
import { LEAD_STATUS_COLOR } from '../../constants';
import { Center, Loader } from '@mantine/core';

export function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: lead, isLoading } = useQuery({
    queryKey: ['leads', id],
    queryFn: () => leadsApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading) return <Center py="xl"><Loader /></Center>;
  if (!lead) return <EmptyState title="Lead not found" />;

  return (
    <Stack>
      <PageHeader
        title={`${lead.firstName} ${lead.lastName}`}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Leads', to: '/leads' },
          { label: `${lead.firstName} ${lead.lastName}` },
        ]}
        actions={
          <PermissionGuard module="leads" action="edit">
            <Button leftSection={<IconEdit size={16} />} onClick={() => navigate(`/leads/${id}/edit`)}>
              Edit
            </Button>
          </PermissionGuard>
        }
      />

      <SimpleGrid cols={{ base: 1, md: 3 }}>
        <Paper withBorder p="md" radius="md" style={{ gridColumn: 'span 2' }}>
          <Group mb="md">
            <EntityAvatar name={`${lead.firstName} ${lead.lastName}`} size="lg" />
            <div>
              <Text fw={600} size="lg">{lead.firstName} {lead.lastName}</Text>
              <Text c="dimmed" size="sm">{lead.jobTitle} {lead.company ? `at ${lead.company}` : ''}</Text>
            </div>
            <StatusBadge status={lead.status} colorMap={LEAD_STATUS_COLOR} />
          </Group>

          <SimpleGrid cols={2}>
            <Group gap="xs"><IconMail size={16} /><Text size="sm">{lead.email}</Text></Group>
            {lead.phone && <Group gap="xs"><IconPhone size={16} /><Text size="sm">{lead.phone}</Text></Group>}
            {lead.company && <Group gap="xs"><IconBuilding size={16} /><Text size="sm">{lead.company}</Text></Group>}
            <Group gap="xs"><Text size="sm" c="dimmed">Source:</Text><Text size="sm">{lead.source}</Text></Group>
            <Group gap="xs"><Text size="sm" c="dimmed">Score:</Text><Text size="sm" fw={600}>{lead.score}/100</Text></Group>
          </SimpleGrid>
        </Paper>

        <Paper withBorder p="md" radius="md">
          <Text fw={500} mb="sm">Quick Actions</Text>
          <Stack gap="xs">
            <Button variant="light" fullWidth size="xs">Log Call</Button>
            <Button variant="light" fullWidth size="xs">Send Email</Button>
            <Button variant="light" fullWidth size="xs">Create Task</Button>
            <Button variant="light" fullWidth size="xs" color="green">Convert to Contact</Button>
          </Stack>
        </Paper>
      </SimpleGrid>

      <Paper withBorder p="md" radius="md">
        <Tabs defaultValue="activity">
          <Tabs.List>
            <Tabs.Tab value="activity">Activity</Tabs.Tab>
            <Tabs.Tab value="notes">Notes</Tabs.Tab>
            <Tabs.Tab value="tasks">Tasks</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="activity" pt="md">
            <Timeline active={1} bulletSize={24} lineWidth={2}>
              <Timeline.Item title="Lead created">
                <Text c="dimmed" size="sm">Created on {new Date(lead.createdAt).toLocaleDateString()}</Text>
              </Timeline.Item>
              <Timeline.Item title="Status updated">
                <Text c="dimmed" size="sm">Status changed to {lead.status}</Text>
              </Timeline.Item>
            </Timeline>
          </Tabs.Panel>

          <Tabs.Panel value="notes" pt="md">
            <Text c="dimmed" size="sm">{lead.notes || 'No notes yet.'}</Text>
          </Tabs.Panel>

          <Tabs.Panel value="tasks" pt="md">
            <EmptyState title="No tasks" message="No tasks linked to this lead yet." />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Stack>
  );
}
