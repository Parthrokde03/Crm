import { Outlet } from 'react-router-dom';
import { Box } from '@mantine/core';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useUIStore } from '../../store/ui-store';

export function AppShell() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const sidebarWidth = collapsed ? 72 : 260;

  return (
    <Box style={{ display: 'flex', minHeight: '100vh', background: 'var(--mantine-color-body)' }}>
      <Sidebar />
      <Box
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: sidebarWidth,
          transition: 'margin-left 200ms ease',
          minWidth: 0,
        }}
      >
        <Topbar />
        <Box
          component="main"
          style={{
            flex: 1,
            padding: '24px 32px',
            overflow: 'auto',
            maxWidth: 1440,
            width: '100%',
            margin: '0 auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
