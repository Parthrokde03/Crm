import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Center, Loader } from '@mantine/core';
import { AppShell } from '../components/layout/AppShell';
import { AuthGuard } from '../components/guards/AuthGuard';
import { PermissionGuard } from '../components/guards/PermissionGuard';

// Lazy-loaded pages
const LoginPage = lazy(() => import('../features/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const ForgotPasswordPage = lazy(() => import('../features/auth/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })));
const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })));

// Leads
const LeadsListPage = lazy(() => import('../features/leads/LeadsListPage').then((m) => ({ default: m.LeadsListPage })));
const LeadFormPage = lazy(() => import('../features/leads/LeadFormPage').then((m) => ({ default: m.LeadFormPage })));
const LeadDetailPage = lazy(() => import('../features/leads/LeadDetailPage').then((m) => ({ default: m.LeadDetailPage })));

// Contacts
const ContactsListPage = lazy(() => import('../features/contacts/ContactsListPage').then((m) => ({ default: m.ContactsListPage })));
const ContactFormPage = lazy(() => import('../features/contacts/ContactFormPage').then((m) => ({ default: m.ContactFormPage })));
const ContactDetailPage = lazy(() => import('../features/contacts/ContactDetailPage').then((m) => ({ default: m.ContactDetailPage })));

// Companies
const CompaniesListPage = lazy(() => import('../features/companies/CompaniesListPage').then((m) => ({ default: m.CompaniesListPage })));
const CompanyFormPage = lazy(() => import('../features/companies/CompanyFormPage').then((m) => ({ default: m.CompanyFormPage })));
const CompanyDetailPage = lazy(() => import('../features/companies/CompanyDetailPage').then((m) => ({ default: m.CompanyDetailPage })));

// Deals
const DealsListPage = lazy(() => import('../features/deals/DealsListPage').then((m) => ({ default: m.DealsListPage })));
const DealFormPage = lazy(() => import('../features/deals/DealFormPage').then((m) => ({ default: m.DealFormPage })));
const DealDetailPage = lazy(() => import('../features/deals/DealDetailPage').then((m) => ({ default: m.DealDetailPage })));

// Tasks
const TasksListPage = lazy(() => import('../features/tasks/TasksListPage').then((m) => ({ default: m.TasksListPage })));
const TaskFormPage = lazy(() => import('../features/tasks/TaskFormPage').then((m) => ({ default: m.TaskFormPage })));

// Tickets
const TicketsListPage = lazy(() => import('../features/tickets/TicketsListPage').then((m) => ({ default: m.TicketsListPage })));
const TicketFormPage = lazy(() => import('../features/tickets/TicketFormPage').then((m) => ({ default: m.TicketFormPage })));
const TicketDetailPage = lazy(() => import('../features/tickets/TicketDetailPage').then((m) => ({ default: m.TicketDetailPage })));

// Products
const ProductsListPage = lazy(() => import('../features/products/ProductsListPage').then((m) => ({ default: m.ProductsListPage })));
const ProductFormPage = lazy(() => import('../features/products/ProductFormPage').then((m) => ({ default: m.ProductFormPage })));

// Orders
const OrdersListPage = lazy(() => import('../features/orders/OrdersListPage').then((m) => ({ default: m.OrdersListPage })));
const OrderDetailPage = lazy(() => import('../features/orders/OrderDetailPage').then((m) => ({ default: m.OrderDetailPage })));

// Invoices
const InvoicesListPage = lazy(() => import('../features/invoices/InvoicesListPage').then((m) => ({ default: m.InvoicesListPage })));
const InvoiceDetailPage = lazy(() => import('../features/invoices/InvoiceDetailPage').then((m) => ({ default: m.InvoiceDetailPage })));

// Users
const UsersListPage = lazy(() => import('../features/users/UsersListPage').then((m) => ({ default: m.UsersListPage })));
const UserInvitePage = lazy(() => import('../features/users/UserInvitePage').then((m) => ({ default: m.UserInvitePage })));
const UserEditPage = lazy(() => import('../features/users/UserEditPage').then((m) => ({ default: m.UserEditPage })));

