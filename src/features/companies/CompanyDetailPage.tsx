import { Paper, Group, Text, Stack, SimpleGrid, Button, Center, Loader } from '@mantine/core';
import { IconEdit, IconWorld, IconPhone, IconUsers } from '@tabler/icons-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/PageHeader';
import { EntityAvatar } from '../../components/EntityAvatar';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import { companiesApi } from '../../services/api';

export function CompanyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: company, isLoading } = useQuery({
    queryKey: ['companies', id], queryFn: () => companiesApi.getById(id!), enabled: !!id,
  });

  if (isLoading) return <Center py="xl"><Loader /></Center>;
  if (!company) return <EmptyState title="Company not found" />;

  return (
    <Stack>
      <PageHeader
        title={company.name}
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Companies', to: '/companies' }, { label: company.name }]}
        actions={
          <PermissionGuard module="companies" action="edit">
            <Button leftSection={<IconEdit size={16} />} onClick={() => navigate(`/companies/${id}/edit`)}>Edit</Button>
          </PermissionGuard>
        }
      />
      <Paper withBorder p="md" radius="md">
        <Group mb="md">
          <EntityAvatar name={company.name} size="lg" color="cyan" />
          <div>
            <Text fw={600} size="lg">{company.name}</Text>
            <Text c="dimmed" size="sm">{company.industry ?? 'No industry'}</Text>
          </div>
          <StatusBadge status={company.size} colorMap={{ startup: 'violet', small: 'blue', medium: 'cyan', enterprise: 'green' }} />
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          {company.website && <Group gap="xs"><IconWorld size={16} /><Text size="sm">{company.website}</Text></Group>}
          {company.phone && <Group gap="xs"><IconPhone size={16} /><Text size="sm">{company.phone}</Text></Group>}
          {company.employeeCount && <Group gap="xs"><IconUsers size={16} /><Text size="sm">{company.employeeCount} employees</Text></Group>}
          {company.annualRevenue && <Group gap="xs"><Text size="sm" c="dimmed">Revenue:</Text><Text size="sm" fw={500}>${company.annualRevenue.toLocaleString()}</Text></Group>}
          {company.city && <Group gap="xs"><Text size="sm" c="dimmed">Location:</Text><Text size="sm">{company.city}{company.country ? `, ${company.country}` : ''}</Text></Group>}
        </SimpleGrid>
      </Paper>
    </Stack>
  );
}
