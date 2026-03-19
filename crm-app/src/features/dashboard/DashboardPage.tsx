import { SimpleGrid, Stack, Skeleton, Text, Paper, Group, ThemeIcon, RingProgress, Center } from '@mantine/core';
import {
  IconUsers, IconCash, IconTargetArrow, IconTicket, IconBuildingStore,
  IconFileInvoice, IconListCheck, IconPackage, IconShoppingCart,
  IconAlertCircle, IconCircleCheck, IconClock, IconTrendingUp,
} from '@tabler/icons-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/PageHeader';
import { MetricCard } from '../../components/MetricCard';
import { ChartCard } from '../../components/ChartCard';
import { dashboardApi } from '../../services/api';
import { useAuthStore } from '../../store/auth-store';
import type { RoleName } from '../../types';

const COLORS = ['#228be6', '#40c057', '#fab005', '#fa5252', '#7950f2', '#e64980', '#15aabf', '#fd7e14'];

const STAGE_LABELS: Record<string, string> = {
  prospecting: 'Prospecting', qualification: 'Qualification', proposal: 'Proposal',
  negotiation: 'Negotiation', closed_won: 'Won', closed_lost: 'Lost',
};
const SOURCE_LABELS: Record<string, string> = {
  website: 'Website', referral: 'Referral', cold_call: 'Cold Call',
  social: 'Social', advertisement: 'Advertisement', other: 'Other',
};
const PRIORITY_LABELS: Record<string, string> = {
  low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical',
};
const STATUS_LABELS: Record<string, string> = {
  open: 'Open', in_progress: 'In Progress', waiting: 'Waiting',
  resolved: 'Resolved', closed: 'Closed',
  new: 'New', contacted: 'Contacted', qualified: 'Qualified',
  unqualified: 'Unqualified', converted: 'Converted',
};

