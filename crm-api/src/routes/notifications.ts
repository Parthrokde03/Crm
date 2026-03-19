import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';

export const notificationsRouter = Router();
notificationsRouter.use(authMiddleware);

// List notifications for current user
notificationsRouter.get('/', async (req: AuthRequest, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.min(100, parseInt(req.query.pageSize as string) || 20);

    const where: any = { userId: req.userId };
    if (req.query.isRead === 'true') where.isRead = true;
    if (req.query.isRead === 'false') where.isRead = false;

    const [data, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId: req.userId, isRead: false } }),
    ]);

    res.json({
      data,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
      unreadCount,
    });
  } catch (err) {
    console.error('List notifications error:', err);
    res.status(500).json({ message: 'Internal server error', code: 'SERVER_ERROR' });
  }
});

// Mark single notification as read
notificationsRouter.put('/:id/read', async (req: AuthRequest, res) => {
  try {
    const updated = await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true },
    });
    res.json(updated);
  } catch (err: any) {
    if (err.code === 'P2025') res.status(404).json({ message: 'Not found', code: 'NOT_FOUND' });
    else res.status(500).json({ message: 'Internal server error', code: 'SERVER_ERROR' });
  }
});

// Mark all as read for current user
notificationsRouter.post('/mark-all-read', async (req: AuthRequest, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.userId, isRead: false },
      data: { isRead: true },
    });
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error('Mark all read error:', err);
    res.status(500).json({ message: 'Internal server error', code: 'SERVER_ERROR' });
  }
});

// Delete a notification
notificationsRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.notification.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err: any) {
    if (err.code === 'P2025') res.status(404).json({ message: 'Not found', code: 'NOT_FOUND' });
    else res.status(500).json({ message: 'Internal server error', code: 'SERVER_ERROR' });
  }
});