// Settings
const SettingsPage = lazy(() => import('../features/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })));

// Reports, Notifications, Audit Log
const ReportsPage = lazy(() => import('../features/reports/ReportsPage').then((m) => ({ default: m.ReportsPage })));
const NotificationsPage = lazy(() => import('../features/notifications/NotificationsPage').then((m) => ({ default: m.NotificationsPage })));
const AuditLogPage = lazy(() => import('../features/audit-log/AuditLogPage').then((m) => ({ default: m.AuditLogPage })));

function SW({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Center py="xl"><Loader /></Center>}>{children}</Suspense>;
}

function PG({ module, children }: { module: string; children: React.ReactNode }) {
  return <PermissionGuard module={module} action="view" redirect>{children}</PermissionGuard>;
}

export const router = createBrowserRouter([
  { path: '/login', element: <SW><LoginPage /></SW> },
  { path: '/forgot-password', element: <SW><ForgotPasswordPage /></SW> },

  {
    path: '/',
    element: <AuthGuard><AppShell /></AuthGuard>,
    children: [
      { index: true, element: <SW><DashboardPage /></SW> },

      // Leads
      { path: 'leads', element: <PG module="leads"><SW><LeadsListPage /></SW></PG> },
      { path: 'leads/new', element: <PG module="leads"><SW><LeadFormPage /></SW></PG> },
      { path: 'leads/:id', element: <PG module="leads"><SW><LeadDetailPage /></SW></PG> },
      { path: 'leads/:id/edit', element: <PG module="leads"><SW><LeadFormPage /></SW></PG> },

      // Contacts
      { path: 'contacts', element: <PG module="contacts"><SW><ContactsListPage /></SW></PG> },
      { path: 'contacts/new', element: <PG module="contacts"><SW><ContactFormPage /></SW></PG> },
      { path: 'contacts/:id', element: <PG module="contacts"><SW><ContactDetailPage /></SW></PG> },
      { path: 'contacts/:id/edit', element: <PG module="contacts"><SW><ContactFormPage /></SW></PG> },

      // Companies
      { path: 'companies', element: <PG module="companies"><SW><CompaniesListPage /></SW></PG> },
      { path: 'companies/new', element: <PG module="companies"><SW><CompanyFormPage /></SW></PG> },
      { path: 'companies/:id', element: <PG module="companies"><SW><CompanyDetailPage /></SW></PG> },
      { path: 'companies/:id/edit', element: <PG module="companies"><SW><CompanyFormPage /></SW></PG> },

      // Deals
      { path: 'deals', element: <PG module="deals"><SW><DealsListPage /></SW></PG> },
      { path: 'deals/new', element: <PG module="deals"><SW><DealFormPage /></SW></PG> },
      { path: 'deals/:id', element: <PG module="deals"><SW><DealDetailPage /></SW></PG> },
      { path: 'deals/:id/edit', element: <PG module="deals"><SW><DealFormPage /></SW></PG> },

      // Tasks
      { path: 'tasks', element: <PG module="tasks"><SW><TasksListPage /></SW></PG> },
      { path: 'tasks/new', element: <PG module="tasks"><SW><TaskFormPage /></SW></PG> },
      { path: 'tasks/:id/edit', element: <PG module="tasks"><SW><TaskFormPage /></SW></PG> },

      // Tickets
      { path: 'tickets', element: <PG module="tickets"><SW><TicketsListPage /></SW></PG> },
      { path: 'tickets/new', element: <PG module="tickets"><SW><TicketFormPage /></SW></PG> },
      { path: 'tickets/:id', element: <PG module="tickets"><SW><TicketDetailPage /></SW></PG> },
      { path: 'tickets/:id/edit', element: <PG module="tickets"><SW><TicketFormPage /></SW></PG> },

      // Products
      { path: 'products', element: <PG module="products"><SW><ProductsListPage /></SW></PG> },
      { path: 'products/new', element: <PG module="products"><SW><ProductFormPage /></SW></PG> },
      { path: 'products/:id/edit', element: <PG module="products"><SW><ProductFormPage /></SW></PG> },

      // Orders
      { path: 'orders', element: <PG module="orders"><SW><OrdersListPage /></SW></PG> },
      { path: 'orders/:id', element: <PG module="orders"><SW><OrderDetailPage /></SW></PG> },

      // Invoices
      { path: 'invoices', element: <PG module="invoices"><SW><InvoicesListPage /></SW></PG> },
      { path: 'invoices/:id', element: <PG module="invoices"><SW><InvoiceDetailPage /></SW></PG> },

      // Users
      { path: 'users', element: <PG module="users"><SW><UsersListPage /></SW></PG> },
      { path: 'users/new', element: <PG module="users"><SW><UserInvitePage /></SW></PG> },
      { path: 'users/:id/edit', element: <PG module="users"><SW><UserEditPage /></SW></PG> },

      // Settings
      { path: 'settings', element: <PG module="settings"><SW><SettingsPage /></SW></PG> },
      { path: 'settings/:tab', element: <PG module="settings"><SW><SettingsPage /></SW></PG> },

      // Reports, Notifications, Audit Log
      { path: 'reports', element: <PG module="reports"><SW><ReportsPage /></SW></PG> },
      { path: 'notifications', element: <SW><NotificationsPage /></SW> },
      { path: 'audit-log', element: <PG module="audit_logs"><SW><AuditLogPage /></SW></PG> },

      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
