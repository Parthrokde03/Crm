import type { User, Role, Lead, Contact, Company, Deal, Task, Ticket, Product, Order, Invoice } from '../types';

const adminRole: Role = {
  id: 'role-1',
  name: 'admin',
  label: 'Administrator',
  permissions: [
    { module: 'leads', actions: ['view', 'create', 'edit', 'delete', 'export'] },
    { module: 'contacts', actions: ['view', 'create', 'edit', 'delete', 'export'] },
    { module: 'companies', actions: ['view', 'create', 'edit', 'delete', 'export'] },
    { module: 'deals', actions: ['view', 'create', 'edit', 'delete', 'export'] },
    { module: 'tasks', actions: ['view', 'create', 'edit', 'delete', 'export'] },
    { module: 'tickets', actions: ['view', 'create', 'edit', 'delete', 'export'] },
    { module: 'products', actions: ['view', 'create', 'edit', 'delete', 'export'] },
    { module: 'orders', actions: ['view', 'create', 'edit', 'delete', 'export'] },
    { module: 'invoices', actions: ['view', 'create', 'edit', 'delete', 'export'] },
    { module: 'users', actions: ['view', 'create', 'edit', 'delete'] },
    { module: 'reports', actions: ['view'] },
    { module: 'audit_logs', actions: ['view'] },
  ],
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

export const mockUser: User = {
  id: 'user-1',
  email: 'admin@crmapp.com',
  firstName: 'Alex',
  lastName: 'Morgan',
  phone: '+1 555-0100',
  roleId: 'role-1',
  role: adminRole,
  isActive: true,
  lastLoginAt: '2026-03-19T06:00:00Z',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2026-03-19T06:00:00Z',
};

const now = new Date().toISOString();

export const mockLeads: Lead[] = [
  { id: 'lead-1', firstName: 'Sarah', lastName: 'Chen', email: 'sarah.chen@techcorp.com', phone: '+1 555-0101', company: 'TechCorp', jobTitle: 'VP Engineering', source: 'website', status: 'qualified', score: 85, createdAt: '2026-03-10T10:00:00Z', updatedAt: now },
  { id: 'lead-2', firstName: 'James', lastName: 'Wilson', email: 'j.wilson@innovate.io', phone: '+1 555-0102', company: 'Innovate.io', jobTitle: 'CTO', source: 'referral', status: 'contacted', score: 72, createdAt: '2026-03-12T14:00:00Z', updatedAt: now },
  { id: 'lead-3', firstName: 'Maria', lastName: 'Garcia', email: 'maria@startupxyz.com', company: 'StartupXYZ', jobTitle: 'Founder', source: 'social', status: 'new', score: 60, createdAt: '2026-03-15T09:00:00Z', updatedAt: now },
  { id: 'lead-4', firstName: 'David', lastName: 'Kim', email: 'dkim@enterprise.co', phone: '+1 555-0104', company: 'Enterprise Co', jobTitle: 'Director of Sales', source: 'cold_call', status: 'new', score: 45, createdAt: '2026-03-16T11:00:00Z', updatedAt: now },
  { id: 'lead-5', firstName: 'Emily', lastName: 'Brown', email: 'emily.b@globalfirm.com', company: 'Global Firm', jobTitle: 'Product Manager', source: 'advertisement', status: 'qualified', score: 90, createdAt: '2026-03-17T08:00:00Z', updatedAt: now },
  { id: 'lead-6', firstName: 'Robert', lastName: 'Taylor', email: 'rtaylor@megacorp.com', phone: '+1 555-0106', company: 'MegaCorp', jobTitle: 'IT Manager', source: 'website', status: 'contacted', score: 55, createdAt: '2026-03-18T13:00:00Z', updatedAt: now },
  { id: 'lead-7', firstName: 'Lisa', lastName: 'Anderson', email: 'lisa@smallbiz.com', company: 'SmallBiz LLC', jobTitle: 'Owner', source: 'referral', status: 'unqualified', score: 20, createdAt: '2026-03-14T16:00:00Z', updatedAt: now },
  { id: 'lead-8', firstName: 'Michael', lastName: 'Johnson', email: 'mjohnson@acme.com', phone: '+1 555-0108', company: 'Acme Inc', jobTitle: 'CFO', source: 'cold_call', status: 'converted', score: 95, convertedContactId: 'contact-1', convertedAt: '2026-03-18T10:00:00Z', createdAt: '2026-03-01T09:00:00Z', updatedAt: now },
];

export const mockCompanies: Company[] = [
  { id: 'comp-1', name: 'TechCorp', industry: 'Technology', website: 'https://techcorp.com', size: 'enterprise', country: 'USA', city: 'San Francisco', annualRevenue: 50000000, employeeCount: 500, createdAt: '2025-06-01T00:00:00Z', updatedAt: now },
  { id: 'comp-2', name: 'Innovate.io', industry: 'SaaS', website: 'https://innovate.io', size: 'medium', country: 'USA', city: 'Austin', annualRevenue: 12000000, employeeCount: 120, createdAt: '2025-08-15T00:00:00Z', updatedAt: now },
  { id: 'comp-3', name: 'StartupXYZ', industry: 'Fintech', size: 'startup', country: 'UK', city: 'London', annualRevenue: 800000, employeeCount: 15, createdAt: '2026-01-10T00:00:00Z', updatedAt: now },
  { id: 'comp-4', name: 'Enterprise Co', industry: 'Manufacturing', website: 'https://enterprise.co', size: 'enterprise', country: 'Germany', city: 'Berlin', annualRevenue: 200000000, employeeCount: 2000, createdAt: '2025-03-01T00:00:00Z', updatedAt: now },
  { id: 'comp-5', name: 'Global Firm', industry: 'Consulting', website: 'https://globalfirm.com', size: 'medium', country: 'USA', city: 'New York', annualRevenue: 25000000, employeeCount: 300, createdAt: '2025-09-20T00:00:00Z', updatedAt: now },
];

export const mockContacts: Contact[] = [
  { id: 'contact-1', firstName: 'Michael', lastName: 'Johnson', email: 'mjohnson@acme.com', phone: '+1 555-0108', jobTitle: 'CFO', companyId: 'comp-1', company: mockCompanies[0], tags: ['vip', 'decision-maker'], createdAt: '2026-03-18T10:00:00Z', updatedAt: now },
  { id: 'contact-2', firstName: 'Anna', lastName: 'Lee', email: 'anna.lee@techcorp.com', phone: '+1 555-0201', jobTitle: 'Head of Procurement', companyId: 'comp-1', company: mockCompanies[0], tags: ['procurement'], createdAt: '2025-11-05T00:00:00Z', updatedAt: now },
  { id: 'contact-3', firstName: 'Tom', lastName: 'Harris', email: 'tom@innovate.io', jobTitle: 'CEO', companyId: 'comp-2', company: mockCompanies[1], tags: ['executive'], createdAt: '2025-09-12T00:00:00Z', updatedAt: now },
  { id: 'contact-4', firstName: 'Rachel', lastName: 'Green', email: 'rachel@globalfirm.com', phone: '+1 555-0204', jobTitle: 'Operations Director', companyId: 'comp-5', company: mockCompanies[4], tags: ['operations'], createdAt: '2026-01-20T00:00:00Z', updatedAt: now },
  { id: 'contact-5', firstName: 'Chris', lastName: 'Martin', email: 'chris@enterprise.co', phone: '+49 170-0001', jobTitle: 'VP Sales', companyId: 'comp-4', company: mockCompanies[3], tags: ['sales', 'decision-maker'], createdAt: '2025-07-08T00:00:00Z', updatedAt: now },
];

export const mockDeals: Deal[] = [
  { id: 'deal-1', title: 'TechCorp Enterprise License', value: 120000, currency: 'USD', stage: 'negotiation', probability: 75, expectedCloseDate: '2026-04-15T00:00:00Z', contactId: 'contact-1', contact: mockContacts[0], companyId: 'comp-1', assignedToId: 'user-1', description: 'Annual enterprise license deal', createdAt: '2026-02-01T00:00:00Z', updatedAt: now },
  { id: 'deal-2', title: 'Innovate.io Platform Integration', value: 45000, currency: 'USD', stage: 'proposal', probability: 50, expectedCloseDate: '2026-05-01T00:00:00Z', contactId: 'contact-3', contact: mockContacts[2], companyId: 'comp-2', assignedToId: 'user-1', createdAt: '2026-02-15T00:00:00Z', updatedAt: now },
  { id: 'deal-3', title: 'Global Firm Consulting Package', value: 85000, currency: 'USD', stage: 'qualification', probability: 30, expectedCloseDate: '2026-06-01T00:00:00Z', contactId: 'contact-4', contact: mockContacts[3], companyId: 'comp-5', assignedToId: 'user-1', createdAt: '2026-03-01T00:00:00Z', updatedAt: now },
  { id: 'deal-4', title: 'Enterprise Co Manufacturing Suite', value: 250000, currency: 'USD', stage: 'prospecting', probability: 15, expectedCloseDate: '2026-07-01T00:00:00Z', contactId: 'contact-5', contact: mockContacts[4], companyId: 'comp-4', assignedToId: 'user-1', createdAt: '2026-03-10T00:00:00Z', updatedAt: now },
  { id: 'deal-5', title: 'StartupXYZ Starter Plan', value: 12000, currency: 'USD', stage: 'closed_won', probability: 100, expectedCloseDate: '2026-03-01T00:00:00Z', actualCloseDate: '2026-02-28T00:00:00Z', companyId: 'comp-3', assignedToId: 'user-1', createdAt: '2026-01-15T00:00:00Z', updatedAt: now },
  { id: 'deal-6', title: 'MegaCorp Pilot Program', value: 30000, currency: 'USD', stage: 'closed_lost', probability: 0, expectedCloseDate: '2026-03-10T00:00:00Z', actualCloseDate: '2026-03-08T00:00:00Z', assignedToId: 'user-1', lostReason: 'Budget constraints', createdAt: '2026-02-01T00:00:00Z', updatedAt: now },
];

export const mockTasks: Task[] = [
  { id: 'task-1', title: 'Follow up with TechCorp on proposal', priority: 'high', status: 'in_progress', dueDate: '2026-03-20T00:00:00Z', assignedToId: 'user-1', relatedType: 'deal', relatedId: 'deal-1', createdAt: '2026-03-15T00:00:00Z', updatedAt: now },
  { id: 'task-2', title: 'Prepare demo for Innovate.io', priority: 'medium', status: 'todo', dueDate: '2026-03-22T00:00:00Z', assignedToId: 'user-1', relatedType: 'deal', relatedId: 'deal-2', createdAt: '2026-03-16T00:00:00Z', updatedAt: now },
  { id: 'task-3', title: 'Send pricing sheet to Global Firm', priority: 'medium', status: 'done', dueDate: '2026-03-18T00:00:00Z', assignedToId: 'user-1', relatedType: 'deal', relatedId: 'deal-3', completedAt: '2026-03-17T14:00:00Z', createdAt: '2026-03-14T00:00:00Z', updatedAt: now },
  { id: 'task-4', title: 'Qualify new lead: Maria Garcia', priority: 'low', status: 'todo', dueDate: '2026-03-25T00:00:00Z', assignedToId: 'user-1', relatedType: 'lead', relatedId: 'lead-3', createdAt: '2026-03-15T00:00:00Z', updatedAt: now },
  { id: 'task-5', title: 'Review Q1 sales report', priority: 'urgent', status: 'todo', dueDate: '2026-03-19T00:00:00Z', assignedToId: 'user-1', createdAt: '2026-03-18T00:00:00Z', updatedAt: now },
];

export const mockTickets: Ticket[] = [
  { id: 'ticket-1', subject: 'Cannot access dashboard after update', description: 'User reports blank screen on dashboard', priority: 'high', status: 'open', contactId: 'contact-2', contact: mockContacts[1], assignedToId: 'user-1', category: 'Bug', createdAt: '2026-03-18T09:00:00Z', updatedAt: now },
  { id: 'ticket-2', subject: 'Request for API documentation', description: 'Need updated API docs for v3', priority: 'medium', status: 'in_progress', contactId: 'contact-3', contact: mockContacts[2], assignedToId: 'user-1', category: 'Feature Request', createdAt: '2026-03-17T11:00:00Z', updatedAt: now },
  { id: 'ticket-3', subject: 'Billing discrepancy on invoice #1042', description: 'Invoice amount does not match order total', priority: 'high', status: 'waiting', contactId: 'contact-5', contact: mockContacts[4], category: 'Billing', createdAt: '2026-03-16T15:00:00Z', updatedAt: now },
  { id: 'ticket-4', subject: 'How to export data to CSV?', description: 'Looking for export functionality', priority: 'low', status: 'resolved', contactId: 'contact-4', contact: mockContacts[3], assignedToId: 'user-1', category: 'Support', resolvedAt: '2026-03-17T10:00:00Z', createdAt: '2026-03-15T08:00:00Z', updatedAt: now },
];

export const mockProducts: Product[] = [
  { id: 'prod-1', name: 'CRM Pro Starter', sku: 'CRM-START-001', description: 'Starter plan for small teams', unitPrice: 29, currency: 'USD', category: 'Subscription', isActive: true, createdAt: '2025-01-01T00:00:00Z', updatedAt: now },
  { id: 'prod-2', name: 'CRM Pro Business', sku: 'CRM-BIZ-001', description: 'Business plan with advanced features', unitPrice: 79, currency: 'USD', category: 'Subscription', isActive: true, createdAt: '2025-01-01T00:00:00Z', updatedAt: now },
  { id: 'prod-3', name: 'CRM Pro Enterprise', sku: 'CRM-ENT-001', description: 'Enterprise plan with full features', unitPrice: 199, currency: 'USD', category: 'Subscription', isActive: true, createdAt: '2025-01-01T00:00:00Z', updatedAt: now },
  { id: 'prod-4', name: 'Onboarding Package', sku: 'SVC-ONB-001', description: 'Professional onboarding service', unitPrice: 2500, currency: 'USD', category: 'Service', isActive: true, createdAt: '2025-06-01T00:00:00Z', updatedAt: now },
  { id: 'prod-5', name: 'Custom Integration', sku: 'SVC-INT-001', description: 'Custom API integration service', unitPrice: 5000, currency: 'USD', category: 'Service', isActive: false, createdAt: '2025-06-01T00:00:00Z', updatedAt: now },
];

export const mockOrders: Order[] = [
  { id: 'order-1', orderNumber: 'ORD-2026-001', contactId: 'contact-1', contact: mockContacts[0], companyId: 'comp-1', status: 'delivered', items: [{ productId: 'prod-3', product: mockProducts[2], quantity: 10, unitPrice: 199, total: 1990 }, { productId: 'prod-4', product: mockProducts[3], quantity: 1, unitPrice: 2500, total: 2500 }], subtotal: 4490, tax: 449, total: 4939, createdAt: '2026-02-28T00:00:00Z', updatedAt: now },
  { id: 'order-2', orderNumber: 'ORD-2026-002', contactId: 'contact-3', contact: mockContacts[2], companyId: 'comp-2', status: 'confirmed', items: [{ productId: 'prod-2', product: mockProducts[1], quantity: 5, unitPrice: 79, total: 395 }], subtotal: 395, tax: 39.5, total: 434.5, createdAt: '2026-03-10T00:00:00Z', updatedAt: now },
  { id: 'order-3', orderNumber: 'ORD-2026-003', contactId: 'contact-5', contact: mockContacts[4], companyId: 'comp-4', status: 'processing', items: [{ productId: 'prod-3', product: mockProducts[2], quantity: 50, unitPrice: 199, total: 9950 }], subtotal: 9950, tax: 995, total: 10945, createdAt: '2026-03-15T00:00:00Z', updatedAt: now },
];

export const mockInvoices: Invoice[] = [
  { id: 'inv-1', invoiceNumber: 'INV-2026-001', orderId: 'order-1', contactId: 'contact-1', contact: mockContacts[0], companyId: 'comp-1', status: 'paid', items: mockOrders[0].items, subtotal: 4490, tax: 449, total: 4939, dueDate: '2026-03-30T00:00:00Z', paidAt: '2026-03-15T00:00:00Z', createdAt: '2026-02-28T00:00:00Z', updatedAt: now },
  { id: 'inv-2', invoiceNumber: 'INV-2026-002', orderId: 'order-2', contactId: 'contact-3', contact: mockContacts[2], companyId: 'comp-2', status: 'sent', items: mockOrders[1].items, subtotal: 395, tax: 39.5, total: 434.5, dueDate: '2026-04-10T00:00:00Z', createdAt: '2026-03-10T00:00:00Z', updatedAt: now },
  { id: 'inv-3', invoiceNumber: 'INV-2026-003', orderId: 'order-3', contactId: 'contact-5', contact: mockContacts[4], companyId: 'comp-4', status: 'overdue', items: mockOrders[2].items, subtotal: 9950, tax: 995, total: 10945, dueDate: '2026-03-15T00:00:00Z', createdAt: '2026-03-01T00:00:00Z', updatedAt: now },
];

export const mockUsers: User[] = [
  mockUser,
  { id: 'user-2', email: 'jane.smith@crmapp.com', firstName: 'Jane', lastName: 'Smith', roleId: 'role-2', role: { ...adminRole, id: 'role-2', name: 'sales_manager', label: 'Sales Manager' }, isActive: true, lastLoginAt: '2026-03-18T14:00:00Z', createdAt: '2025-03-01T00:00:00Z', updatedAt: now },
  { id: 'user-3', email: 'bob.jones@crmapp.com', firstName: 'Bob', lastName: 'Jones', roleId: 'role-3', role: { ...adminRole, id: 'role-3', name: 'sales_rep', label: 'Sales Representative' }, isActive: true, lastLoginAt: '2026-03-19T08:00:00Z', createdAt: '2025-06-15T00:00:00Z', updatedAt: now },
  { id: 'user-4', email: 'carol.white@crmapp.com', firstName: 'Carol', lastName: 'White', roleId: 'role-4', role: { ...adminRole, id: 'role-4', name: 'support_agent', label: 'Support Agent' }, isActive: true, createdAt: '2025-09-01T00:00:00Z', updatedAt: now },
  { id: 'user-5', email: 'dave.black@crmapp.com', firstName: 'Dave', lastName: 'Black', roleId: 'role-5', role: { ...adminRole, id: 'role-5', name: 'ops_manager', label: 'Operations Manager' }, isActive: false, createdAt: '2025-04-01T00:00:00Z', updatedAt: now },
];
