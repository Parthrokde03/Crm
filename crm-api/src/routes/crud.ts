import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';
import { requirePermission, buildScopeFilter } from '../middleware/rbac.js';
import { logAudit } from '../lib/audit.js';
import bcrypt from 'bcryptjs';

type ModelName = 'lead' | 'contact' | 'company' | 'deal' | 'task' | 'ticket' |
  'product' | 'order' | 'invoice' | 'user' | 'activity' | 'note' |
  'notification' | 'auditLog';

// Map model name → CRM module name for permission checks
const MODEL_TO_MODULE: Record<ModelName, string> = {
  lead: 'leads', contact: 'contacts', company: 'companies', deal: 'deals',
  task: 'tasks', ticket: 'tickets', product: 'products', order: 'orders',
  invoice: 'invoices', user: 'users', activity: 'leads', note: 'leads',
  notification: 'notifications', auditLog: 'audit_logs',
};

// Models that support scope filtering via assignedToId
const SCOPE_FILTERABLE: Set<ModelName> = new Set([
  'lead', 'contact', 'deal', 'task', 'ticket',
]);

// Eager loading includes
const MODEL_INCLUDES: Partial<Record<ModelName, object>> = {
  lead: { assignedTo: { include: { role: true } } },
  contact: { company: true, assignedTo: { include: { role: true } } },
  deal: { contact: true, company: true, assignedTo: { include: { role: true } } },
  task: { assignedTo: { include: { role: true } } },
  ticket: { contact: true, assignedTo: { include: { role: true } } },
  order: { contact: true, company: true, items: { include: { product: true } } },
  invoice: { contact: true, company: true, items: { include: { product: true } } },
  user: { role: true },
  activity: { user: { include: { role: true } } },
  note: { author: { include: { role: true } } },
  auditLog: { user: { include: { role: true } } },
};

// Searchable text fields per model
const SEARCH_FIELDS: Partial<Record<ModelName, string[]>> = {
  lead: ['firstName', 'lastName', 'email', 'company'],
  contact: ['firstName', 'lastName', 'email'],
  company: ['name', 'industry'],
  deal: ['title', 'description'],
  task: ['title', 'description'],
  ticket: ['subject', 'description'],
  product: ['name', 'sku', 'category'],
  order: ['orderNumber'],
  invoice: ['invoiceNumber'],
  user: ['firstName', 'lastName', 'email'],
  activity: ['title'],
  note: ['content'],
};

