import { Paper, Group, Text, Stack, Table, Center, Loader } from '@mantine/core';
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
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Orders', to: '/orders' }, { label: order.orderNumber }]}
      />
      <Paper withBorder p="md" radius="md">
        <Group mb="md">
          <Text fw={600} size="lg">{order.orderNumber}</Text>
          <StatusBadge status={order.status} colorMap={ORDER_STATUS_COLOR} />
        </Group>
        <Group mb="md">
          {order.contact && <Group gap="xs"><Text size="sm" c="dimmed">Contact:</Text><Text size="sm">{order.contact.firstName} {order.contact.lastName}</Text></Group>}
          <Group gap="xs"><Text size="sm" c="dimmed">Date:</Text><Text size="sm">{new Date(order.createdAt).toLocaleDateString()}</Text></Group>
        </Group>
        <Table striped withTableBorder>
          <Table.Thead>
            <Table.Tr><Table.Th>Product</Table.Th><Table.Th>Qty</Table.Th><Table.Th>Unit Price</Table.Th><Table.Th>Total</Table.Th></Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {order.items.map((item, i) => (
              <Table.Tr key={i}><Table.Td>{item.product?.name ?? item.productId}</Table.Td><Table.Td>{item.quantity}</Table.Td><Table.Td>${item.unitPrice.toFixed(2)}</Table.Td><Table.Td>${item.total.toFixed(2)}</Table.Td></Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <Group justify="flex-end" mt="md" gap="lg">
          <Text size="sm" c="dimmed">Subtotal: ${order.subtotal.toFixed(2)}</Text>
          <Text size="sm" c="dimmed">Tax: ${order.tax.toFixed(2)}</Text>
          <Text size="lg" fw={700}>Total: ${order.total.toFixed(2)}</Text>
        </Group>
      </Paper>
    </Stack>
  );
}
