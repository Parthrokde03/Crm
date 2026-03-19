import { Badge } from '@mantine/core';

interface StatusBadgeProps {
  status: string;
  colorMap: Record<string, string>;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, colorMap, size = 'sm' }: StatusBadgeProps) {
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <Badge color={colorMap[status] || 'gray'} size={size} variant="light">
      {label}
    </Badge>
  );
}
