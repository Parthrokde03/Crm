import { SimpleGrid, Stack } from '@mantine/core';
import { IconUsers, IconCash, IconTargetArrow, IconTicket } from '@tabler/icons-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PageHeader } from '../../components/PageHeader';
import { MetricCard } from '../../components/MetricCard';
import { ChartCard } from '../../components/ChartCard';

// Placeholder data — replace with real API calls
const pipelineData = [
  { stage: 'Prospecting', value: 12 },
  { stage: 'Qualification', value: 8 },
  { stage: 'Proposal', value: 5 },
  { stage: 'Negotiation', value: 3 },
  { stage: 'Won', value: 7 },
];

const leadSourceData = [
  { name: 'Website', value: 35 },
  { name: 'Referral', value: 25 },
  { name: 'Cold Call', value: 20 },
  { name: 'Social', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#228be6', '#40c057', '#fab005', '#fa5252', '#7950f2'];

export function DashboardPage() {
  return (
    <Stack>
      <PageHeader title="Dashboard" />

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        <MetricCard title="Total Leads" value="248" icon={<IconTargetArrow size={20} />} change={12.5} changeLabel="vs last month" />
        <MetricCard title="Active Deals" value="$142K" icon={<IconCash size={20} />} change={8.2} changeLabel="pipeline value" />
        <MetricCard title="Contacts" value="1,024" icon={<IconUsers size={20} />} change={3.1} changeLabel="vs last month" />
        <MetricCard title="Open Tickets" value="18" icon={<IconTicket size={20} />} change={-5.4} changeLabel="vs last week" />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <ChartCard title="Deal Pipeline">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pipelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="#228be6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Lead Sources">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={leadSourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                {leadSourceData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </SimpleGrid>
    </Stack>
  );
}
