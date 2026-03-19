import type { RoleName, LeadStatus, DealStage, TaskPriority, TaskStatus, TicketPriority, TicketStatus, OrderStatus, InvoiceStatus } from '../types';

export const APP_NAME = 'CRM Pro';

// --- Role Labels ---
export const ROLE_LABELS: Record<RoleName, string> = {
  admin: 'Administrator',
  sales_manager: 'Sales Manager',
  sales_rep: 'Sales Representative',
  support_agent: 'Support Agent',
  ops_manager: 'Operations Manager',
  marketing_manager: 'Marketing Manager',
  finance_manager: 'Finance Manager',
};

// --- Status Colors (Mantine color names) ---
export const LEAD_STATUS_COLOR: Record<LeadStatus, string> = {
  new: 'blue',
  contacted: 'cyan',
  qualified: 'green',
  unqualified: 'gray',
  converted: 'violet',
};

export const DEAL_STAGE_COLOR: Record<DealStage, string> = {
  prospecting: 'gray',
  qualification: 'blue',
  proposal: 'cyan',
  negotiation: 'orange',
  closed_won: 'green',
  closed_lost: 'red',
};

export const TASK_PRIORITY_COLOR: Record<TaskPriority, string> = {
  low: 'gray',
  medium: 'blue',
  high: 'orange',
  urgent: 'red',
};

export const TASK_STATUS_COLOR: Record<TaskStatus, string> = {
  todo: 'gray',
  in_progress: 'blue',
  done: 'green',
  cancelled: 'red',
};

export const TICKET_PRIORITY_COLOR: Record<TicketPriority, string> = {
  low: 'gray',
  medium: 'blue',
  high: 'orange',
  critical: 'red',
};

export const TICKET_STATUS_COLOR: Record<TicketStatus, string> = {
  open: 'blue',
  in_progress: 'cyan',
  waiting: 'orange',
  resolved: 'green',
  closed: 'gray',
};

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  draft: 'gray',
  confirmed: 'blue',
  processing: 'cyan',
  shipped: 'orange',
  delivered: 'green',
  cancelled: 'red',
};

export const INVOICE_STATUS_COLOR: Record<InvoiceStatus, string> = {
  draft: 'gray',
  sent: 'blue',
  paid: 'green',
  overdue: 'red',
  cancelled: 'gray',
};

// --- Pagination ---
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// --- Currency ---
export const DEFAULT_CURRENCY = 'USD';
