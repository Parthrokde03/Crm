import { NavLink, ScrollArea, Stack, Text, Divider, Box, Group, Tooltip, Avatar, UnstyledButton } from '@mantine/core';
import {
  IconDashboard, IconUsers, IconAddressBook, IconBuilding, IconCash,
  IconChecklist, IconTicket, IconPackage, IconFileInvoice, IconShoppingCart,
  IconChartBar, IconSettings, IconHistory, IconBell, IconTargetArrow,
  IconChevronLeft, IconChevronRight, IconLogout,
} from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth-store';
import { useUIStore } from '../../store/ui-store';
import { APP_NAME, ROLE_LABELS } from '../../constants';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  to: string;
  module?: string;
}

const mainNav: NavItem[] = [
  { label: 'Dashboard', icon: <IconDashboard size={20} />, to: '/', module: 'dashboard' },
  { label: 'Leads', icon: <IconTargetArrow size={20} />, to: '/leads', module: 'leads' },
  { label: 'Contacts', icon: <IconAddressBook size={20} />, to: '/contacts', module: 'contacts' },
  { label: 'Companies', icon: <IconBuilding size={20} />, to: '/companies', module: 'companies' },
  { label: 'Deals', icon: <IconCash size={20} />, to: '/deals', module: 'deals' },
  { label: 'Tasks', icon: <IconChecklist size={20} />, to: '/tasks', module: 'tasks' },
  { label: 'Tickets', icon: <IconTicket size={20} />, to: '/tickets', module: 'tickets' },
];

const secondaryNav: NavItem[] = [
  { label: 'Products', icon: <IconPackage size={20} />, to: '/products', module: 'products' },
  { label: 'Orders', icon: <IconShoppingCart size={20} />, to: '/orders', module: 'orders' },
  { label: 'Invoices', icon: <IconFileInvoice size={20} />, to: '/invoices', module: 'invoices' },
];

const adminNav: NavItem[] = [
  { label: 'Users', icon: <IconUsers size={20} />, to: '/users', module: 'users' },
  { label: 'Reports', icon: <IconChartBar size={20} />, to: '/reports', module: 'reports' },
  { label: 'Notifications', icon: <IconBell size={20} />, to: '/notifications', module: 'notifications' },
  { label: 'Audit Log', icon: <IconHistory size={20} />, to: '/audit-log', module: 'audit_logs' },
  { label: 'Settings', icon: <IconSettings size={20} />, to: '/settings', module: 'settings' },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  const visibleItems = (items: NavItem[]) =>
    items.filter((item) => !item.module || hasPermission(item.module, 'view'));

  const isActive = (to: string) =>
    location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  const renderNav = (items: NavItem[]) =>
    visibleItems(items).map((item) =>
      sidebarCollapsed ? (
        <Tooltip key={item.to} label={item.label} position="right" withArrow>
          <NavLink
            label=""
            leftSection={item.icon}
            active={isActive(item.to)}
            onClick={() => navigate(item.to)}
            variant="light"
            style={{ padding: '10px 0', justifyContent: 'center' }}
          />
        </Tooltip>
      ) : (
        <NavLink
          key={item.to}
          label={item.label}
          leftSection={item.icon}
          active={isActive(item.to)}
          onClick={() => navigate(item.to)}
          variant="light"
        />
      ),
    );

  const hasCommerce = visibleItems(secondaryNav).length > 0;
  const hasAdmin = visibleItems(adminNav).length > 0;
  const fullName = user ? `${user.firstName} ${user.lastName}` : '';
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase();
  const roleLabel = user ? (ROLE_LABELS[user.role.name] ?? user.role.name) : '';

  return (
    <Box
      component="nav"
      style={{
        width: sidebarCollapsed ? 72 : 260,
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100,
        borderRight: '1px solid var(--mantine-color-default-border)',
        background: 'var(--mantine-color-body)',
        transition: 'width 200ms ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Logo */}
      <Group
        h={60}
        px={sidebarCollapsed ? 'xs' : 'md'}
        justify={sidebarCollapsed ? 'center' : 'space-between'}
        style={{ borderBottom: '1px solid var(--mantine-color-default-border)', flexShrink: 0 }}
      >
        {!sidebarCollapsed && (
          <Group gap="xs">
            <Box
              style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'var(--mantine-color-indigo-filled)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Text c="white" fw={700} size="sm">C</Text>
            </Box>
            <Text fw={700} size="md">{APP_NAME}</Text>
          </Group>
        )}
        <UnstyledButton onClick={toggleSidebar} style={{ display: 'flex', alignItems: 'center', padding: 4, borderRadius: 6 }}>
          {sidebarCollapsed ? <IconChevronRight size={18} /> : <IconChevronLeft size={18} />}
        </UnstyledButton>
      </Group>

      {/* Navigation */}
      <ScrollArea flex={1} px={sidebarCollapsed ? 6 : 'xs'} py="sm">
        <Stack gap={2}>
          {renderNav(mainNav)}
          {hasCommerce && (
            <>
              {!sidebarCollapsed ? (
                <Divider my="sm" label="Commerce" labelPosition="left" />
              ) : (
                <Divider my="sm" />
              )}
              {renderNav(secondaryNav)}
            </>
          )}
          {hasAdmin && (
            <>
              {!sidebarCollapsed ? (
                <Divider my="sm" label="Admin" labelPosition="left" />
              ) : (
                <Divider my="sm" />
              )}
              {renderNav(adminNav)}
            </>
          )}
        </Stack>
      </ScrollArea>

      {/* User section at bottom */}
      <Box
        style={{
          borderTop: '1px solid var(--mantine-color-default-border)',
          padding: sidebarCollapsed ? '12px 6px' : '12px 16px',
          flexShrink: 0,
        }}
      >
        {sidebarCollapsed ? (
          <Tooltip label={`${fullName} — ${roleLabel}`} position="right" withArrow>
            <UnstyledButton onClick={logout} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Avatar size="sm" color="indigo" radius="xl">{initials}</Avatar>
            </UnstyledButton>
          </Tooltip>
        ) : (
          <Group justify="space-between">
            <Group gap="sm" style={{ overflow: 'hidden', flex: 1 }}>
              <Avatar size="sm" color="indigo" radius="xl">{initials}</Avatar>
              <Box style={{ overflow: 'hidden' }}>
                <Text size="sm" fw={500} truncate>{fullName}</Text>
                <Text size="xs" c="dimmed" truncate>{roleLabel}</Text>
              </Box>
            </Group>
            <Tooltip label="Logout" position="right">
              <UnstyledButton onClick={logout} style={{ display: 'flex', padding: 4 }}>
                <IconLogout size={16} color="var(--mantine-color-dimmed)" />
              </UnstyledButton>
            </Tooltip>
          </Group>
        )}
      </Box>
    </Box>
  );
}