function fmt(val: number): string {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}K`;
  return `$${val}`;
}


function LoadingSkeleton() {
  return (
    <Stack>
      <PageHeader title="Dashboard" />
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        {[1, 2, 3, 4].map(i => <Skeleton key={i} height={120} radius="md" />)}
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <Skeleton height={360} radius="md" />
        <Skeleton height={360} radius="md" />
      </SimpleGrid>
    </Stack>
  );
}

// ═══════════════════════════════════════════════════════════
// ADMIN DASHBOARD — Full overview of everything
// ═══════════════════════════════════════════════════════════
function AdminDashboard({ m }: { m: any }) {
  const pipelineData = (m.dealsByStage || []).map((d: any) => ({
    stage: STAGE_LABELS[d.stage] || d.stage, value: d.count,
  }));
  const leadSourceData = (m.leadsBySource || []).map((l: any) => ({
    name: SOURCE_LABELS[l.source] || l.source, value: l.count,
  }));

  return (
    <Stack>
      <PageHeader title="Dashboard" subtitle="Full system overview" />
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        <MetricCard title="Total Leads" value={m.totalLeads ?? 0} icon={<IconTargetArrow size={20} />} />
        <MetricCard title="Revenue (Won)" value={fmt(m.totalRevenue ?? 0)} icon={<IconCash size={20} />} />
        <MetricCard title="Contacts" value={m.totalContacts ?? 0} icon={<IconUsers size={20} />} />
        <MetricCard title="Open Tickets" value={m.openTickets ?? 0} icon={<IconTicket size={20} />} />
        <MetricCard title="Companies" value={m.totalCompanies ?? 0} icon={<IconBuildingStore size={20} />} />
        <MetricCard title="Active Deals" value={m.totalDeals ?? 0} icon={<IconListCheck size={20} />} />
        <MetricCard title="Orders" value={m.totalOrders ?? 0} icon={<IconShoppingCart size={20} />} />
        <MetricCard title="Paid Invoices" value={fmt(m.totalPaidInvoices ?? 0)} icon={<IconFileInvoice size={20} />} />
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <ChartCard title="Deal Pipeline">
          {pipelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#228be6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <Text c="dimmed" ta="center" py="xl">No deals yet.</Text>}
        </ChartCard>
        <ChartCard title="Lead Sources">
          {leadSourceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={leadSourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                  {leadSourceData.map((_: unknown, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <Text c="dimmed" ta="center" py="xl">No leads yet.</Text>}
        </ChartCard>
      </SimpleGrid>
    </Stack>
  );
}

// ═══════════════════════════════════════════════════════════
// SALES MANAGER DASHBOARD — Team pipeline, leads, performance
// ═══════════════════════════════════════════════════════════
function SalesManagerDashboard({ m }: { m: any }) {
  const pipelineData = (m.dealsByStage || []).map((d: any) => ({
    stage: STAGE_LABELS[d.stage] || d.stage, value: d.count,
  }));
  const leadSourceData = (m.leadsBySource || []).map((l: any) => ({
    name: SOURCE_LABELS[l.source] || l.source, value: l.count,
  }));
  const leadStatusData = (m.leadsByStatus || []).map((l: any) => ({
    name: STATUS_LABELS[l.status] || l.status, value: l.count,
  }));

  return (
    <Stack>
      <PageHeader title="Sales Dashboard" subtitle="Team performance overview" />
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        <MetricCard title="Team Leads" value={m.totalLeads ?? 0} icon={<IconTargetArrow size={20} />} />
        <MetricCard title="Team Revenue" value={fmt(m.totalRevenue ?? 0)} icon={<IconCash size={20} />} />
        <MetricCard title="Active Deals" value={m.totalDeals ?? 0} icon={<IconListCheck size={20} />} />
        <MetricCard title="Team Contacts" value={m.totalContacts ?? 0} icon={<IconUsers size={20} />} />
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <ChartCard title="Team Deal Pipeline">
          {pipelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#228be6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <Text c="dimmed" ta="center" py="xl">No deals yet.</Text>}
        </ChartCard>
        <ChartCard title="Lead Sources">
          {leadSourceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={leadSourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                  {leadSourceData.map((_: unknown, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <Text c="dimmed" ta="center" py="xl">No leads yet.</Text>}
        </ChartCard>
        <ChartCard title="Lead Status Breakdown">
          {leadStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leadStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#40c057" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <Text c="dimmed" ta="center" py="xl">No leads yet.</Text>}
        </ChartCard>
      </SimpleGrid>
    </Stack>
  );
}

// ═══════════════════════════════════════════════════════════
// SALES REP DASHBOARD — Personal pipeline, own leads/deals
// ═══════════════════════════════════════════════════════════
function SalesRepDashboard({ m }: { m: any }) {
  const pipelineData = (m.dealsByStage || []).map((d: any) => ({
    stage: STAGE_LABELS[d.stage] || d.stage, value: d.count,
  }));

  return (
    <Stack>
      <PageHeader title="My Dashboard" subtitle="Your personal performance" />
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        <MetricCard title="My Leads" value={m.totalLeads ?? 0} icon={<IconTargetArrow size={20} />} />
        <MetricCard title="My Revenue" value={fmt(m.totalRevenue ?? 0)} icon={<IconCash size={20} />} />
        <MetricCard title="My Deals" value={m.totalDeals ?? 0} icon={<IconListCheck size={20} />} />
        <MetricCard title="Pending Tasks" value={m.pendingTasks ?? 0} icon={<IconClock size={20} />} />
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <ChartCard title="My Deal Pipeline">
          {pipelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#228be6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <Text c="dimmed" ta="center" py="xl">No deals yet. Start prospecting!</Text>}
        </ChartCard>
        <Paper p="lg" radius="md" withBorder>
          <Text fw={600} mb="md">Quick Stats</Text>
          <Stack gap="md">
            <Group justify="space-between">
              <Group gap="xs">
                <ThemeIcon variant="light" color="blue"><IconUsers size={16} /></ThemeIcon>
                <Text size="sm">My Contacts</Text>
              </Group>
              <Text fw={600}>{m.totalContacts ?? 0}</Text>
            </Group>
            <Group justify="space-between">
              <Group gap="xs">
                <ThemeIcon variant="light" color="green"><IconListCheck size={16} /></ThemeIcon>
                <Text size="sm">Total Tasks</Text>
              </Group>
              <Text fw={600}>{m.totalTasks ?? 0}</Text>
            </Group>
            <Group justify="space-between">
              <Group gap="xs">
                <ThemeIcon variant="light" color="orange"><IconClock size={16} /></ThemeIcon>
                <Text size="sm">Pending Tasks</Text>
              </Group>
              <Text fw={600}>{m.pendingTasks ?? 0}</Text>
            </Group>
          </Stack>
        </Paper>
      </SimpleGrid>
    </Stack>
  );
}

// ═══════════════════════════════════════════════════════════
// SUPPORT AGENT DASHBOARD — Ticket stats, resolution metrics
// ═══════════════════════════════════════════════════════════
function SupportDashboard({ m }: { m: any }) {
  const ticketStatusData = (m.ticketsByStatus || []).map((t: any) => ({
    name: STATUS_LABELS[t.status] || t.status, value: t.count,
  }));
  const ticketPriorityData = (m.ticketsByPriority || []).map((t: any) => ({
    name: PRIORITY_LABELS[t.priority] || t.priority, value: t.count,
  }));
  const total = m.totalTickets ?? 0;
  const resolved = m.resolvedTickets ?? 0;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  return (
    <Stack>
      <PageHeader title="Support Dashboard" subtitle="Your ticket overview" />
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        <MetricCard title="Open Tickets" value={m.openTickets ?? 0} icon={<IconAlertCircle size={20} />} />
        <MetricCard title="Total Tickets" value={total} icon={<IconTicket size={20} />} />
        <MetricCard title="Resolved" value={resolved} icon={<IconCircleCheck size={20} />} />
        <MetricCard title="Pending Tasks" value={m.pendingTasks ?? 0} icon={<IconClock size={20} />} />
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <ChartCard title="Tickets by Status">
          {ticketStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ticketStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#fa5252" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <Text c="dimmed" ta="center" py="xl">No tickets yet.</Text>}
        </ChartCard>
        <ChartCard title="Tickets by Priority">
          {ticketPriorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={ticketPriorityData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                  {ticketPriorityData.map((_: unknown, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <Text c="dimmed" ta="center" py="xl">No tickets yet.</Text>}
        </ChartCard>
      </SimpleGrid>
      <Paper p="lg" radius="md" withBorder>
        <Group justify="center" gap="xl">
          <RingProgress
            size={140}
            thickness={14}
            roundCaps
            sections={[{ value: resolutionRate, color: 'green' }]}
            label={<Center><Text fw={700} size="lg">{resolutionRate}%</Text></Center>}
          />
          <div>
            <Text fw={600} size="lg">Resolution Rate</Text>
            <Text c="dimmed" size="sm">{resolved} of {total} tickets resolved</Text>
          </div>
        </Group>
      </Paper>
    </Stack>
  );
}

// ═══════════════════════════════════════════════════════════
// OPS MANAGER DASHBOARD — Products, orders, invoices
// ═══════════════════════════════════════════════════════════
function OpsDashboard({ m }: { m: any }) {
  return (
    <Stack>
      <PageHeader title="Operations Dashboard" subtitle="Products, orders & fulfillment" />
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        <MetricCard title="Products" value={m.totalProducts ?? 0} icon={<IconPackage size={20} />} />
        <MetricCard title="Active Products" value={m.activeProducts ?? 0} icon={<IconCircleCheck size={20} />} />
        <MetricCard title="Orders" value={m.totalOrders ?? 0} icon={<IconShoppingCart size={20} />} />
        <MetricCard title="Order Value" value={fmt(m.orderValue ?? 0)} icon={<IconCash size={20} />} />
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        <MetricCard title="Total Invoices" value={m.totalInvoices ?? 0} icon={<IconFileInvoice size={20} />} />
        <MetricCard title="Paid Invoices" value={fmt(m.totalPaidInvoices ?? 0)} icon={<IconCircleCheck size={20} />} />
        <MetricCard title="Pending Tasks" value={m.pendingTasks ?? 0} icon={<IconClock size={20} />} />
      </SimpleGrid>
      <Paper p="lg" radius="md" withBorder>
        <Text fw={600} mb="md">Operations Summary</Text>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">Companies</Text>
            <Text fw={600}>{m.totalCompanies ?? 0}</Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">Overdue Invoices</Text>
            <Text fw={600} c="red">{m.overdueInvoices ?? 0}</Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">Outstanding Amount</Text>
            <Text fw={600} c="orange">{fmt(m.outstandingAmount ?? 0)}</Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">Total Tasks</Text>
            <Text fw={600}>{m.totalTasks ?? 0}</Text>
          </Group>
        </SimpleGrid>
      </Paper>
    </Stack>
  );
}

// ═══════════════════════════════════════════════════════════
// MARKETING MANAGER DASHBOARD — Lead sources, conversion
// ═══════════════════════════════════════════════════════════
function MarketingDashboard({ m }: { m: any }) {
  const leadSourceData = (m.leadsBySource || []).map((l: any) => ({
    name: SOURCE_LABELS[l.source] || l.source, value: l.count,
  }));
  const leadStatusData = (m.leadsByStatus || []).map((l: any) => ({
    name: STATUS_LABELS[l.status] || l.status, value: l.count,
  }));
  const converted = (m.leadsByStatus || []).find((l: any) => l.status === 'converted')?.count ?? 0;
  const total = m.totalLeads ?? 0;
  const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;

  return (
    <Stack>
      <PageHeader title="Marketing Dashboard" subtitle="Lead generation & conversion" />
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        <MetricCard title="Total Leads" value={total} icon={<IconTargetArrow size={20} />} />
        <MetricCard title="Converted" value={converted} icon={<IconTrendingUp size={20} />} />
        <MetricCard title="Conversion Rate" value={`${conversionRate}%`} icon={<IconCircleCheck size={20} />} />
        <MetricCard title="Contacts" value={m.totalContacts ?? 0} icon={<IconUsers size={20} />} />
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <ChartCard title="Lead Sources">
          {leadSourceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={leadSourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                  {leadSourceData.map((_: unknown, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <Text c="dimmed" ta="center" py="xl">No leads yet.</Text>}
        </ChartCard>
        <ChartCard title="Lead Status Funnel">
          {leadStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leadStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#7950f2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <Text c="dimmed" ta="center" py="xl">No leads yet.</Text>}
        </ChartCard>
      </SimpleGrid>
    </Stack>
  );
}

// ═══════════════════════════════════════════════════════════
// FINANCE MANAGER DASHBOARD — Invoices, revenue, payments
// ═══════════════════════════════════════════════════════════
function FinanceDashboard({ m }: { m: any }) {
  const total = m.totalInvoices ?? 0;
  const paid = m.paidInvoices ?? 0;
  const paidRate = total > 0 ? Math.round((paid / total) * 100) : 0;

  return (
    <Stack>
      <PageHeader title="Finance Dashboard" subtitle="Invoices & revenue overview" />
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        <MetricCard title="Total Invoices" value={total} icon={<IconFileInvoice size={20} />} />
        <MetricCard title="Paid" value={fmt(m.totalPaidInvoices ?? 0)} icon={<IconCircleCheck size={20} />} />
        <MetricCard title="Outstanding" value={fmt(m.outstandingAmount ?? 0)} icon={<IconAlertCircle size={20} />} />
        <MetricCard title="Overdue" value={m.overdueInvoices ?? 0} icon={<IconClock size={20} />} />
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <Paper p="lg" radius="md" withBorder>
          <Group justify="center" gap="xl">
            <RingProgress
              size={140}
              thickness={14}
              roundCaps
              sections={[{ value: paidRate, color: 'green' }]}
              label={<Center><Text fw={700} size="lg">{paidRate}%</Text></Center>}
            />
            <div>
              <Text fw={600} size="lg">Payment Rate</Text>
              <Text c="dimmed" size="sm">{paid} of {total} invoices paid</Text>
            </div>
          </Group>
        </Paper>
        <Paper p="lg" radius="md" withBorder>
          <Text fw={600} mb="md">Financial Summary</Text>
          <Stack gap="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Total Invoice Value</Text>
              <Text fw={600}>{fmt(m.totalInvoiceValue ?? 0)}</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Total Orders</Text>
              <Text fw={600}>{m.totalOrders ?? 0}</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Order Value</Text>
              <Text fw={600}>{fmt(m.orderValue ?? 0)}</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Companies</Text>
              <Text fw={600}>{m.totalCompanies ?? 0}</Text>
            </Group>
          </Stack>
        </Paper>
      </SimpleGrid>
    </Stack>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN DASHBOARD — Routes to role-specific view
// ═══════════════════════════════════════════════════════════
const DASHBOARD_MAP: Record<RoleName, React.FC<{ m: any }>> = {
  admin: AdminDashboard,
  sales_manager: SalesManagerDashboard,
  sales_rep: SalesRepDashboard,
  support_agent: SupportDashboard,
  ops_manager: OpsDashboard,
  marketing_manager: MarketingDashboard,
  finance_manager: FinanceDashboard,
};

export function DashboardPage() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: dashboardApi.getMetrics,
  });
  const user = useAuthStore((s) => s.user);
  const roleName = (user?.role?.name ?? 'admin') as RoleName;

  if (isLoading) return <LoadingSkeleton />;

  const DashboardComponent = DASHBOARD_MAP[roleName] || AdminDashboard;
  return <DashboardComponent m={metrics || {}} />;
}
