/**
 * Mock API layer — returns local data with simulated async delay.
 * Replace this file with real API calls when your backend is ready.
 */
import type {
  AuthTokens, User, Lead, Contact, Company, Deal, Task,
  Product, Order, Invoice, Ticket,
  PaginatedResponse, ListParams,
} from '../types';
import {
  mockUser, mockLeads, mockContacts, mockCompanies, mockDeals,
  mockTasks, mockTickets, mockProducts, mockOrders, mockInvoices, mockUsers,
} from './mock-data';
import type { Role, RoleName } from '../types';

// Role definitions for building proper role objects
const ROLE_DEFS: Record<RoleName, { label: string; permissions: Role['permissions'] }> = {
  admin: { label: 'Administrator', permissions: [
    { module: 'leads', actions: ['view','create','edit','delete','export'] },
    { module: 'contacts', actions: ['view','create','edit','delete','export'] },
    { module: 'companies', actions: ['view','create','edit','delete','export'] },
    { module: 'deals', actions: ['view','create','edit','delete','export'] },
    { module: 'tasks', actions: ['view','create','edit','delete','export'] },
    { module: 'tickets', actions: ['view','create','edit','delete','export'] },
    { module: 'products', actions: ['view','create','edit','delete','export'] },
    { module: 'orders', actions: ['view','create','edit','delete','export'] },
    { module: 'invoices', actions: ['view','create','edit','delete','export'] },
    { module: 'users', actions: ['view','create','edit','delete'] },
    { module: 'reports', actions: ['view'] },
    { module: 'audit_logs', actions: ['view'] },
  ]},
  sales_manager: { label: 'Sales Manager', permissions: [
    { module: 'leads', actions: ['view','create','edit','delete'] },
    { module: 'contacts', actions: ['view','create','edit','delete'] },
    { module: 'companies', actions: ['view','create','edit'] },
    { module: 'deals', actions: ['view','create','edit','delete'] },
    { module: 'tasks', actions: ['view','create','edit','delete'] },
    { module: 'tickets', actions: ['view'] },
    { module: 'products', actions: ['view'] },
    { module: 'orders', actions: ['view','create','edit'] },
    { module: 'invoices', actions: ['view'] },
    { module: 'reports', actions: ['view'] },
  ]},
  sales_rep: { label: 'Sales Representative', permissions: [
    { module: 'leads', actions: ['view','create','edit'] },
    { module: 'contacts', actions: ['view','create','edit'] },
    { module: 'companies', actions: ['view'] },
    { module: 'deals', actions: ['view','create','edit'] },
    { module: 'tasks', actions: ['view','create','edit'] },
    { module: 'tickets', actions: ['view'] },
    { module: 'products', actions: ['view'] },
    { module: 'orders', actions: ['view','create'] },
  ]},
  support_agent: { label: 'Support Agent', permissions: [
    { module: 'contacts', actions: ['view'] },
    { module: 'tickets', actions: ['view','create','edit','delete'] },
    { module: 'tasks', actions: ['view','create','edit'] },
  ]},
  ops_manager: { label: 'Operations Manager', permissions: [
    { module: 'leads', actions: ['view'] },
    { module: 'contacts', actions: ['view','create','edit','delete'] },
    { module: 'companies', actions: ['view','create','edit','delete'] },
    { module: 'deals', actions: ['view'] },
    { module: 'tasks', actions: ['view','create','edit','delete'] },
    { module: 'tickets', actions: ['view','create','edit','delete'] },
    { module: 'products', actions: ['view','create','edit','delete'] },
    { module: 'orders', actions: ['view','create','edit','delete'] },
    { module: 'invoices', actions: ['view','create','edit','delete'] },
    { module: 'users', actions: ['view'] },
    { module: 'reports', actions: ['view'] },
    { module: 'audit_logs', actions: ['view'] },
  ]},
  marketing_manager: { label: 'Marketing Manager', permissions: [
    { module: 'leads', actions: ['view','create','edit','delete'] },
    { module: 'contacts', actions: ['view'] },
    { module: 'companies', actions: ['view'] },
    { module: 'products', actions: ['view'] },
    { module: 'reports', actions: ['view'] },
  ]},
  finance_manager: { label: 'Finance Manager', permissions: [
    { module: 'leads', actions: ['view'] },
    { module: 'contacts', actions: ['view'] },
    { module: 'companies', actions: ['view'] },
    { module: 'deals', actions: ['view'] },
    { module: 'tasks', actions: ['view','create','edit'] },
    { module: 'products', actions: ['view'] },
    { module: 'orders', actions: ['view'] },
    { module: 'invoices', actions: ['view','create','edit','delete'] },
    { module: 'reports', actions: ['view'] },
  ]},
};

