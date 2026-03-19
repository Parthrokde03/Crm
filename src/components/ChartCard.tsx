import { Paper, Text, Group, Select } from '@mantine/core';
import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  children: ReactNode;
  timeRanges?: string[];
  selectedRange?: string;
  onRangeChange?: (range: string) => void;
}

export function ChartCard({ title, children, timeRanges, selectedRange, onRangeChange }: ChartCardProps) {
  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between" mb="md">
        <Text fw={500}>{title}</Text>
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
