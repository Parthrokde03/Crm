import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth-store';
import type { RoleName } from '../../types';

interface RoleGuardProps {
  roles: RoleName[];
  children: React.ReactNode;
}

export function RoleGuard({ roles, children }: RoleGuardProps) {
  const hasRole = useAuthStore((s) => s.hasRole);

  if (!hasRole(roles)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
