import { useState } from 'react';
import { Stack, Tabs, SimpleGrid, Text, Skeleton, Table, Badge } from '@mantine/core';
import { IconChartBar, IconTargetArrow, IconTicket, IconCash } from '@tabler/icons-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/PageHeader';
import { MetricCard } from '../../components/MetricCard';
import { ChartCard } from '../../components/ChartCard';
import { reportsApi } from '../../services/api';

const COLORS = ['#228be6', '#40c057', '#fab005', '#fa5252', '#7950f2', '#e64980', '#15aabf'];

const STAGE_LABELS: Record<string, string> = {
  prospecting: 'Prospecting', qualification: 'Qualification', proposal: 'Proposal',
  negotiation: 'Negotiation', closed_won: 'Won', closed_lost: 'Lost',
};
const SOURCE_LABELS: Record<string, string> = {
  website: 'Website', referral: 'Referral', cold_call: 'Cold Call',
  social: 'Social', advertisement: 'Ad', other: 'Other',
};
const STATUS_LABELS: Record<string, string> = {
  new: 'New', contacted: 'Contacted', qualified: 'Qualified',
  unqualified: 'Unqualified', converted: 'Converted',
};

function fmt(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}

export function ReportsPage() {
  const [tab, setTab] = useState<string | null>('sales');
  const sales = useQuery({ queryKey: ['reports', 'sales'], queryFn: reportsApi.sales, enabled: tab === 'sales' });
  const leads = useQuery({ queryKey: ['reports', 'leads'], queryFn: reportsApi.leads, enabled: tab === 'leads' });
  const tickets = useQuery({ queryKey: ['reports', 'tickets'], queryFn: reportsApi.tickets, enabled: tab === 'tickets' });
  const revenue = useQuery({ queryKey: ['reports', 'revenue'], queryFn: reportsApi.revenue, enabled: tab === 'revenue' });

  return (
    <Stack>
      <PageHeader title="Reports" breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Reports' }]} />
      <Tabs value={tab} onChange={setTab}>
        <Tabs.List>
          <Tabs.Tab value="sales" leftSection={<IconChartBar size={16} />}>Sales</Tabs.Tab>
          <Tabs.Tab value="leads" leftSection={<IconTargetArrow size={16} />}>Leads</Tabs.Tab>
          <Tabs.Tab value="tickets" leftSection={<IconTicket size={16} />}>Tickets</Tabs.Tab>
          <Tabs.Tab value="revenue" leftSection={<IconCash size={16} />}>Revenue</Tabs.Tab>
        </Tabs.List>

        {/* ── Sales Tab ── */}
        <Tabs.Panel value="sales" pt="md">
          {sales.isLoading ? <Skeleton height={400} /> : sales.data ? (
            <Stack>
              <SimpleGrid cols={{ base: 1, sm: 3 }}>
                <MetricCard title="Won Deals" value={fmt(sales.data.summary.wonValue)} icon={<IconChartBar size={20} />} changeLabel={`${sales.data.summary.wonCount} deals`} />
                <MetricCard title="Lost Deals" value={fmt(sales.data.summary.lostValue)} icon={<IconChartBar size={20} />} changeLabel={`${sales.data.summary.lostCount} deals`} />
                <MetricCard title="Pipeline" value={fmt(sales.data.summary.pipelineValue)} icon={<IconChartBar size={20} />} changeLabel={`${sales.data.summary.pipelineCount} active`} />
              </SimpleGrid>
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <ChartCard title="Deals by Stage">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sales.data.dealsByStage.map((d: any) => ({ ...d, stage: STAGE_LABELS[d.stage] || d.stage }))}>
                      <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="stage" fontSize={12} /><YAxis fontSize={12} allowDecimals={false} /><Tooltip />
                      <Bar dataKey="count" fill="#228be6" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Monthly Deal Value">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[...sales.data.dealsByMonth].reverse()}>
                      <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip formatter={(v: number) => fmt(v)} />
                      <Bar dataKey="value" fill="#40c057" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </SimpleGrid>
              {sales.data.topReps.length > 0 && (
                <ChartCard title="Top Sales Reps">
                  <Table striped highlightOnHover>
                    <Table.Thead><Table.Tr><Table.Th>Name</Table.Th><Table.Th>Won Deals</Table.Th><Table.Th>Revenue</Table.Th></Table.Tr></Table.Thead>
                    <Table.Tbody>
                      {sales.data.topReps.map((r: any, i: number) => (
                        <Table.Tr key={i}><Table.Td>{r.name}</Table.Td><Table.Td>{r.deals}</Table.Td><Table.Td>{fmt(r.revenue)}</Table.Td></Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ChartCard>
              )}
            </Stack>
          ) : <Text c="dimmed">No sales data available yet.</Text>}
        </Tabs.Panel>

        {/* ── Leads Tab ── */}
        <Tabs.Panel value="leads" pt="md">
          {leads.isLoading ? <Skeleton height={400} /> : leads.data ? (
            <Stack>
              <SimpleGrid cols={{ base: 1, sm: 3 }}>
                <MetricCard title="Total Leads" value={leads.data.total} icon={<IconTargetArrow size={20} />} />
                <MetricCard title="Converted" value={leads.data.converted} icon={<IconTargetArrow size={20} />} />
                <MetricCard title="Conversion Rate" value={`${leads.data.conversionRate}%`} icon={<IconTargetArrow size={20} />} />
              </SimpleGrid>
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <ChartCard title="Leads by Status">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={leads.data.byStatus.map((l: any) => ({ name: STATUS_LABELS[l.status] || l.status, value: l.count }))} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                        {leads.data.byStatus.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie><Tooltip /><Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Leads by Source">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={leads.data.bySource.map((l: any) => ({ ...l, source: SOURCE_LABELS[l.source] || l.source }))}>
                      <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="source" fontSize={12} /><YAxis fontSize={12} allowDecimals={false} /><Tooltip />
                      <Bar dataKey="count" fill="#fab005" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </SimpleGrid>
            </Stack>
          ) : <Text c="dimmed">No lead data available yet.</Text>}
        </Tabs.Panel>

        {/* ── Tickets Tab ── */}
        <Tabs.Panel value="tickets" pt="md">
          {tickets.isLoading ? <Skeleton height={400} /> : tickets.data ? (
            <Stack>
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <MetricCard title="Avg Resolution" value={tickets.data.avgResolutionHours ? `${tickets.data.avgResolutionHours.toFixed(1)}h` : 'N/A'} icon={<IconTicket size={20} />} changeLabel="average hours" />
              </SimpleGrid>
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <ChartCard title="Tickets by Status">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={tickets.data.byStatus.map((t: any) => ({ name: t.status, value: t.count }))} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                        {tickets.data.byStatus.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie><Tooltip /><Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Tickets by Priority">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={tickets.data.byPriority}>
                      <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="priority" fontSize={12} /><YAxis fontSize={12} allowDecimals={false} /><Tooltip />
                      <Bar dataKey="count" fill="#fa5252" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </SimpleGrid>
            </Stack>
          ) : <Text c="dimmed">No ticket data available yet.</Text>}
        </Tabs.Panel>

        {/* ── Revenue Tab ── */}
        <Tabs.Panel value="revenue" pt="md">
          {revenue.isLoading ? <Skeleton height={400} /> : revenue.data ? (
            <Stack>
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <MetricCard title="Total Paid" value={fmt(revenue.data.paidTotal)} icon={<IconCash size={20} />} />
                <MetricCard title="Overdue" value={fmt(revenue.data.overdueTotal)} icon={<IconCash size={20} />} />
              </SimpleGrid>
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <ChartCard title="Invoices by Status">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={revenue.data.invoicesByStatus.map((i: any) => ({ name: i.status, value: i.count }))} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                        {revenue.data.invoicesByStatus.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie><Tooltip /><Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Monthly Revenue">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[...(revenue.data.invoicesByMonth || [])].reverse()}>
                      <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip formatter={(v: number) => fmt(v)} />
                      <Bar dataKey="total" fill="#7950f2" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </SimpleGrid>
            </Stack>
          ) : <Text c="dimmed">No invoice data available yet.</Text>}
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
