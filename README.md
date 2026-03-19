# CRM Pro

A production-grade Customer Relationship Management system built with React, TypeScript, and Node.js. Features 12+ modules, role-based access control with scoped permissions, real-time dashboards, and a modern UI.

![Login](https://img.shields.io/badge/Status-Active-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue)

---

## Tech Stack

### Frontend (`crm-app/`)
- **React 18** + **TypeScript** — UI framework
- **Vite** — Build tool and dev server
- **Mantine UI v7** — Component library
- **TanStack Query** — Server state management
- **Zustand** — Client state management
- **React Router v6** — Routing with lazy-loaded pages
- **Recharts** — Dashboard charts and analytics
- **Tabler Icons** — Icon set

### Backend (`crm-api/`)
- **Express.js** + **TypeScript** — REST API server
- **Prisma ORM** — Database toolkit and migrations
- **PostgreSQL** — Relational database
- **JWT** — Authentication with access/refresh token rotation
- **bcrypt** — Password hashing

---

## Modules

| Module | Description |
|--------|-------------|
| **Dashboard** | Role-specific metrics, charts, and KPIs |
| **Leads** | Lead tracking with source, status, and scoring |
| **Contacts** | Contact management with company associations |
| **Companies** | Company records with size, revenue, and location |
| **Deals** | Sales pipeline with stages and probability tracking |
| **Tasks** | Task management with priority and due dates |
| **Tickets** | Support ticket system with priority and categories |
| **Products** | Product catalog with SKU and pricing |
| **Orders** | Order management with line items |
| **Invoices** | Invoice generation and payment tracking |
| **Users** | User management with role assignment |
| **Reports** | Aggregated analytics and data exports |
| **Notifications** | In-app notification system with mark-as-read |
| **Audit Log** | Full audit trail of all CRUD operations |
| **Settings** | Profile and password management |

---

## Role-Based Access Control (RBAC)

The system implements scoped permissions with 7 predefined roles:

| Role | Scope | Access |
|------|-------|--------|
| **Administrator** | All | Full access to every module |
| **Sales Manager** | Team | Leads, contacts, companies, deals, tasks, reports |
| **Sales Rep** | Own | Leads, contacts, deals, tasks |
| **Support Agent** | Own | Tickets, contacts, tasks |
| **Ops Manager** | All | Products, orders, invoices, tasks |
| **Marketing** | All | Leads (view/create), contacts (view), reports |
| **Finance** | All | Invoices, orders, deals (view), reports |

Each permission has a **scope** (`own`, `team`, or `all`) that controls data visibility. Dashboards are role-specific — each role sees only the metrics relevant to their function.

---

## Project Structure

```
Crm/
├── crm-api/                  # Backend
│   ├── prisma/
│   │   └── schema.prisma     # Database schema (14+ tables)
│   ├── src/
│   │   ├── index.ts          # Express server entry point
│   │   ├── seed.ts           # Database seeder (roles + users)
│   │   ├── lib/
│   │   │   ├── prisma.ts     # Prisma client
│   │   │   ├── jwt.ts        # Token signing/verification
│   │   │   └── audit.ts      # Audit logging utility
│   │   ├── middleware/
│   │   │   ├── auth.ts       # JWT authentication middleware
│   │   │   └── rbac.ts       # Permission & scope middleware
│   │   └── routes/
│   │       ├── auth.ts       # Login, refresh, me, change-password
│   │       ├── crud.ts       # Generic CRUD router factory
│   │       ├── dashboard.ts  # Role-specific dashboard metrics
│   │       ├── reports.ts    # Aggregated report queries
│   │       └── notifications.ts
│   └── package.json
│
├── crm-app/                  # Frontend
│   ├── src/
│   │   ├── App.tsx           # Root with theme, router, providers
│   │   ├── main.tsx          # Entry point
│   │   ├── components/       # Reusable UI components
│   │   │   ├── layout/       # AppShell, Sidebar, Topbar
│   │   │   ├── guards/       # AuthGuard, RoleGuard, PermissionGuard
│   │   │   ├── DataTable.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   ├── ChartCard.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   └── ...
│   │   ├── features/         # Feature modules (one folder per module)
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── leads/
│   │   │   ├── contacts/
│   │   │   ├── companies/
│   │   │   ├── deals/
│   │   │   ├── tasks/
│   │   │   ├── tickets/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   ├── invoices/
│   │   │   ├── users/
│   │   │   ├── reports/
│   │   │   ├── notifications/
│   │   │   ├── audit-log/
│   │   │   └── settings/
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API client and service layer
│   │   ├── store/            # Zustand stores (auth, UI)
│   │   ├── types/            # TypeScript type definitions
│   │   ├── constants/
│   │   └── routes/           # Route configuration
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL 14+
- npm

### 1. Clone the repository
```bash
git clone https://github.com/Parthrokde03/Crm.git
cd Crm
```

### 2. Set up the database
Create a PostgreSQL database:
```sql
CREATE DATABASE crm_db;
```

### 3. Configure the backend
```bash
cd crm-api
npm install
```

Create a `.env` file:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/crm_db"
JWT_SECRET="your-secret-key"
```

Run Prisma migrations and seed:
```bash
npx prisma db push
npx tsx src/seed.ts
```

### 4. Start the backend
```bash
npx tsx watch src/index.ts
```
The API server runs on `http://localhost:3001`.

### 5. Set up the frontend
```bash
cd ../crm-app
npm install
npm run dev
```
The app runs on `http://localhost:5173` with API proxy to the backend.

---

## Default Users

| Email | Password | Role |
|-------|----------|------|
| admin@crmapp.com | admin123 | Administrator |
| sales.mgr@crmapp.com | sales123 | Sales Manager |
| sales@crmapp.com | sales123 | Sales Rep |
| support@crmapp.com | support123 | Support Agent |
| ops@crmapp.com | ops123 | Ops Manager |
| marketing@crmapp.com | mkt123 | Marketing |
| finance@crmapp.com | fin123 | Finance |

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current user profile |
| POST | `/api/auth/change-password` | Change password |

### CRUD Resources
All resources follow the same REST pattern:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/{resource}` | List with pagination, search, filters |
| GET | `/api/{resource}/:id` | Get by ID |
| POST | `/api/{resource}` | Create new |
| PUT | `/api/{resource}/:id` | Update |
| DELETE | `/api/{resource}/:id` | Delete |

**Resources:** `leads`, `contacts`, `companies`, `deals`, `tasks`, `tickets`, `products`, `orders`, `invoices`, `users`

### Query Parameters
- `page` — Page number (default: 1)
- `pageSize` — Items per page (default: 20, max: 100)
- `sortBy` — Sort field (default: createdAt)
- `sortOrder` — `asc` or `desc`
- `search` — Full-text search across relevant fields
- Filter by any field: `status=open`, `priority=high`, etc.

### Special Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/metrics` | Role-specific dashboard data |
| GET | `/api/reports/summary` | Aggregated report data |
| GET | `/api/notifications` | User notifications |
| PUT | `/api/notifications/:id/read` | Mark notification as read |

---

## Key Features

- **Scoped Permissions** — Data visibility controlled by own/team/all scope per role
- **Role-Specific Dashboards** — Each role sees relevant metrics and charts
- **Generic CRUD Engine** — Single router factory handles all 10+ resources
- **JWT Auth with Refresh** — Automatic token rotation on expiry
- **Audit Trail** — Every create, update, and delete is logged
- **Responsive Layout** — Collapsible sidebar, mobile-friendly
- **Reusable Components** — DataTable, MetricCard, ChartCard, StatusBadge, PageHeader, EmptyState, ConfirmDialog

---

## License

MIT
