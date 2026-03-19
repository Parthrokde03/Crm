import { Paper, Group, Text, ThemeIcon, Box } from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import type { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: number;
  changeLabel?: string;
  color?: string;
}

export function MetricCard({ title, value, icon, change, changeLabel, color = 'indigo' }: MetricCardProps) {
  const isPositive = change && change > 0;
  return (
    <Paper withBorder p="lg" radius="md">
      <Group justify="space-between" mb="xs">
        <Text size="xs" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: '0.05em' }}>
          {title}
        </Text>
        <ThemeIcon color={color} variant="light" size={40} radius="md">
          {icon}
        </ThemeIcon>
      </Group>
      <Box>
        <Text fz={28} fw={700} lh={1.1}>{value}</Text>
        {change !== undefined && (
          <Group gap={4} mt={8}>
            <Text c={isPositive ? 'teal' : 'red'} fz="sm" fw={600}>
              <Group gap={2}>
                {isPositive ? <IconArrowUpRight size={16} /> : <IconArrowDownRight size={16} />}
                {Math.abs(change)}%
              </Group>
            </Text>
            {changeLabel && <Text fz="xs" c="dimmed">{changeLabel}</Text>}
          </Group>
        )}
      </Box>
    </Paper>
  );
}
