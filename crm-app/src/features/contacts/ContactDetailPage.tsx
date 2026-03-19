import { Paper, Group, Text, Stack, SimpleGrid, Button, Badge, Center, Loader, Box, ThemeIcon } from '@mantine/core';
import { IconEdit, IconPhone, IconMail, IconBuilding, IconMapPin, IconBriefcase, IconCalendar } from '@tabler/icons-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/PageHeader';
import { EntityAvatar } from '../../components/EntityAvatar';
import { EmptyState } from '../../components/EmptyState';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import { contactsApi } from '../../services/api';

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

export function ContactDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: contact, isLoading } = useQuery({
    queryKey: ['contacts', id], queryFn: () => contactsApi.getById(id!), enabled: !!id,
  });

  if (isLoading) return <Center py="xl"><Loader /></Center>;
  if (!contact) return <EmptyState title="Contact not found" />;

  const fullName = `${contact.firstName} ${contact.lastName}`;
  const location = [contact.city, contact.state, contact.country].filter(Boolean).join(', ');

  return (
    <Stack>
      <PageHeader
        title={fullName}
        subtitle={contact.jobTitle ? `${contact.jobTitle}${contact.company ? ` at ${contact.company.name}` : ''}` : undefined}
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Contacts', to: '/contacts' }, { label: fullName }]}
        actions={
          <PermissionGuard module="contacts" action="edit">
            <Button leftSection={<IconEdit size={16} />} onClick={() => navigate(`/contacts/${id}/edit`)}>Edit Contact</Button>
          </PermissionGuard>
        }
      />
      <Paper withBorder p="lg" radius="md">
        <Group mb="lg" pb="md" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
          <EntityAvatar name={fullName} size="lg" color="cyan" />
          <Box flex={1}>
            <Text fw={700} size="lg">{fullName}</Text>
            <Text c="dimmed" size="sm">{contact.jobTitle}{contact.company ? ` at ${contact.company.name}` : ''}</Text>
          </Box>
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <InfoRow icon={<IconMail size={14} />} label="Email" value={contact.email} />
          <InfoRow icon={<IconPhone size={14} />} label="Phone" value={contact.phone} />
          <InfoRow icon={<IconBuilding size={14} />} label="Company" value={contact.company?.name} />
          <InfoRow icon={<IconBriefcase size={14} />} label="Job Title" value={contact.jobTitle} />
          <InfoRow icon={<IconMapPin size={14} />} label="Location" value={location || null} />
          <InfoRow icon={<IconCalendar size={14} />} label="Created" value={new Date(contact.createdAt).toLocaleDateString()} />
        </SimpleGrid>
        {contact.tags.length > 0 && (
          <Box mt="lg" pt="md" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb="xs">Tags</Text>
            <Group gap="xs">
              {contact.tags.map(tag => <Badge key={tag} variant="light" radius="sm">{tag}</Badge>)}
            </Group>
          </Box>
        )}
      </Paper>
    </Stack>
  );
}
