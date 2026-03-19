import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Center, Loader } from '@mantine/core';
import { AppShell } from '../components/layout/AppShell';
import { AuthGuard } from '../components/guards/AuthGuard';
import { RoleGuard } from '../components/guards/RoleGuard';

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

function SW({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Center py="xl"><Loader /></Center>}>{children}</Suspense>;
}

function AdminOnly({ children }: { children: React.ReactNode }) {
  return <RoleGuard roles={['admin', 'ops_manager']}>{children}</RoleGuard>;
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
      { path: 'leads', element: <SW><LeadsListPage /></SW> },
      { path: 'leads/new', element: <SW><LeadFormPage /></SW> },
      { path: 'leads/:id', element: <SW><LeadDetailPage /></SW> },
      { path: 'leads/:id/edit', element: <SW><LeadFormPage /></SW> },

      // Contacts
      { path: 'contacts', element: <SW><ContactsListPage /></SW> },
      { path: 'contacts/new', element: <SW><ContactFormPage /></SW> },
      { path: 'contacts/:id', element: <SW><ContactDetailPage /></SW> },
      { path: 'contacts/:id/edit', element: <SW><ContactFormPage /></SW> },

      // Companies
      { path: 'companies', element: <SW><CompaniesListPage /></SW> },
      { path: 'companies/new', element: <SW><CompanyFormPage /></SW> },
      { path: 'companies/:id', element: <SW><CompanyDetailPage /></SW> },
      { path: 'companies/:id/edit', element: <SW><CompanyFormPage /></SW> },

      // Deals
      { path: 'deals', element: <SW><DealsListPage /></SW> },
      { path: 'deals/new', element: <SW><DealFormPage /></SW> },
      { path: 'deals/:id', element: <SW><DealDetailPage /></SW> },
      { path: 'deals/:id/edit', element: <SW><DealFormPage /></SW> },

      // Tasks
      { path: 'tasks', element: <SW><TasksListPage /></SW> },
      { path: 'tasks/new', element: <SW><TaskFormPage /></SW> },
      { path: 'tasks/:id/edit', element: <SW><TaskFormPage /></SW> },

      // Tickets
      { path: 'tickets', element: <SW><TicketsListPage /></SW> },
      { path: 'tickets/new', element: <SW><TicketFormPage /></SW> },
      { path: 'tickets/:id', element: <SW><TicketDetailPage /></SW> },
      { path: 'tickets/:id/edit', element: <SW><TicketFormPage /></SW> },

      // Products
      { path: 'products', element: <SW><ProductsListPage /></SW> },
      { path: 'products/new', element: <SW><ProductFormPage /></SW> },
      { path: 'products/:id/edit', element: <SW><ProductFormPage /></SW> },

      // Orders
      { path: 'orders', element: <SW><OrdersListPage /></SW> },
      { path: 'orders/:id', element: <SW><OrderDetailPage /></SW> },

      // Invoices
      { path: 'invoices', element: <SW><InvoicesListPage /></SW> },
      { path: 'invoices/:id', element: <SW><InvoiceDetailPage /></SW> },

      // Users (admin only)
      { path: 'users', element: <AdminOnly><SW><UsersListPage /></SW></AdminOnly> },
      { path: 'users/new', element: <AdminOnly><SW><UserInvitePage /></SW></AdminOnly> },
      { path: 'users/:id/edit', element: <AdminOnly><SW><UserEditPage /></SW></AdminOnly> },

      // Settings
      { path: 'settings', element: <SW><SettingsPage /></SW> },
      { path: 'settings/:tab', element: <SW><SettingsPage /></SW> },

      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
