import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ═══════════════════════════════════════════════════════════
// RBAC PERMISSION MATRIX — Based on real-world CRM best practices
// Sources: HubSpot, Zoho CRM, Bitrix24 permission models
// Principle of least privilege applied per role
// ═══════════════════════════════════════════════════════════

const ROLES = [
  {
    name: 'admin',
    label: 'Administrator',
    permissions: [
      { module: 'dashboard',     actions: ['view'], scope: 'all' },
      { module: 'leads',         actions: ['view','create','edit','delete','export'], scope: 'all' },
      { module: 'contacts',      actions: ['view','create','edit','delete','export'], scope: 'all' },
      { module: 'companies',     actions: ['view','create','edit','delete','export'], scope: 'all' },
      { module: 'deals',         actions: ['view','create','edit','delete','export'], scope: 'all' },
      { module: 'tasks',         actions: ['view','create','edit','delete','export'], scope: 'all' },
      { module: 'tickets',       actions: ['view','create','edit','delete','export'], scope: 'all' },
      { module: 'products',      actions: ['view','create','edit','delete','export'], scope: 'all' },
      { module: 'orders',        actions: ['view','create','edit','delete','export'], scope: 'all' },
      { module: 'invoices',      actions: ['view','create','edit','delete','export'], scope: 'all' },
      { module: 'users',         actions: ['view','create','edit','delete'], scope: 'all' },
      { module: 'reports',       actions: ['view','export'], scope: 'all' },
      { module: 'notifications', actions: ['view','edit'], scope: 'all' },
      { module: 'audit_logs',    actions: ['view'], scope: 'all' },
      { module: 'settings',      actions: ['view','edit'], scope: 'all' },
    ],
  },
  {
    name: 'sales_manager',
    label: 'Sales Manager',
    // Team-wide sales visibility, can view reports, assign tasks, monitor pipeline
    // No settings, no audit logs, no user management
    permissions: [
      { module: 'dashboard',     actions: ['view'], scope: 'team' },
      { module: 'leads',         actions: ['view','create','edit','delete','export'], scope: 'team' },
      { module: 'contacts',      actions: ['view','create','edit','delete','export'], scope: 'team' },
      { module: 'companies',     actions: ['view','create','edit'], scope: 'all' },
      { module: 'deals',         actions: ['view','create','edit','delete','export'], scope: 'team' },
      { module: 'tasks',         actions: ['view','create','edit','delete'], scope: 'team' },
      { module: 'products',      actions: ['view'], scope: 'all' },
      { module: 'reports',       actions: ['view'], scope: 'team' },
      { module: 'notifications', actions: ['view','edit'], scope: 'own' },
    ],
  },
  {
    name: 'sales_rep',
    label: 'Sales Representative',
    // Own leads, contacts, deals, tasks only. No reports, no tickets, no invoices
    permissions: [
      { module: 'dashboard',     actions: ['view'], scope: 'own' },
      { module: 'leads',         actions: ['view','create','edit'], scope: 'own' },
      { module: 'contacts',      actions: ['view','create','edit'], scope: 'own' },
      { module: 'companies',     actions: ['view'], scope: 'all' },
      { module: 'deals',         actions: ['view','create','edit'], scope: 'own' },
      { module: 'tasks',         actions: ['view','create','edit'], scope: 'own' },
      { module: 'notifications', actions: ['view','edit'], scope: 'own' },
    ],
  },
  {
    name: 'support_agent',
    label: 'Support Agent',
    // Tickets only (own). View-only contacts/companies for reference. No sales data at all
    permissions: [
      { module: 'dashboard',     actions: ['view'], scope: 'own' },
      { module: 'contacts',      actions: ['view'], scope: 'all' },
      { module: 'companies',     actions: ['view'], scope: 'all' },
      { module: 'tickets',       actions: ['view','create','edit'], scope: 'own' },
      { module: 'tasks',         actions: ['view','create','edit'], scope: 'own' },
      { module: 'notifications', actions: ['view','edit'], scope: 'own' },
    ],
  },
  {
    name: 'ops_manager',
    label: 'Operations Manager',
    // Products, orders, invoices. Operational reports. No leads/deals/tickets
    permissions: [
      { module: 'dashboard',     actions: ['view'], scope: 'all' },
      { module: 'companies',     actions: ['view','create','edit'], scope: 'all' },
      { module: 'products',      actions: ['view','create','edit','delete','export'], scope: 'all' },
      { module: 'orders',        actions: ['view','create','edit','delete','export'], scope: 'all' },
      { module: 'invoices',      actions: ['view','create','edit','export'], scope: 'all' },
      { module: 'tasks',         actions: ['view','create','edit','delete'], scope: 'all' },
      { module: 'reports',       actions: ['view'], scope: 'all' },
      { module: 'notifications', actions: ['view','edit'], scope: 'own' },
    ],
  },
  {
    name: 'marketing_manager',
    label: 'Marketing Manager',
    // Leads and contacts for campaigns. Lead source analysis. No deals/orders/invoices/users
    permissions: [
      { module: 'dashboard',     actions: ['view'], scope: 'all' },
      { module: 'leads',         actions: ['view','create','edit','delete','export'], scope: 'all' },
      { module: 'contacts',      actions: ['view','create','edit'], scope: 'all' },
      { module: 'companies',     actions: ['view'], scope: 'all' },
      { module: 'reports',       actions: ['view'], scope: 'all' },
      { module: 'notifications', actions: ['view','edit'], scope: 'own' },
    ],
  },
  {
    name: 'finance_manager',
    label: 'Finance Manager',
    // Invoices, financial reports, view-only orders. No leads/deals/tickets
    permissions: [
      { module: 'dashboard',     actions: ['view'], scope: 'all' },
      { module: 'companies',     actions: ['view'], scope: 'all' },
      { module: 'orders',        actions: ['view'], scope: 'all' },
      { module: 'invoices',      actions: ['view','create','edit','delete','export'], scope: 'all' },
      { module: 'reports',       actions: ['view','export'], scope: 'all' },
      { module: 'notifications', actions: ['view','edit'], scope: 'own' },
    ],
  },
];