function buildRoleObject(roleName: RoleName): Role {
  const def = ROLE_DEFS[roleName];
  return {
    id: `role-${roleName}`,
    name: roleName,
    label: def.label,
    permissions: def.permissions,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// --- Simulate network delay ---
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// --- Generic mock CRUD factory ---
function createMockCrud<T extends { id: string }>(initialData: T[]) {
  let data = [...initialData];

  return {
    list: async (params?: ListParams): Promise<PaginatedResponse<T>> => {
      await delay();
      let filtered = [...data];

      // Search
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter((item) =>
          Object.values(item).some((v) => typeof v === 'string' && v.toLowerCase().includes(q)),
        );
      }

      // Sort
      if (params?.sortBy) {
        const key = params.sortBy as keyof T;
        const dir = params?.sortOrder === 'asc' ? 1 : -1;
        filtered.sort((a, b) => {
          const aVal = a[key];
          const bVal = b[key];
          if (typeof aVal === 'string' && typeof bVal === 'string') return aVal.localeCompare(bVal) * dir;
          if (typeof aVal === 'number' && typeof bVal === 'number') return (aVal - bVal) * dir;
          return 0;
        });
      }

      // Paginate
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 20;
      const total = filtered.length;
      const start = (page - 1) * pageSize;
      const paged = filtered.slice(start, start + pageSize);

      return {
        data: paged,
        meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
      };
    },

    getById: async (id: string): Promise<T> => {
      await delay(200);
      const item = data.find((d) => d.id === id);
      if (!item) throw new Error('Not found');
      return { ...item };
    },

    create: async (input: Partial<T>): Promise<T> => {
      await delay(400);
      const newItem = {
        ...input,
        id: `${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as T;
      data = [newItem, ...data];
      return newItem;
    },

    update: async (id: string, input: Partial<T>): Promise<T> => {
      await delay(400);
      const idx = data.findIndex((d) => d.id === id);
      if (idx === -1) throw new Error('Not found');
      data[idx] = { ...data[idx], ...input, updatedAt: new Date().toISOString() };
      return { ...data[idx] };
    },

    remove: async (id: string): Promise<void> => {
      await delay(300);
      data = data.filter((d) => d.id !== id);
    },
  };
}

// --- Track logged-in user email for me() ---
let _loggedInEmail = 'admin@crmapp.com';

// --- Auth ---
export const authApi = {
  login: async (email: string, _password: string): Promise<{ user: User; tokens: AuthTokens }> => {
    await delay(500);
    // Look up user by email across all users in the mock store
    const allUsers = await usersApi.list({ pageSize: 200 });
    const found = allUsers.data.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) throw new Error('Invalid credentials');
    if (!found.isActive) throw new Error('Account is inactive');
    _loggedInEmail = found.email;
    return {
      user: found,
      tokens: { accessToken: `mock-token-${found.id}`, refreshToken: `mock-refresh-${found.id}` },
    };
  },
  register: async (_data: { email: string; password: string; firstName: string; lastName: string }) => {
    await delay(500);
    return { user: mockUser, tokens: { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' } };
  },
  forgotPassword: async (_email: string) => {
    await delay(500);
    return { message: 'Reset link sent' };
  },
  resetPassword: async (_token: string, _password: string) => {
    await delay(500);
    return { message: 'Password reset' };
  },
  me: async (): Promise<User> => {
    await delay(200);
    const allUsers = await usersApi.list({ pageSize: 200 });
    const found = allUsers.data.find((u) => u.email.toLowerCase() === _loggedInEmail.toLowerCase());
    if (!found) throw new Error('User not found');
    return found;
  },
};

// --- Module APIs ---
export const leadsApi = createMockCrud<Lead>(mockLeads);
export const contactsApi = createMockCrud<Contact>(mockContacts);
export const companiesApi = createMockCrud<Company>(mockCompanies);
export const dealsApi = createMockCrud<Deal>(mockDeals);
export const tasksApi = createMockCrud<Task>(mockTasks);
export const ticketsApi = createMockCrud<Ticket>(mockTickets);
export const productsApi = createMockCrud<Product>(mockProducts);
export const ordersApi = createMockCrud<Order>(mockOrders);
export const invoicesApi = createMockCrud<Invoice>(mockInvoices);
export const usersApi = (() => {
  const base = createMockCrud<User>(mockUsers);
  return {
    ...base,
    create: async (input: Partial<User>): Promise<User> => {
      // Build proper role object from roleName if provided
      const roleName = ((input as Record<string, unknown>).role as RoleName) || 'sales_rep';
      const role = buildRoleObject(roleName);
      const newUser: Partial<User> = {
        ...input,
        role,
        roleId: role.id,
        isActive: input.isActive ?? true,
        tags: [],
      };
      // Remove the raw 'role' string that came from the form
      delete (newUser as Record<string, unknown>).password;
      return base.create(newUser);
    },
    update: async (id: string, input: Partial<User>): Promise<User> => {
      const updates: Partial<User> = { ...input };
      // If role name was passed as a string, build the full role object
      const rawRole = (input as Record<string, unknown>).role;
      if (typeof rawRole === 'string') {
        const role = buildRoleObject(rawRole as RoleName);
        updates.role = role;
        updates.roleId = role.id;
      }
      delete (updates as Record<string, unknown>).password;
      return base.update(id, updates);
    },
  };
})();

export const notificationsApi = {
  ...createMockCrud<never>([]),
  markRead: async (_id: string) => { await delay(); },
  markAllRead: async () => { await delay(); },
};

export const auditLogsApi = {
  list: async (_params?: ListParams) => {
    await delay();
    return { data: [], meta: { total: 0, page: 1, pageSize: 20, totalPages: 0 } };
  },
};

export const dashboardApi = {
  getSalesMetrics: async () => { await delay(); return {}; },
  getSupportMetrics: async () => { await delay(); return {}; },
  getAdminMetrics: async () => { await delay(); return {}; },
};
