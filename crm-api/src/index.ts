import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { crudRouter } from './routes/crud.js';
import { dashboardRouter } from './routes/dashboard.js';
import { reportsRouter } from './routes/reports.js';
import { notificationsRouter } from './routes/notifications.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Auth routes
app.use('/api/auth', authRouter);

// CRUD routes for all modules
app.use('/api/leads', crudRouter('lead'));
app.use('/api/contacts', crudRouter('contact'));
app.use('/api/companies', crudRouter('company'));
app.use('/api/deals', crudRouter('deal'));
app.use('/api/tasks', crudRouter('task'));
app.use('/api/tickets', crudRouter('ticket'));
app.use('/api/products', crudRouter('product'));
app.use('/api/orders', crudRouter('order'));
app.use('/api/invoices', crudRouter('invoice'));
app.use('/api/users', crudRouter('user'));
app.use('/api/activities', crudRouter('activity'));
app.use('/api/notes', crudRouter('note'));
app.use('/api/notifications', notificationsRouter);
app.use('/api/audit-logs', crudRouter('auditLog'));

// Dashboard & Reports
app.use('/api/dashboard', dashboardRouter);
app.use('/api/reports', reportsRouter);

app.listen(PORT, () => {
  console.log(`CRM API running on http://localhost:${PORT}`);
});
