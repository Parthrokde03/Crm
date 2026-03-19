import { Paper, Text, Group, Select, Box } from '@mantine/core';
import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  timeRanges?: string[];
  selectedRange?: string;
  onRangeChange?: (range: string) => void;
}

export function ChartCard({ title, subtitle, children, timeRanges, selectedRange, onRangeChange }: ChartCardProps) {
  return (
    <Paper withBorder p="lg" radius="md">
      <Group justify="space-between" mb="md">
        <Box>
          <Text fw={600} size="md">{title}</Text>
          {subtitle && <Text size="xs" c="dimmed">{subtitle}</Text>}
        </Box>
        {timeRanges && (
          <Select
            size="xs"
            w={120}
            data={timeRanges}
            value={selectedRange}
            onChange={(v) => v && onRangeChange?.(v)}
            allowDeselect={false}
          />
        )}
      </Group>
      {children}
    </Paper>
  );
}
