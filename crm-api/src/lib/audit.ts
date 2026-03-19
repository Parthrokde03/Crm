import { prisma } from './prisma.js';

export async function logAudit(params: {
  userId: string;
  action: string;
  module: string;
  entityId: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
  ipAddress?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        module: params.module,
        entityId: params.entityId,
        changes: params.changes || undefined,
        ipAddress: params.ipAddress,
      },
    });
  } catch (err) {
    // Don't let audit logging failures break the main operation
    console.error('Audit log error:', err);
  }
}
