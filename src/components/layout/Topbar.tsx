import { Group, ActionIcon, Menu, Avatar, Text, Indicator } from '@mantine/core';
import { IconSun, IconMoon, IconBell, IconLogout, IconUser } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth-store';
import { useUIStore } from '../../store/ui-store';

export function Topbar() {
  const { user, logout } = useAuthStore();
  const { colorScheme, toggleColorScheme } = useUIStore();
  const navigate = useNavigate();

  const fullName = user ? `${user.firstName} ${user.lastName}` : '';
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Group
      h={60}
      px="md"
      justify="flex-end"
      style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}
    >
      <Group gap="sm">
        <ActionIcon variant="default" size="lg" onClick={toggleColorScheme} aria-label="Toggle color scheme">
          {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
        </ActionIcon>

        <Indicator inline processing size={8} offset={4}>
          <ActionIcon variant="default" size="lg" onClick={() => navigate('/notifications')} aria-label="Notifications">
            <IconBell size={18} />
          </ActionIcon>
        </Indicator>

        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <Avatar
              src={user?.avatar}
              alt={fullName}
              radius="xl"
              size="md"
              color="blue"
              style={{ cursor: 'pointer' }}
            >
              {initials}
            </Avatar>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>
              <Text size="sm" fw={500}>{fullName}</Text>
              <Text size="xs" c="dimmed">{user?.email}</Text>
            </Menu.Label>
            <Menu.Divider />
            <Menu.Item leftSection={<IconUser size={14} />} onClick={() => navigate('/settings/profile')}>
              Profile
            </Menu.Item>
            <Menu.Item leftSection={<IconLogout size={14} />} color="red" onClick={logout}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
}
