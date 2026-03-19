import { NavLink, ScrollArea, Stack, Text, Divider } from '@mantine/core';
import {
  IconDashboard, IconUsers, IconAddressBook, IconBuilding, IconCash,
  IconChecklist, IconTicket, IconPackage, IconFileInvoice, IconShoppingCart,
  IconChartBar, IconSettings, IconHistory, IconBell, IconTargetArrow,
} from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth-store';
import { APP_NAME } from '../../constants';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  to: string;
  module?: string;
}

const mainNav: NavItem[] = [
  { label: 'Dashboard', icon: <IconDashboard size={20} />, to: '/' },
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
  { label: 'Notifications', icon: <IconBell size={20} />, to: '/notifications' },
  { label: 'Audit Log', icon: <IconHistory size={20} />, to: '/audit-log', module: 'audit_logs' },
  { label: 'Settings', icon: <IconSettings size={20} />, to: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const renderNav = (items: NavItem[]) =>
    items
      .filter((item) => !item.module || hasPermission(item.module, 'view'))
      .map((item) => (
        <NavLink
          key={item.to}
          label={item.label}
          leftSection={item.icon}
          active={location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))}
          onClick={() => navigate(item.to)}
          variant="light"
        />
      ));

  return (
    <nav style={{ width: 260, height: '100vh', borderRight: '1px solid var(--mantine-color-default-border)' }}>
      <Stack gap={0} h="100%">
        <div style={{ padding: '16px 20px' }}>
          <Text fw={700} size="lg">{APP_NAME}</Text>
        </div>
        <ScrollArea flex={1} px="xs">
          <Stack gap={2}>
            {renderNav(mainNav)}
            <Divider my="sm" label="Commerce" labelPosition="left" />
            {renderNav(secondaryNav)}
            <Divider my="sm" label="Admin" labelPosition="left" />
            {renderNav(adminNav)}
          </Stack>
        </ScrollArea>
      </Stack>
    </nav>
  );
}
