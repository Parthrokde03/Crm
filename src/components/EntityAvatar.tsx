import { Avatar } from '@mantine/core';

interface EntityAvatarProps {
  name: string;
  src?: string;
  size?: number | 'sm' | 'md' | 'lg';
  color?: string;
}

export function EntityAvatar({ name, src, size = 'md', color = 'blue' }: EntityAvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Avatar src={src} alt={name} size={size} color={color} radius="xl">
      {initials}
    </Avatar>
  );
}
