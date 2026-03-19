import { Paper, Group, Text, Stack, SimpleGrid, Button, Badge, Center, Loader } from '@mantine/core';
import { IconEdit, IconPhone, IconMail, IconBuilding } from '@tabler/icons-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/PageHeader';
import { EntityAvatar } from '../../components/EntityAvatar';
import { EmptyState } from '../../components/EmptyState';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import { contactsApi } from '../../services/api';

export function ContactDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: contact, isLoading } = useQuery({
    queryKey: ['contacts', id],
    queryFn: () => contactsApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading) return <Center py="xl"><Loader /></Center>;
  if (!contact) return <EmptyState title="Contact not found" />;

  const fullName = `${contact.firstName} ${contact.lastName}`;

  return (
    <Stack>
      <PageHeader
        title={fullName}
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Contacts', to: '/contacts' }, { label: fullName }]}
        actions={
          <PermissionGuard module="contacts" action="edit">
            <Button leftSection={<IconEdit size={16} />} onClick={() => navigate(`/contacts/${id}/edit`)}>Edit</Button>
          </PermissionGuard>
        }
      />
      <Paper withBorder p="md" radius="md">
        <Group mb="md">
          <EntityAvatar name={fullName} size="lg" />
          <div>
            <Text fw={600} size="lg">{fullName}</Text>
            <Text c="dimmed" size="sm">{contact.jobTitle}{contact.company ? ` at ${contact.company.name}` : ''}</Text>
          </div>
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Group gap="xs"><IconMail size={16} /><Text size="sm">{contact.email}</Text></Group>
          {contact.phone && <Group gap="xs"><IconPhone size={16} /><Text size="sm">{contact.phone}</Text></Group>}
          {contact.company && <Group gap="xs"><IconBuilding size={16} /><Text size="sm">{contact.company.name}</Text></Group>}
          {contact.city && <Group gap="xs"><Text size="sm" c="dimmed">Location:</Text><Text size="sm">{contact.city}{contact.country ? `, ${contact.country}` : ''}</Text></Group>}
        </SimpleGrid>
        {contact.tags.length > 0 && (
          <Group mt="md" gap="xs">
            {contact.tags.map((tag) => <Badge key={tag} variant="light">{tag}</Badge>)}
          </Group>
        )}
      </Paper>
    </Stack>
  );
}