export function crudRouter(modelName: ModelName): Router {
  const router = Router();
  router.use(authMiddleware);

  const getModel = () => (prisma as any)[modelName];
  const includes = MODEL_INCLUDES[modelName] || {};
  const searchFields = SEARCH_FIELDS[modelName] || [];
  const moduleName = MODEL_TO_MODULE[modelName];
  const isScopeFilterable = SCOPE_FILTERABLE.has(modelName);

  // LIST — requires 'view' permission, applies scope filter
  router.get('/', requirePermission(moduleName, 'view'), async (req: AuthRequest & { permScope?: string }, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize as string) || 20));
      const sortBy = (req.query.sortBy as string) || 'createdAt';
      const sortOrder = (req.query.sortOrder as string) === 'asc' ? 'asc' : 'desc';
      const search = req.query.search as string;

      // Build where clause with scope filtering
      let where: any = {};

      if (isScopeFilterable && req.userId) {
        const scopeFilter = buildScopeFilter(req.permScope as any, req.userId);
        where = { ...where, ...scopeFilter };
      }

      if (search && searchFields.length > 0) {
        where.OR = searchFields.map(field => ({
          [field]: { contains: search, mode: 'insensitive' },
        }));
      }

      const filterKeys = ['status', 'priority', 'source', 'stage', 'size', 'category',
        'assignedToId', 'contactId', 'companyId', 'relatedType', 'relatedId',
        'isActive', 'type', 'userId'];
      for (const key of filterKeys) {
        if (req.query[key] !== undefined) {
          const val = req.query[key] as string;
          if (val === 'true') where[key] = true;
          else if (val === 'false') where[key] = false;
          else where[key] = val;
        }
      }

      const [data, total] = await Promise.all([
        getModel().findMany({
          where, include: includes,
          orderBy: { [sortBy]: sortOrder },
          skip: (page - 1) * pageSize, take: pageSize,
        }),
        getModel().count({ where }),
      ]);

      const safeData = modelName === 'user'
        ? data.map(({ password, ...rest }: any) => rest)
        : modelName === 'auditLog'
        ? data.map((log: any) => {
            if (log.user) { const { password, ...safeUser } = log.user; return { ...log, user: safeUser }; }
            return log;
          })
        : data;

      res.json({ data: safeData, meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) } });
    } catch (err) {
      console.error(`List ${modelName} error:`, err);
      res.status(500).json({ message: 'Internal server error', code: 'SERVER_ERROR' });
    }
  });

  // GET by ID — requires 'view' permission
  router.get('/:id', requirePermission(moduleName, 'view'), async (req, res) => {
    try {
      const item = await getModel().findUnique({ where: { id: req.params.id }, include: includes });
      if (!item) { res.status(404).json({ message: 'Not found', code: 'NOT_FOUND' }); return; }
      if (modelName === 'user') {
        const { password, ...safe } = item as any;
        res.json(safe);
      } else if (modelName === 'auditLog' && (item as any).user) {
        const { password, ...safeUser } = (item as any).user;
        res.json({ ...item, user: safeUser });
      } else {
        res.json(item);
      }
    } catch (err) {
      console.error(`Get ${modelName} error:`, err);
      res.status(500).json({ message: 'Internal server error', code: 'SERVER_ERROR' });
    }
  });

  // CREATE — requires 'create' permission
  router.post('/', requirePermission(moduleName, 'create'), async (req: AuthRequest, res) => {
    try {
      let data = { ...req.body };

      if (modelName === 'user') {
        data.password = await bcrypt.hash(data.password || 'password123', 10);
        if (data.role && typeof data.role === 'string') {
          const role = await prisma.role.findUnique({ where: { name: data.role } });
          if (role) data.roleId = role.id;
          delete data.role;
        }
      }

      if ((modelName === 'order' || modelName === 'invoice') && data.items) {
        const items = data.items;
        delete data.items;
        const created = await getModel().create({ data: { ...data, items: { create: items } }, include: includes });
        if (req.userId) logAudit({ userId: req.userId, action: 'create', module: moduleName, entityId: created.id });
        res.status(201).json(created);
        return;
      }

      // Clean relation objects
      for (const key of ['assignedTo', 'contact', 'company', 'author', 'user', 'product']) {
        delete data[key];
      }

      const created = await getModel().create({ data, include: includes });
      if (req.userId) logAudit({ userId: req.userId, action: 'create', module: moduleName, entityId: created.id });
      if (modelName === 'user') {
        const { password, ...safe } = created as any;
        res.status(201).json(safe);
      } else {
        res.status(201).json(created);
      }
    } catch (err: any) {
      console.error(`Create ${modelName} error:`, err);
      if (err.code === 'P2002') res.status(409).json({ message: 'Duplicate entry', code: 'DUPLICATE' });
      else res.status(500).json({ message: 'Internal server error', code: 'SERVER_ERROR' });
    }
  });

  // UPDATE — requires 'edit' permission
  router.put('/:id', requirePermission(moduleName, 'edit'), async (req: AuthRequest, res) => {
    try {
      let data = { ...req.body };

      if (modelName === 'user') {
        if (data.password) data.password = await bcrypt.hash(data.password, 10);
        else delete data.password;
        if (data.role && typeof data.role === 'string') {
          const role = await prisma.role.findUnique({ where: { name: data.role } });
          if (role) data.roleId = role.id;
          delete data.role;
        }
      }

      for (const key of ['assignedTo', 'contact', 'company', 'author', 'user', 'product', 'id', 'createdAt', 'updatedAt']) {
        delete data[key];
      }

      if ((modelName === 'order' || modelName === 'invoice') && data.items) {
        const items = data.items;
        delete data.items;
        const itemModel = modelName === 'order' ? 'orderItem' : 'invoiceItem';
        const fk = modelName === 'order' ? 'orderId' : 'invoiceId';
        await (prisma as any)[itemModel].deleteMany({ where: { [fk]: req.params.id } });
        const updated = await getModel().update({
          where: { id: req.params.id },
          data: { ...data, items: { create: items } },
          include: includes,
        });
        if (req.userId) logAudit({ userId: req.userId, action: 'update', module: moduleName, entityId: req.params.id });
        res.json(updated);
        return;
      }

      const updated = await getModel().update({ where: { id: req.params.id }, data, include: includes });
      if (req.userId) logAudit({ userId: req.userId, action: 'update', module: moduleName, entityId: req.params.id });
      if (modelName === 'user') {
        const { password, ...safe } = updated as any;
        res.json(safe);
      } else {
        res.json(updated);
      }
    } catch (err: any) {
      console.error(`Update ${modelName} error:`, err);
      if (err.code === 'P2025') res.status(404).json({ message: 'Not found', code: 'NOT_FOUND' });
      else res.status(500).json({ message: 'Internal server error', code: 'SERVER_ERROR' });
    }
  });

  // DELETE — requires 'delete' permission
  router.delete('/:id', requirePermission(moduleName, 'delete'), async (req: AuthRequest, res) => {
    try {
      await getModel().delete({ where: { id: req.params.id } });
      if (req.userId) logAudit({ userId: req.userId, action: 'delete', module: moduleName, entityId: req.params.id });
      res.status(204).send();
    } catch (err: any) {
      console.error(`Delete ${modelName} error:`, err);
      if (err.code === 'P2025') res.status(404).json({ message: 'Not found', code: 'NOT_FOUND' });
      else res.status(500).json({ message: 'Internal server error', code: 'SERVER_ERROR' });
    }
  });

  return router;
}
