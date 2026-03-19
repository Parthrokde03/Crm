import { Paper, Group, Text, ThemeIcon } from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import type { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: number;
  changeLabel?: string;
}

export function MetricCard({ title, value, icon, change, changeLabel }: MetricCardProps) {
  const isPositive = change && change > 0;
  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between">
        <Text size="xs" c="dimmed" tt="uppercase" fw={700}>{title}</Text>
        <ThemeIcon color="gray" variant="light" size={38} radius="md">
          {icon}
        </ThemeIcon>
      </Group>
      <Group align="flex-end" gap="xs" mt={25}>
        <Text fz={24} fw={700} lh={1}>{value}</Text>
        {change !== undefined && (
          <Text c={isPositive ? 'teal' : 'red'} fz="sm" fw={500} lh={1}>
            <Group gap={2}>
              {isPositive ? <IconArrowUpRight size={16} /> : <IconArrowDownRight size={16} />}
              {Math.abs(change)}%
            </Group>
          </Text>
        )}
      </Group>
      {changeLabel && <Text fz="xs" c="dimmed" mt={7}>{changeLabel}</Text>}
    </Paper>
  );
}
