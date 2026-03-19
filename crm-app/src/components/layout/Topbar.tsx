import { Group, ActionIcon, Menu, Avatar, Text, Indicator, Badge, Box, Tooltip } from '@mantine/core';
import { IconSun, IconMoon, IconBell, IconLogout, IconUser, IconSettings } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth-store';
import { useUIStore } from '../../store/ui-store';
import { ROLE_LABELS } from '../../constants';

export function Topbar() {
  const { user, logout } = useAuthStore();
  const { colorScheme, toggleColorScheme } = useUIStore();
  const navigate = useNavigate();

  const fullName = user ? `${user.firstName} ${user.lastName}` : '';
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase();
  const roleLabel = user ? (ROLE_LABELS[user.role.name] ?? user.role.name) : '';

  return (
    <Box
      h={60}
      px="lg"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderBottom: '1px solid var(--mantine-color-default-border)',
        background: 'var(--mantine-color-body)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <Group gap="md">
        <Tooltip label={`Switch to ${colorScheme === 'dark' ? 'light' : 'dark'} mode`}>
          <ActionIcon variant="subtle" size="lg" onClick={toggleColorScheme} aria-label="Toggle color scheme" color="gray">
            {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Notifications">
          <Indicator inline processing size={8} offset={4} color="red">
            <ActionIcon variant="subtle" size="lg" onClick={() => navigate('/notifications')} aria-label="Notifications" color="gray">
              <IconBell size={18} />
            </ActionIcon>
          </Indicator>
        </Tooltip>

        <Menu shadow="lg" width={220} position="bottom-end" withArrow>
          <Menu.Target>
            <Group gap="xs" style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 8 }}>
              <Avatar src={user?.avatar} alt={fullName} radius="xl" size={36} color="indigo">
                {initials}
              </Avatar>
              <Box visibleFrom="sm">
                <Text size="sm" fw={500} lh={1.2}>{fullName}</Text>
                <Text size="xs" c="dimmed" lh={1.2}>{roleLabel}</Text>
              </Box>
            </Group>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>
              <Text size="sm" fw={600}>{fullName}</Text>
              <Text size="xs" c="dimmed">{user?.email}</Text>
              <Badge size="xs" variant="light" mt={4}>{roleLabel}</Badge>
            </Menu.Label>
            <Menu.Divider />
            <Menu.Item leftSection={<IconUser size={14} />} onClick={() => navigate('/settings')}>
              Profile
            </Menu.Item>
            <Menu.Item leftSection={<IconSettings size={14} />} onClick={() => navigate('/settings')}>
              Settings
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item leftSection={<IconLogout size={14} />} color="red" onClick={logout}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Box>
  );
}
