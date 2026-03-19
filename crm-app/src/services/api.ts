/**
 * Real API layer — calls the Express backend via apiClient (axios).
 * All endpoints go through /api/* which Vite proxies to the backend.
 */
import type {
  AuthTokens, User, Lead, Contact, Company, Deal, Task,
  Product, Order, Invoice, Ticket, Activity, Note,
  PaginatedResponse, ListParams,
} from '../types';
import { apiClient } from './api-client';

// --- Generic CRUD factory using real HTTP calls ---
function createCrud<T>(basePath: string) {
  return {
    list: async (params?: ListParams): Promise<PaginatedResponse<T>> => {
      const query: Record<string, string> = {};
      if (params?.page) query.page = String(params.page);
      if (params?.pageSize) query.pageSize = String(params.pageSize);
      if (params?.sortBy) query.sortBy = params.sortBy;
      if (params?.sortOrder) query.sortOrder = params.sortOrder;
      if (params?.search) query.search = params.search;
      if (params?.filters) {
        for (const [k, v] of Object.entries(params.filters)) {
          if (v !== undefined && v !== null && v !== '') query[k] = String(v);
        }
      }
      const { data } = await apiClient.get(basePath, { params: query });
      return data;
    },

    getById: async (id: string): Promise<T> => {
      const { data } = await apiClient.get(`${basePath}/${id}`);
      return data;
    },

    create: async (input: Partial<T>): Promise<T> => {
      const { data } = await apiClient.post(basePath, input);
      return data;
    },

    update: async (id: string, input: Partial<T>): Promise<T> => {
      const { data } = await apiClient.put(`${basePath}/${id}`, input);
      return data;
    },

    remove: async (id: string): Promise<void> => {
      await apiClient.delete(`${basePath}/${id}`);
    },
  };
}

// --- Auth API ---
export const authApi = {
  login: async (email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data;
  },
  register: async (input: { email: string; password: string; firstName: string; lastName: string }) => {
    const { data } = await apiClient.post('/auth/register', input);
    return data;
  },
  forgotPassword: async (email: string) => {
    const { data } = await apiClient.post('/auth/forgot-password', { email });
    return data;
  },
  resetPassword: async (token: string, password: string) => {
    const { data } = await apiClient.post('/auth/reset-password', { token, password });
    return data;
  },
  me: async (): Promise<User> => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const { data } = await apiClient.post('/auth/change-password', { currentPassword, newPassword });
    return data;
  },
};

// --- Module APIs ---
export const leadsApi = createCrud<Lead>('/leads');
export const contactsApi = createCrud<Contact>('/contacts');
export const companiesApi = createCrud<Company>('/companies');
export const dealsApi = createCrud<Deal>('/deals');
export const tasksApi = createCrud<Task>('/tasks');
export const ticketsApi = createCrud<Ticket>('/tickets');
export const productsApi = createCrud<Product>('/products');
export const ordersApi = createCrud<Order>('/orders');
export const invoicesApi = createCrud<Invoice>('/invoices');
export const usersApi = createCrud<User>('/users');
export const activitiesApi = createCrud<Activity>('/activities');
export const notesApi = createCrud<Note>('/notes');

export const notificationsApi = {
  list: async (params?: ListParams & { isRead?: boolean }) => {
    const query: Record<string, string> = {};
    if (params?.page) query.page = String(params.page);
    if (params?.pageSize) query.pageSize = String(params.pageSize);
    if (params?.isRead !== undefined) query.isRead = String(params.isRead);
    const { data } = await apiClient.get('/notifications', { params: query });
    return data;
  },
  markRead: async (id: string) => {
    const { data } = await apiClient.put(`/notifications/${id}/read`);
    return data;
  },
  markAllRead: async () => {
    const { data } = await apiClient.post('/notifications/mark-all-read');
    return data;
  },
  remove: async (id: string) => {
    await apiClient.delete(`/notifications/${id}`);
  },
};

export const auditLogsApi = {
  list: async (params?: ListParams) => {
    const query: Record<string, string> = {};
    if (params?.page) query.page = String(params.page);
    if (params?.pageSize) query.pageSize = String(params.pageSize);
    if (params?.sortBy) query.sortBy = params.sortBy;
    if (params?.sortOrder) query.sortOrder = params.sortOrder;
    if (params?.search) query.search = params.search;
    if (params?.filters) {
      for (const [k, v] of Object.entries(params.filters)) {
        if (v !== undefined && v !== null && v !== '') query[k] = String(v);
      }
    }
    const { data } = await apiClient.get('/audit-logs', { params: query });
    return data;
  },
};

export const reportsApi = {
  sales: async () => { const { data } = await apiClient.get('/reports/sales'); return data; },
  leads: async () => { const { data } = await apiClient.get('/reports/leads'); return data; },
  tickets: async () => { const { data } = await apiClient.get('/reports/tickets'); return data; },
  revenue: async () => { const { data } = await apiClient.get('/reports/revenue'); return data; },
};

export const dashboardApi = {
  getMetrics: async () => {
    const { data } = await apiClient.get('/dashboard/metrics');
    return data;
  },
};
