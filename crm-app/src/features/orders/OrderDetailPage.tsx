import { Paper, Group, Text, Stack, Table, Center, Loader, Box, SimpleGrid, ThemeIcon, Divider } from '@mantine/core';
import { IconCalendar, IconUser, IconHash } from '@tabler/icons-react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { ordersApi } from '../../services/api';
import { ORDER_STATUS_COLOR } from '../../constants';

export function OrderDetailPage() {
  const { id } = useParams();
  const { data: order, isLoading } = useQuery({ queryKey: ['orders', id], queryFn: () => ordersApi.getById(id!), enabled: !!id });

  if (isLoading) return <Center py="xl"><Loader /></Center>;
  if (!order) return <EmptyState title="Order not found" />;

  return (
    <Stack>
      <PageHeader
        title={`Order ${order.orderNumber}`}
        subtitle={`Created ${new Date(order.createdAt).toLocaleDateString()}`}
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Orders', to: '/orders' }, { label: order.orderNumber }]}
      />
      <Paper withBorder p="lg" radius="md">
        <Group mb="lg" pb="md" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
          <Group gap="sm">
            <ThemeIcon variant="light" size="lg" color="blue" radius="md"><IconHash size={18} /></ThemeIcon>
            <Box>
              <Text fw={700} size="lg">{order.orderNumber}</Text>
              <Text size="xs" c="dimmed">Order Reference</Text>
            </Box>
          </Group>
          <StatusBadge status={order.status} colorMap={ORDER_STATUS_COLOR} />
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 3 }} mb="lg">
          {order.contact && (
            <Group gap="sm">
              <ThemeIcon variant="light" size="sm" color="gray" radius="md"><IconUser size={14} /></ThemeIcon>
              <Box>
                <Text size="xs" c="dimmed">Contact</Text>
                <Text size="sm" fw={500}>{order.contact.firstName} {order.contact.lastName}</Text>
              </Box>
            </Group>
          )}
          <Group gap="sm">
            <ThemeIcon variant="light" size="sm" color="gray" radius="md"><IconCalendar size={14} /></ThemeIcon>
            <Box>
              <Text size="xs" c="dimmed">Date</Text>
              <Text size="sm" fw={500}>{new Date(order.createdAt).toLocaleDateString()}</Text>
            </Box>
          </Group>
        </SimpleGrid>

        <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb="sm" style={{ letterSpacing: '0.05em' }}>Line Items</Text>
        <Table highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Product</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Qty</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Unit Price</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Total</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {order.items.map((item, i) => (
              <Table.Tr key={i}>
                <Table.Td><Text size="sm" fw={500}>{item.product?.name ?? item.productId}</Text></Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>{item.quantity}</Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>${item.unitPrice.toFixed(2)}</Table.Td>
                <Table.Td style={{ textAlign: 'right' }}><Text fw={500}>${item.total.toFixed(2)}</Text></Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Divider my="md" />
        <Stack gap={4} align="flex-end">
          <Group gap="lg"><Text size="sm" c="dimmed" w={100} ta="right">Subtotal</Text><Text size="sm" fw={500} w={100} ta="right">${order.subtotal.toFixed(2)}</Text></Group>
          <Group gap="lg"><Text size="sm" c="dimmed" w={100} ta="right">Tax</Text><Text size="sm" fw={500} w={100} ta="right">${order.tax.toFixed(2)}</Text></Group>
          <Divider w={220} />
          <Group gap="lg"><Text size="md" fw={600} w={100} ta="right">Total</Text><Text size="lg" fw={700} w={100} ta="right">${order.total.toFixed(2)}</Text></Group>
        </Stack>
      </Paper>
    </Stack>
  );
}
