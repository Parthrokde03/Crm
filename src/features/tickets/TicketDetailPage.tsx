import { Paper, Group, Text, Stack, SimpleGrid, Button, Center, Loader } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import { ticketsApi } from '../../services/api';
import { TICKET_STATUS_COLOR, TICKET_PRIORITY_COLOR } from '../../constants';

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
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Tickets', to: '/tickets' }, { label: ticket.subject }]}
        actions={<PermissionGuard module="tickets" action="edit"><Button leftSection={<IconEdit size={16} />} onClick={() => navigate(`/tickets/${id}/edit`)}>Edit</Button></PermissionGuard>}
      />
      <Paper withBorder p="md" radius="md">
        <SimpleGrid cols={{ base: 1, sm: 2 }} mb="md">
          <Group gap="xs"><Text size="sm" c="dimmed">Status:</Text><StatusBadge status={ticket.status} colorMap={TICKET_STATUS_COLOR} /></Group>
          <Group gap="xs"><Text size="sm" c="dimmed">Priority:</Text><StatusBadge status={ticket.priority} colorMap={TICKET_PRIORITY_COLOR} /></Group>
          {ticket.category && <Group gap="xs"><Text size="sm" c="dimmed">Category:</Text><Text size="sm">{ticket.category}</Text></Group>}
          {ticket.contact && <Group gap="xs"><Text size="sm" c="dimmed">Contact:</Text><Text size="sm">{ticket.contact.firstName} {ticket.contact.lastName}</Text></Group>}
          <Group gap="xs"><Text size="sm" c="dimmed">Created:</Text><Text size="sm">{new Date(ticket.createdAt).toLocaleString()}</Text></Group>
          {ticket.resolvedAt && <Group gap="xs"><Text size="sm" c="dimmed">Resolved:</Text><Text size="sm">{new Date(ticket.resolvedAt).toLocaleString()}</Text></Group>}
        </SimpleGrid>
        <Text size="sm" fw={500} mb="xs">Description</Text>
        <Text size="sm" c="dimmed">{ticket.description}</Text>
      </Paper>
    </Stack>
  );
}