async function main() {
  console.log('Seeding database...');

  // Upsert roles
  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { label: role.label, permissions: role.permissions },
      create: { name: role.name, label: role.label, permissions: role.permissions },
    });
  }
  console.log('✓ 7 roles created/updated with scoped permissions');

  // Create admin user
  const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
  if (!adminRole) throw new Error('Admin role not found');

  await prisma.user.upsert({
    where: { email: 'admin@crmapp.com' },
    update: { roleId: adminRole.id },
    create: {
      email: 'admin@crmapp.com',
      password: await bcrypt.hash('admin123', 10),
      firstName: 'Admin',
      lastName: 'User',
      roleId: adminRole.id,
      isActive: true,
    },
  });
  console.log('✓ admin@crmapp.com / admin123');

  // Create one user per role for testing
  const testUsers = [
    { email: 'sales.mgr@crmapp.com', password: 'sales123', first: 'Jane', last: 'Manager', role: 'sales_manager' },
    { email: 'sales@crmapp.com', password: 'sales123', first: 'Sarah', last: 'Sales', role: 'sales_rep' },
    { email: 'support@crmapp.com', password: 'support123', first: 'Tom', last: 'Support', role: 'support_agent' },
    { email: 'ops@crmapp.com', password: 'ops123', first: 'Mike', last: 'Operations', role: 'ops_manager' },
    { email: 'marketing@crmapp.com', password: 'mkt123', first: 'Lisa', last: 'Marketing', role: 'marketing_manager' },
    { email: 'finance@crmapp.com', password: 'fin123', first: 'David', last: 'Finance', role: 'finance_manager' },
  ];

  for (const u of testUsers) {
    const role = await prisma.role.findUnique({ where: { name: u.role } });
    if (!role) continue;
    await prisma.user.upsert({
      where: { email: u.email },
      update: { roleId: role.id },
      create: {
        email: u.email,
        password: await bcrypt.hash(u.password, 10),
        firstName: u.first,
        lastName: u.last,
        roleId: role.id,
        isActive: true,
      },
    });
    console.log(`✓ ${u.email} / ${u.password} (${u.role})`);
  }

  console.log('\nSeed complete!');
}

main()
  .catch((e) => { console.error('Seed error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
