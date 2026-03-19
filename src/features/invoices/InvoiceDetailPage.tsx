import { Paper, Group, Text, Stack, Table, Center, Loader } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { invoicesApi } from '../../services/api';
import { INVOICE_STATUS_COLOR } from '../../constants';

export function InvoiceDetailPage() {
  const { id } = useParams();
  const { data: invoice, isLoading } = useQuery({ queryKey: ['invoices', id], queryFn: () => invoicesApi.getById(id!), enabled: !!id });

  if (isLoading) return <Center py="xl"><Loader /></Center>;
  if (!invoice) return <EmptyState title="Invoice not found" />;

  return (
    <Stack>
      <PageHeader
        title={`Invoice ${invoice.invoiceNumber}`}
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Invoices', to: '/invoices' }, { label: invoice.invoiceNumber }]}
      />
      <Paper withBorder p="md" radius="md">
        <Group mb="md">
          <Text fw={600} size="lg">{invoice.invoiceNumber}</Text>
          <StatusBadge status={invoice.status} colorMap={INVOICE_STATUS_COLOR} />
        </Group>
        <Group mb="md" gap="lg">
          {invoice.contact && <Group gap="xs"><Text size="sm" c="dimmed">Contact:</Text><Text size="sm">{invoice.contact.firstName} {invoice.contact.lastName}</Text></Group>}
          <Group gap="xs"><Text size="sm" c="dimmed">Due:</Text><Text size="sm">{new Date(invoice.dueDate).toLocaleDateString()}</Text></Group>
          {invoice.paidAt && <Group gap="xs"><Text size="sm" c="dimmed">Paid:</Text><Text size="sm">{new Date(invoice.paidAt).toLocaleDateString()}</Text></Group>}
        </Group>
        <Table striped withTableBorder>
          <Table.Thead>
            <Table.Tr><Table.Th>Product</Table.Th><Table.Th>Qty</Table.Th><Table.Th>Unit Price</Table.Th><Table.Th>Total</Table.Th></Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {invoice.items.map((item, i) => (
              <Table.Tr key={i}><Table.Td>{item.product?.name ?? item.productId}</Table.Td><Table.Td>{item.quantity}</Table.Td><Table.Td>${item.unitPrice.toFixed(2)}</Table.Td><Table.Td>${item.total.toFixed(2)}</Table.Td></Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <Group justify="flex-end" mt="md" gap="lg">
          <Text size="sm" c="dimmed">Subtotal: ${invoice.subtotal.toFixed(2)}</Text>
          <Text size="sm" c="dimmed">Tax: ${invoice.tax.toFixed(2)}</Text>
          <Text size="lg" fw={700}>Total: ${invoice.total.toFixed(2)}</Text>
        </Group>
      </Paper>
    </Stack>
  );
}
