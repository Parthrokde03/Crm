import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';

export const dashboardRouter = Router();
dashboardRouter.use(authMiddleware);

interface PermEntry { module: string; actions: string[]; scope: string; }

function hasPerm(permissions: PermEntry[], mod: string): boolean {
  return permissions.some(p => p.module === mod && p.actions.includes('view'));
}

function scopeFilter(permissions: PermEntry[], mod: string, userId: string): Record<string, unknown> {
  const perm = permissions.find(p => p.module === mod);
  if (!perm || perm.scope === 'all') return {};
  if (perm.scope === 'own') return { assignedToId: userId };
  return {}; // team — treat as all for now
}

dashboardRouter.get('/metrics', async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      include: { role: true },
    });
    if (!user) { res.status(401).json({ message: 'User not found' }); return; }

    const roleName = user.role.name;
    const perms = user.role.permissions as PermEntry[];
    const isAdmin = roleName === 'admin';
    const uid = user.id;

    // Build response based on what this role can see
    const result: Record<string, unknown> = { role: roleName };

    // --- Leads metrics (admin, sales_manager, sales_rep, marketing_manager) ---
    if (isAdmin || hasPerm(perms, 'leads')) {
      const where = isAdmin ? {} : scopeFilter(perms, 'leads', uid);
      const [totalLeads, leadsByStatus, leadsBySource] = await Promise.all([
        prisma.lead.count({ where }),
        prisma.lead.groupBy({ by: ['status'], _count: true, where }),
        prisma.lead.groupBy({ by: ['source'], _count: true, where }),
      ]);
      result.totalLeads = totalLeads;
      result.leadsByStatus = leadsByStatus.map(l => ({ status: l.status, count: l._count }));
      result.leadsBySource = leadsBySource.map(l => ({ source: l.source, count: l._count }));
    }

    // --- Contacts metrics ---
    if (isAdmin || hasPerm(perms, 'contacts')) {
      const where = isAdmin ? {} : scopeFilter(perms, 'contacts', uid);
      result.totalContacts = await prisma.contact.count({ where });
    }

    // --- Companies metrics ---
    if (isAdmin || hasPerm(perms, 'companies')) {
      result.totalCompanies = await prisma.company.count();
    }

    // --- Deals metrics (admin, sales_manager, sales_rep) ---
    if (isAdmin || hasPerm(perms, 'deals')) {
      const where = isAdmin ? {} : scopeFilter(perms, 'deals', uid);
      const [totalDeals, dealsByStage, dealValues] = await Promise.all([
        prisma.deal.count({ where }),
        prisma.deal.groupBy({ by: ['stage'], _count: true, where }),
        prisma.deal.aggregate({ _sum: { value: true }, where: { ...where, stage: 'closed_won' } }),
      ]);
      result.totalDeals = totalDeals;
      result.dealsByStage = dealsByStage.map(d => ({ stage: d.stage, count: d._count }));
      result.totalRevenue = dealValues._sum.value || 0;
    }

    // --- Tickets metrics (admin, support_agent) ---
    if (isAdmin || hasPerm(perms, 'tickets')) {
      const where = isAdmin ? {} : scopeFilter(perms, 'tickets', uid);
      const [openTickets, totalTickets, ticketsByPriority, ticketsByStatus] = await Promise.all([
        prisma.ticket.count({ where: { ...where, status: { in: ['open', 'in_progress', 'waiting'] } } }),
        prisma.ticket.count({ where }),
        prisma.ticket.groupBy({ by: ['priority'], _count: true, where }),
        prisma.ticket.groupBy({ by: ['status'], _count: true, where }),
      ]);
      result.openTickets = openTickets;
      result.totalTickets = totalTickets;
      result.resolvedTickets = totalTickets - openTickets;
      result.ticketsByPriority = ticketsByPriority.map(t => ({ priority: t.priority, count: t._count }));
      result.ticketsByStatus = ticketsByStatus.map(t => ({ status: t.status, count: t._count }));
    }

    // --- Tasks metrics ---
    if (isAdmin || hasPerm(perms, 'tasks')) {
      const where = isAdmin ? {} : scopeFilter(perms, 'tasks', uid);
      const [totalTasks, pendingTasks] = await Promise.all([
        prisma.task.count({ where }),
        prisma.task.count({ where: { ...where, status: { in: ['todo', 'in_progress'] } } }),
      ]);
      result.totalTasks = totalTasks;
      result.pendingTasks = pendingTasks;
    }

    // --- Products metrics (admin, ops_manager) ---
    if (isAdmin || hasPerm(perms, 'products')) {
      result.totalProducts = await prisma.product.count();
      result.activeProducts = await prisma.product.count({ where: { isActive: true } });
    }

    // --- Orders metrics (admin, ops_manager, finance_manager) ---
    if (isAdmin || hasPerm(perms, 'orders')) {
      const [totalOrders, orderTotals] = await Promise.all([
        prisma.order.count(),
        prisma.order.aggregate({ _sum: { total: true } }),
      ]);
      result.totalOrders = totalOrders;
      result.orderValue = orderTotals._sum.total || 0;
    }

    // --- Invoices metrics (admin, ops_manager, finance_manager) ---
    if (isAdmin || hasPerm(perms, 'invoices')) {
      const [totalInvoices, paidInvoices, overdueInvoices, invoiceTotals, paidTotals] = await Promise.all([
        prisma.invoice.count(),
        prisma.invoice.count({ where: { status: 'paid' } }),
        prisma.invoice.count({ where: { status: 'overdue' } }),
        prisma.invoice.aggregate({ _sum: { total: true } }),
        prisma.invoice.aggregate({ _sum: { total: true }, where: { status: 'paid' } }),
      ]);
      result.totalInvoices = totalInvoices;
      result.paidInvoices = paidInvoices;
      result.overdueInvoices = overdueInvoices;
      result.totalInvoiceValue = invoiceTotals._sum.total || 0;
      result.totalPaidInvoices = paidTotals._sum.total || 0;
      result.outstandingAmount = (invoiceTotals._sum.total || 0) - (paidTotals._sum.total || 0);
    }

    res.json(result);
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Internal server error', code: 'SERVER_ERROR' });
  }
});
