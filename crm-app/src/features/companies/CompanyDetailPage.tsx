import { Paper, Group, Text, Stack, SimpleGrid, Button, Center, Loader, Box, ThemeIcon } from '@mantine/core';
import { IconEdit, IconWorld, IconPhone, IconUsers, IconBuilding, IconMapPin, IconCash } from '@tabler/icons-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/PageHeader';
import { EntityAvatar } from '../../components/EntityAvatar';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import { companiesApi } from '../../services/api';

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

export function CompanyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: company, isLoading } = useQuery({
    queryKey: ['companies', id], queryFn: () => companiesApi.getById(id!), enabled: !!id,
  });

  if (isLoading) return <Center py="xl"><Loader /></Center>;
  if (!company) return <EmptyState title="Company not found" />;

  const location = [company.city, company.state, company.country].filter(Boolean).join(', ');

  return (
    <Stack>
      <PageHeader
        title={company.name}
        subtitle={company.industry || undefined}
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Companies', to: '/companies' }, { label: company.name }]}
        actions={
          <PermissionGuard module="companies" action="edit">
            <Button leftSection={<IconEdit size={16} />} onClick={() => navigate(`/companies/${id}/edit`)}>Edit Company</Button>
          </PermissionGuard>
        }
      />
      <Paper withBorder p="lg" radius="md">
        <Group mb="lg" pb="md" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
          <EntityAvatar name={company.name} size="lg" color="teal" />
          <Box flex={1}>
            <Group gap="sm">
              <Text fw={700} size="lg">{company.name}</Text>
              <StatusBadge status={company.size} colorMap={{ startup: 'violet', small: 'blue', medium: 'cyan', enterprise: 'green' }} />
            </Group>
            <Text c="dimmed" size="sm">{company.industry ?? 'No industry specified'}</Text>
          </Box>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <InfoRow icon={<IconWorld size={14} />} label="Website" value={company.website} />
          <InfoRow icon={<IconPhone size={14} />} label="Phone" value={company.phone} />
          <InfoRow icon={<IconUsers size={14} />} label="Employees" value={company.employeeCount ? `${company.employeeCount}` : null} />
          <InfoRow icon={<IconCash size={14} />} label="Annual Revenue" value={company.annualRevenue ? `$${company.annualRevenue.toLocaleString()}` : null} />
          <InfoRow icon={<IconMapPin size={14} />} label="Location" value={location || null} />
          <InfoRow icon={<IconBuilding size={14} />} label="Size" value={company.size?.replace(/\b\w/g, c => c.toUpperCase())} />
        </SimpleGrid>
      </Paper>
    </Stack>
  );
}
