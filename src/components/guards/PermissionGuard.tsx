import { useAuthStore } from '../../store/auth-store';
import type { Permission } from '../../types';

interface PermissionGuardProps {
  module: string;
  action: Permission['actions'][number];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/** Conditionally renders children based on user permission. */
export function PermissionGuard({ module, action, children, fallback = null }: PermissionGuardProps) {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  return hasPermission(module, action) ? <>{children}</> : <>{fallback}</>;
}
