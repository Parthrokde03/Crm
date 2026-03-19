// ============================================================
// CRM DATA MODEL — Complete Entity Types
// ============================================================

// --- Base ---
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// --- Auth & Users ---
export type RoleName =
  | 'admin'
  | 'sales_manager'
  | 'sales_rep'
  | 'support_agent'
  | 'ops_manager'
  | 'marketing_manager'
  | 'finance_manager';

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'export';
export type PermissionScope = 'own' | 'team' | 'all';

export interface Permission {
  module: string;
  actions: PermissionAction[];
  scope: PermissionScope;
}

export interface Role extends BaseEntity {
  name: RoleName;
  label: string;
  permissions: Permission[];
}

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  roleId: string;
  role: Role;
  teamId?: string;
  isActive: boolean;
  lastLoginAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
}

// --- Leads ---
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';
export type LeadSource = 'website' | 'referral' | 'cold_call' | 'social' | 'advertisement' | 'other';

export interface Lead extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  source: LeadSource;
  status: LeadStatus;
  score: number;
  assignedToId?: string;
  assignedTo?: User;
  notes?: string;
  convertedContactId?: string;
  convertedAt?: string;
}

// --- Contacts ---
export interface Contact extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  companyId?: string;
  company?: Company;
  assignedToId?: string;
  assignedTo?: User;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  tags: string[];
}

// --- Companies ---
export type CompanySize = 'startup' | 'small' | 'medium' | 'enterprise';

export interface Company extends BaseEntity {
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  size: CompanySize;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  annualRevenue?: number;
  employeeCount?: number;
  contacts?: Contact[];
}

// --- Deals ---
export type DealStage = 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

export interface Deal extends BaseEntity {
  title: string;
  value: number;
  currency: string;
  stage: DealStage;
  probability: number;
  expectedCloseDate: string;
  actualCloseDate?: string;
  contactId?: string;
  contact?: Contact;
  companyId?: string;
  company?: Company;
  assignedToId: string;
  assignedTo?: User;
  description?: string;
  lostReason?: string;
}

// --- Tasks ---
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled';

export interface Task extends BaseEntity {
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  assignedToId: string;
  assignedTo?: User;
  relatedType?: 'lead' | 'contact' | 'deal' | 'ticket';
  relatedId?: string;
  completedAt?: string;
}

// --- Activities ---
export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'task_completed' | 'deal_update' | 'status_change';

export interface Activity extends BaseEntity {
  type: ActivityType;
  title: string;
  description?: string;
  userId: string;
  user?: User;
  relatedType: 'lead' | 'contact' | 'deal' | 'company' | 'ticket';
  relatedId: string;
  metadata?: Record<string, unknown>;
}

// --- Notes ---
export interface Note extends BaseEntity {
  content: string;
  authorId: string;
  author?: User;
  relatedType: 'lead' | 'contact' | 'deal' | 'company' | 'ticket';
  relatedId: string;
  isPinned: boolean;
}

// --- Products ---
export interface Product extends BaseEntity {
  name: string;
  sku: string;
  description?: string;
  unitPrice: number;
  currency: string;
  category?: string;
  isActive: boolean;
}

// --- Orders ---
export type OrderStatus = 'draft' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order extends BaseEntity {
  orderNumber: string;
  contactId: string;
  contact?: Contact;
  companyId?: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
}

// --- Invoices ---
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice extends BaseEntity {
  invoiceNumber: string;
  orderId?: string;
  contactId: string;
  contact?: Contact;
  companyId?: string;
  status: InvoiceStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  dueDate: string;
  paidAt?: string;
  notes?: string;
}

// --- Support Tickets ---
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';

export interface Ticket extends BaseEntity {
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  contactId: string;
  contact?: Contact;
  assignedToId?: string;
  assignedTo?: User;
  category?: string;
  resolvedAt?: string;
}

// --- Notifications ---
export interface Notification extends BaseEntity {
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  link?: string;
}

// --- Audit Log ---
export interface AuditLog extends BaseEntity {
  userId: string;
  user?: User;
  action: string;
  module: string;
  entityId: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
  ipAddress?: string;
}

// --- API Contracts ---
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string[]>;
}

export interface ListParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, unknown>;
}
