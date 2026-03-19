import { Paper, Group, Text, Stack, SimpleGrid, Button, Center, Loader, Box, ThemeIcon } from '@mantine/core';
import { IconEdit, IconCalendar, IconUser, IconCategory, IconFlag } from '@tabler/icons-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import { ticketsApi } from '../../services/api';
import { TICKET_STATUS_COLOR, TICKET_PRIORITY_COLOR } from '../../constants';

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <Group gap="sm" py={6}>
      <ThemeIcon variant="light" size="sm" color="gray" radius="md">{icon}</ThemeIcon>
      <Box>
        <Text size="xs" c="dimmed">{label}</Text>
        {children}
      </Box>
    </Group>
  );
}

export function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: ticket, isLoading } = useQuery({ queryKey: ['tickets', id], queryFn: () => ticketsApi.getById(id!), enabled: !!id });

  if (isLoading) return <Center py="xl"><Loader /></Center>;
  if (!ticket) return <EmptyState title="Ticket not found" />;

  return (
    <Stack>
      <PageHeader
        title={ticket.subject}
        subtitle={`Ticket #${ticket.id.slice(0, 8)}`}
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Tickets', to: '/tickets' }, { label: ticket.subject }]}
        actions={
          <PermissionGuard module="tickets" action="edit">
            <Button leftSection={<IconEdit size={16} />} onClick={() => navigate(`/tickets/${id}/edit`)}>Edit Ticket</Button>
          </PermissionGuard>
        }
      />
      <Paper withBorder p="lg" radius="md">
        <SimpleGrid cols={{ base: 1, sm: 2 }} mb="lg">
          <InfoRow icon={<IconFlag size={14} />} label="Status">
            <StatusBadge status={ticket.status} colorMap={TICKET_STATUS_COLOR} />
          </InfoRow>
          <InfoRow icon={<IconFlag size={14} />} label="Priority">
            <StatusBadge status={ticket.priority} colorMap={TICKET_PRIORITY_COLOR} />
          </InfoRow>
          {ticket.category && (
            <InfoRow icon={<IconCategory size={14} />} label="Category">
              <Text size="sm" fw={500}>{ticket.category}</Text>
            </InfoRow>
          )}
          {ticket.contact && (
            <InfoRow icon={<IconUser size={14} />} label="Contact">
              <Text size="sm" fw={500}>{ticket.contact.firstName} {ticket.contact.lastName}</Text>
            </InfoRow>
          )}
          <InfoRow icon={<IconCalendar size={14} />} label="Created">
            <Text size="sm" fw={500}>{new Date(ticket.createdAt).toLocaleString()}</Text>
          </InfoRow>
          {ticket.resolvedAt && (
            <InfoRow icon={<IconCalendar size={14} />} label="Resolved">
              <Text size="sm" fw={500}>{new Date(ticket.resolvedAt).toLocaleString()}</Text>
            </InfoRow>
          )}
        </SimpleGrid>

        <Box pt="md" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb="xs">Description</Text>
          <Text size="sm">{ticket.description}</Text>
        </Box>
      </Paper>
    </Stack>
  );
}
