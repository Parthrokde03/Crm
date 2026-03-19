import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

export const reportsRouter = Router();
reportsRouter.use(authMiddleware);
reportsRouter.use(requirePermission('reports', 'view'));

// Sales overview report
reportsRouter.get('/sales', async (_req, res) => {
  try {
    const [
      dealsByStage, dealsByMonth, topReps,
      wonDeals, lostDeals, totalPipeline,
    ] = await Promise.all([
      prisma.deal.groupBy({ by: ['stage'], _count: true, _sum: { value: true } }),
      prisma.$queryRaw`
        SELECT TO_CHAR("createdAt", 'YYYY-MM') as month,
               COUNT(*)::int as count,
               COALESCE(SUM(value), 0)::float as value
        FROM "Deal"
        GROUP BY month ORDER BY month DESC LIMIT 12
      ` as Promise<{ month: string; count: number; value: number }[]>,
      prisma.$queryRaw`
        SELECT u."firstName" || ' ' || u."lastName" as name,
               COUNT(d.id)::int as deals,
               COALESCE(SUM(d.value), 0)::float as revenue
        FROM "Deal" d JOIN "User" u ON d."assignedToId" = u.id
        WHERE d.stage = 'closed_won'
        GROUP BY u.id, u."firstName", u."lastName"
        ORDER BY revenue DESC LIMIT 10
      ` as Promise<{ name: string; deals: number; revenue: number }[]>,
      prisma.deal.aggregate({ where: { stage: 'closed_won' }, _count: true, _sum: { value: true } }),
      prisma.deal.aggregate({ where: { stage: 'closed_lost' }, _count: true, _sum: { value: true } }),
      prisma.deal.aggregate({
        where: { stage: { notIn: ['closed_won', 'closed_lost'] } },
        _count: true, _sum: { value: true },
      }),
    ]);

    res.json({
      dealsByStage: dealsByStage.map(d => ({
        stage: d.stage, count: d._count, value: d._sum.value || 0,
      })),
      dealsByMonth,
      topReps,
      summary: {
        wonCount: wonDeals._count, wonValue: wonDeals._sum.value || 0,
        lostCount: lostDeals._count, lostValue: lostDeals._sum.value || 0,
        pipelineCount: totalPipeline._count, pipelineValue: totalPipeline._sum.value || 0,
      },
    });
  } catch (err) {
    console.error('Sales report error:', err);
    res.status(500).json({ message: 'Internal server error', code: 'SERVER_ERROR' });
  }
});

// Leads report
reportsRouter.get('/leads', async (_req, res) => {
  try {
    const [byStatus, bySource, byMonth, conversionRate] = await Promise.all([
      prisma.lead.groupBy({ by: ['status'], _count: true }),
      prisma.lead.groupBy({ by: ['source'], _count: true }),
      prisma.$queryRaw`
        SELECT TO_CHAR("createdAt", 'YYYY-MM') as month,
               COUNT(*)::int as count
        FROM "Lead"
        GROUP BY month ORDER BY month DESC LIMIT 12
      ` as Promise<{ month: string; count: number }[]>,
      Promise.all([
        prisma.lead.count(),
        prisma.lead.count({ where: { status: 'converted' } }),
      ]),
    ]);

    const [total, converted] = conversionRate;
    res.json({
      byStatus: byStatus.map(l => ({ status: l.status, count: l._count })),
      bySource: bySource.map(l => ({ source: l.source, count: l._count })),
      byMonth,
      total,
      converted,
      conversionRate: total > 0 ? ((converted / total) * 100).toFixed(1) : '0',
    });
  } catch (err) {
    console.error('Leads report error:', err);
    res.status(500).json({ message: 'Internal server error', code: 'SERVER_ERROR' });
  }
});

// Tickets report
reportsRouter.get('/tickets', async (_req, res) => {
  try {
    const [byStatus, byPriority, byCategory, avgResolution] = await Promise.all([
      prisma.ticket.groupBy({ by: ['status'], _count: true }),
      prisma.ticket.groupBy({ by: ['priority'], _count: true }),
      prisma.ticket.groupBy({ by: ['category'], _count: true }),
      prisma.$queryRaw`
        SELECT AVG(EXTRACT(EPOCH FROM ("resolvedAt" - "createdAt")) / 3600)::float as avg_hours
        FROM "Ticket"
        WHERE "resolvedAt" IS NOT NULL
      ` as Promise<{ avg_hours: number | null }[]>,
    ]);

    res.json({
      byStatus: byStatus.map(t => ({ status: t.status, count: t._count })),
      byPriority: byPriority.map(t => ({ priority: t.priority, count: t._count })),
      byCategory: byCategory.filter(t => t.category).map(t => ({ category: t.category, count: t._count })),
      avgResolutionHours: avgResolution[0]?.avg_hours ?? null,
    });
  } catch (err) {
    console.error('Tickets report error:', err);
    res.status(500).json({ message: 'Internal server error', code: 'SERVER_ERROR' });
  }
});

// Revenue report
reportsRouter.get('/revenue', async (_req, res) => {
  try {
    const [invoicesByStatus, invoicesByMonth, paidTotal, overdueTotal] = await Promise.all([
      prisma.invoice.groupBy({ by: ['status'], _count: true, _sum: { total: true } }),
      prisma.$queryRaw`
        SELECT TO_CHAR("createdAt", 'YYYY-MM') as month,
               COUNT(*)::int as count,
               COALESCE(SUM(total), 0)::float as total
        FROM "Invoice"
        GROUP BY month ORDER BY month DESC LIMIT 12
      ` as Promise<{ month: string; count: number; total: number }[]>,
      prisma.invoice.aggregate({ where: { status: 'paid' }, _sum: { total: true } }),
      prisma.invoice.aggregate({ where: { status: 'overdue' }, _sum: { total: true } }),
    ]);

    res.json({
      invoicesByStatus: invoicesByStatus.map(i => ({
        status: i.status, count: i._count, total: i._sum.total || 0,
      })),
      invoicesByMonth,
      paidTotal: paidTotal._sum.total || 0,
      overdueTotal: overdueTotal._sum.total || 0,
    });
  } catch (err) {
    console.error('Revenue report error:', err);
    res.status(500).json({ message: 'Internal server error', code: 'SERVER_ERROR' });
  }
});
