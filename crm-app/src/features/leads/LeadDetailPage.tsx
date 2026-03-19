import { Paper, Group, Text, Stack, SimpleGrid, Button, Tabs, Timeline, Box, Center, Loader, ThemeIcon } from '@mantine/core';
import { IconEdit, IconPhone, IconMail, IconBuilding, IconCalendar, IconTarget, IconUser } from '@tabler/icons-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { EntityAvatar } from '../../components/EntityAvatar';
import { EmptyState } from '../../components/EmptyState';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import { leadsApi } from '../../services/api';
import { LEAD_STATUS_COLOR } from '../../constants';

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
        subtitle={lead.jobTitle ? `${lead.jobTitle}${lead.company ? ` at ${lead.company}` : ''}` : undefined}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Leads', to: '/leads' },
          { label: `${lead.firstName} ${lead.lastName}` },
        ]}
        actions={
          <PermissionGuard module="leads" action="edit">
            <Button leftSection={<IconEdit size={16} />} onClick={() => navigate(`/leads/${id}/edit`)}>
              Edit Lead
            </Button>
          </PermissionGuard>
        }
      />

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
        {/* Main info card */}
        <Paper withBorder p="lg" radius="md" style={{ gridColumn: 'span 2' }}>
          <Group mb="lg" pb="md" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
            <EntityAvatar name={`${lead.firstName} ${lead.lastName}`} size="lg" color="indigo" />
            <Box flex={1}>
              <Group gap="sm">
                <Text fw={700} size="lg">{lead.firstName} {lead.lastName}</Text>
                <StatusBadge status={lead.status} colorMap={LEAD_STATUS_COLOR} />
              </Group>
              <Text c="dimmed" size="sm">{lead.jobTitle} {lead.company ? `at ${lead.company}` : ''}</Text>
            </Box>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <InfoRow icon={<IconMail size={14} />} label="Email" value={lead.email} />
            <InfoRow icon={<IconPhone size={14} />} label="Phone" value={lead.phone} />
            <InfoRow icon={<IconBuilding size={14} />} label="Company" value={lead.company} />
            <InfoRow icon={<IconTarget size={14} />} label="Source" value={lead.source?.replace(/_/g, ' ')} />
            <InfoRow icon={<IconUser size={14} />} label="Score" value={`${lead.score}/100`} />
            <InfoRow icon={<IconCalendar size={14} />} label="Created" value={new Date(lead.createdAt).toLocaleDateString()} />
          </SimpleGrid>

          {lead.notes && (
            <Box mt="lg" pt="md" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb="xs">Notes</Text>
              <Text size="sm">{lead.notes}</Text>
            </Box>
          )}
        </Paper>

        {/* Sidebar */}
        <Stack gap="lg">
          <Paper withBorder p="lg" radius="md">
            <Text fw={600} size="sm" mb="md">Quick Actions</Text>
            <Stack gap="xs">
              <Button variant="light" fullWidth size="xs">Log Call</Button>
              <Button variant="light" fullWidth size="xs">Send Email</Button>
              <Button variant="light" fullWidth size="xs">Create Task</Button>
              <Button variant="light" fullWidth size="xs" color="green">Convert to Contact</Button>
            </Stack>
          </Paper>

          <Paper withBorder p="lg" radius="md">
            <Text fw={600} size="sm" mb="md">Lead Score</Text>
            <Center>
              <Box style={{
                width: 80, height: 80, borderRadius: '50%',
                border: `4px solid var(--mantine-color-${lead.score >= 70 ? 'green' : lead.score >= 40 ? 'yellow' : 'red'}-filled)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Text fw={700} size="xl">{lead.score}</Text>
              </Box>
            </Center>
            <Text size="xs" c="dimmed" ta="center" mt="xs">
              {lead.score >= 70 ? 'Hot lead' : lead.score >= 40 ? 'Warm lead' : 'Cold lead'}
            </Text>
          </Paper>
        </Stack>
      </SimpleGrid>

      {/* Activity tabs */}
      <Paper withBorder radius="md">
        <Tabs defaultValue="activity">
          <Tabs.List px="md">
            <Tabs.Tab value="activity">Activity</Tabs.Tab>
            <Tabs.Tab value="notes">Notes</Tabs.Tab>
            <Tabs.Tab value="tasks">Tasks</Tabs.Tab>
          </Tabs.List>

          <Box p="md">
            <Tabs.Panel value="activity">
              <Timeline active={1} bulletSize={24} lineWidth={2}>
                <Timeline.Item title="Lead created">
                  <Text c="dimmed" size="sm">Created on {new Date(lead.createdAt).toLocaleDateString()}</Text>
                </Timeline.Item>
                <Timeline.Item title="Status updated">
                  <Text c="dimmed" size="sm">Status changed to {lead.status}</Text>
                </Timeline.Item>
              </Timeline>
            </Tabs.Panel>
            <Tabs.Panel value="notes">
              <Text c="dimmed" size="sm">{lead.notes || 'No notes yet.'}</Text>
            </Tabs.Panel>
            <Tabs.Panel value="tasks">
              <EmptyState title="No tasks" message="No tasks linked to this lead yet." />
            </Tabs.Panel>
          </Box>
        </Tabs>
      </Paper>
    </Stack>
  );
}
