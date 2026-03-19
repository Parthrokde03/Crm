import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth-store';
import type { PermissionAction } from '../../types';

interface PermissionGuardProps {
  module: string;
  action: PermissionAction;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  /** If true, redirects to / instead of rendering fallback */
  redirect?: boolean;
}

/** Conditionally renders children based on user permission. */
export function PermissionGuard({ module, action, children, fallback = null, redirect }: PermissionGuardProps) {
  const hasPermission = useAuthStore((s) => s.hasPermission);

  if (!hasPermission(module, action)) {
    if (redirect) return <Navigate to="/" replace />;
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
