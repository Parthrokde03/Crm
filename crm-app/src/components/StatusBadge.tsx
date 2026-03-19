import { Badge, Group, Box } from '@mantine/core';

interface StatusBadgeProps {
  status: string;
  colorMap: Record<string, string>;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  withDot?: boolean;
}

export function StatusBadge({ status, colorMap, size = 'sm', withDot = true }: StatusBadgeProps) {
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const color = colorMap[status] || 'gray';
  return (
    <Badge color={color} size={size} variant="light" radius="sm" leftSection={
      withDot ? (
        <Box
          style={{
            width: 6, height: 6, borderRadius: '50%',
            background: `var(--mantine-color-${color}-filled)`,
          }}
        />
      ) : undefined
    }>
      {label}
    </Badge>
  );
}
