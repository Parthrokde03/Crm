import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth.js';
import { prisma } from '../lib/prisma.js';

type Action = 'view' | 'create' | 'edit' | 'delete' | 'export';
type Scope = 'own' | 'team' | 'all';

interface PermissionEntry {
  module: string;
  actions: Action[];
  scope: Scope;
}

/**
 * Middleware that checks if the authenticated user has the required
 * permission (module + action). Attaches `req.permScope` so downstream
 * handlers can filter by own/team/all.
 */
export function requirePermission(module: string, action: Action) {
  return async (req: AuthRequest & { permScope?: Scope }, res: Response, next: NextFunction) => {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized', code: 'UNAUTHORIZED' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { role: true },
    });

    if (!user) {
      res.status(401).json({ message: 'User not found', code: 'NOT_FOUND' });
      return;
    }

    // Admin bypasses all checks
    if (user.role.name === 'admin') {
      req.permScope = 'all';
      next();
      return;
    }

    const permissions = user.role.permissions as PermissionEntry[];
    const perm = permissions.find((p) => p.module === module);

    if (!perm || !perm.actions.includes(action)) {
      res.status(403).json({
        message: `Access denied: ${action} on ${module}`,
        code: 'FORBIDDEN',
      });
      return;
    }

    req.permScope = perm.scope;
    next();
  };
}

/**
 * Builds a Prisma `where` clause that filters records based on the
 * user's permission scope. Models must have an `assignedToId` field
 * for own/team filtering to work.
 */
export function buildScopeFilter(
  scope: Scope | undefined,
  userId: string,
  _teamId?: string | null,
): Record<string, unknown> {
  if (!scope || scope === 'all') return {};
  if (scope === 'own') return { assignedToId: userId };
  // 'team' — for now treat same as 'all' since team structure isn't
  // fully implemented. When teams are added, filter by teamId.
  return {};
}
