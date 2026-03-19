# CRM Pro — Complete Production Blueprint

---

## A. Executive Summary

CRM Pro is a full-featured, production-grade Customer Relationship Management system built with React + TypeScript. It serves sales teams, support agents, operations, marketing, and finance — providing a unified platform for lead management, deal tracking, customer support, order processing, invoicing, and analytics.

The system is designed as a modular SaaS application with role-based access control, real-time dashboards, and a scalable architecture that separates concerns cleanly between features, shared components, API services, and state management.

---

## B. Recommended Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React 18+ | Component model, ecosystem, hiring pool |
| Language | TypeScript | Type safety across the entire codebase |
| Build Tool | Vite | Fast HMR, ESM-native, excellent DX |
| Routing | React Router v6 | Nested routes, lazy loading, guards |
| Server State | TanStack Query | Caching, pagination, optimistic updates |
| Client State | Zustand | Minimal boilerplate, no providers needed |
| UI Library | Mantine v7 | Enterprise-grade components, dark mode, forms |
| Tables | Mantine Table + custom DataTable | Sorting, filtering, pagination, selection |
| Forms | @mantine/form | Integrated validation, dirty state, nested fields |
| Validation | Zod (for API schemas) + Mantine form validate | Runtime + form-level validation |
| Charts | Recharts | Composable, responsive, good for dashboards |
| Icons | Tabler Icons | 4000+ icons, consistent with Mantine |
| Dates | Day.js | Lightweight, immutable, locale support |
| Rich Text | TipTap | Extensible, headless, Mantine integration |
| HTTP Client | Axios | Interceptors for auth, retry, error handling |
| Notifications | @mantine/notifications | Toast system integrated with UI library |
| Testing | Vitest + Testing Library + Playwright | Unit, component, E2E |

### Tradeoffs Considered
- Mantine vs Ant Design: Mantine has better TypeScript DX, smaller bundle, modern API. Ant Design has more components but heavier.
- Zustand vs Redux Toolkit: Zustand is simpler for this scale. Redux Toolkit if you need middleware-heavy flows.
- TanStack Table vs AG Grid: TanStack is free and composable. AG Grid for extreme data grid needs (100k+ rows).

---

## C. CRM Modules

### Core Modules (MVP)

| Module | Purpose | Key Screens | Key Fields |
|---|---|---|---|
| Auth | Login, password reset, session | Login, Forgot Password, Reset | email, password, tokens |
| Dashboard | KPI overview, charts | Role-based dashboard | metrics, charts, filters |
| Leads | Capture and qualify prospects | List, Detail, Create/Edit | name, email, source, status, score |
| Contacts | Manage customer relationships | List, Detail, Create/Edit | name, email, phone, company, tags |
| Companies | Account management | List, Detail, Create/Edit | name, industry, size, revenue |
| Deals | Sales pipeline tracking | List, Kanban, Detail, Create/Edit | title, value, stage, probability, close date |
| Tasks | Work item tracking | List, Create/Edit | title, priority, status, due date, assignee |

### Extended Modules (Phase 2+)

| Module | Purpose | Key Screens |
|---|---|---|
| Activities | Log calls, emails, meetings | Timeline, Activity Feed |
| Notes | Rich text notes on any entity | Notes Panel (embedded) |
| Products | Product/service catalog | List, Create/Edit |
| Orders | Order lifecycle tracking | List, Detail, Create |
| Invoices | Billing and payment tracking | List, Detail, Create |
| Tickets | Customer support management | List, Detail, Create/Edit |
| Users/Teams | User management, team structure | List, Invite, Edit |
| Roles/Permissions | RBAC configuration | Role editor, Permission matrix |
| Notifications | In-app notification center | Notification list, preferences |
| Reports | Analytics and reporting | Report builder, saved reports |
| Audit Log | Change tracking | Searchable log table |
| Settings | App and profile configuration | Profile, Password, Preferences |

### Module Relationships
```
Lead --converts-to--> Contact --belongs-to--> Company
Contact --has-many--> Deals, Tasks, Tickets, Orders
Deal --has-many--> Activities, Notes, Tasks
Order --generates--> Invoice
User --assigned-to--> Leads, Deals, Tasks, Tickets
All entities --logged-in--> AuditLog
```

---

## D. Data Model Overview

### Entity Relationship Summary

```
User (1) --- (M) Lead          [assignedTo]
User (1) --- (M) Deal          [assignedTo]
User (1) --- (M) Task          [assignedTo]
User (1) --- (M) Ticket        [assignedTo]
User (M) --- (1) Role          [role]

Company (1) --- (M) Contact    [company]
Contact (1) --- (M) Deal       [contact]
Contact (1) --- (M) Order      [contact]
Contact (1) --- (M) Ticket     [contact]

Order (1) --- (M) OrderItem    [items]
Order (1) --- (1) Invoice      [order]
Invoice (1) --- (M) OrderItem  [items]

Activity --> polymorphic (Lead | Contact | Deal | Company | Ticket)
Note --> polymorphic (Lead | Contact | Deal | Company | Ticket)
Task --> polymorphic (Lead | Contact | Deal | Ticket)
```

### Core Entities (MVP)
User, Role, Lead, Contact, Company, Deal, Task

### Extended Entities
Activity, Note, Product, Order, Invoice, Ticket, Notification, AuditLog

### Data Flow
1. Lead enters system (web form, import, manual)
2. Lead is qualified → converted to Contact + optional Company
3. Deal is created linked to Contact
4. Deal progresses through pipeline stages
5. Won deal → Order created → Invoice generated
6. Support tickets linked to Contact
7. All changes logged to AuditLog

---

## E. Route Map

```
PUBLIC ROUTES
├── /login
├── /forgot-password
└── /reset-password/:token

PROTECTED ROUTES (require auth)
├── /                           → Dashboard
├── /leads                      → Leads list
│   ├── /leads/new              → Create lead
│   ├── /leads/:id              → Lead detail
│   └── /leads/:id/edit         → Edit lead
├── /contacts                   → Contacts list
│   ├── /contacts/new
│   ├── /contacts/:id
│   └── /contacts/:id/edit
├── /companies                  → Companies list
│   ├── /companies/new
│   ├── /companies/:id
│   └── /companies/:id/edit
├── /deals                      → Deals list
│   ├── /deals/new
│   ├── /deals/:id
│   └── /deals/:id/edit
├── /tasks                      → Tasks list
│   ├── /tasks/new
│   └── /tasks/:id/edit
├── /tickets                    → Tickets list
│   ├── /tickets/new
│   ├── /tickets/:id
│   └── /tickets/:id/edit
├── /products                   → Products list
├── /orders                     → Orders list
│   └── /orders/:id
├── /invoices                   → Invoices list
│   └── /invoices/:id
├── /users                      → Users list (admin)
│   └── /users/new
├── /reports                    → Reports (manager+)
├── /notifications              → Notification center
├── /audit-log                  → Audit log (admin)
├── /settings                   → Settings
│   └── /settings/:tab
└── *                           → Redirect to /
```

---

## F. Folder Structure

```
crm-app/
├── public/
├── src/
│   ├── components/             # Shared reusable components
│   │   ├── layout/
│   │   │   ├── AppShell.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Topbar.tsx
│   │   ├── guards/
│   │   │   ├── AuthGuard.tsx
│   │   │   ├── RoleGuard.tsx
│   │   │   └── PermissionGuard.tsx
│   │   ├── DataTable.tsx
│   │   ├── PageHeader.tsx
│   │   ├── MetricCard.tsx
│   │   ├── ChartCard.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── EntityAvatar.tsx
│   ├── features/               # Feature modules (page-level)
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── ForgotPasswordPage.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   ├── leads/
│   │   │   ├── LeadsListPage.tsx
│   │   │   ├── LeadFormPage.tsx
│   │   │   └── LeadDetailPage.tsx
│   │   ├── contacts/
│   │   ├── companies/
│   │   ├── deals/
│   │   ├── tasks/
│   │   ├── tickets/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── invoices/
│   │   ├── users/
│   │   └── settings/
│   ├── hooks/                  # Custom hooks
│   │   ├── use-crud-query.ts
│   │   └── use-table-params.ts
│   ├── services/               # API layer
│   │   ├── api-client.ts       # Axios instance + interceptors
│   │   └── api.ts              # Module-specific API functions
│   ├── store/                  # Global state (Zustand)
│   │   ├── auth-store.ts
│   │   └── ui-store.ts
│   ├── routes/                 # Route definitions
│   │   └── index.tsx
│   ├── types/                  # TypeScript types
│   │   └── index.ts
│   ├── constants/              # App constants
│   │   └── index.ts
│   ├── App.tsx                 # Root component
│   └── main.tsx                # Entry point
├── postcss.config.cjs
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## G. Dashboard Plan

### Admin Dashboard
| Widget | Type | Description |
|---|---|---|
| Total Users | MetricCard | Active user count + growth |
| System Health | MetricCard | API uptime, error rate |
| New Signups | MetricCard | This month vs last |
| Revenue | MetricCard | Total revenue + trend |
| User Activity | BarChart | Daily active users |
| Module Usage | PieChart | Most used modules |
| Recent Audit Log | Table | Last 10 system events |

### Sales Dashboard
| Widget | Type | Description |
|---|---|---|
| Total Leads | MetricCard | New leads this period |
| Active Deals | MetricCard | Pipeline value |
| Won Deals | MetricCard | Closed-won count + value |
| Conversion Rate | MetricCard | Lead → Deal percentage |
| Pipeline Funnel | BarChart | Deals by stage |
| Lead Sources | PieChart | Distribution by source |
| Top Deals | Table | Highest value open deals |
| Upcoming Tasks | Table | Tasks due this week |

### Support Dashboard
| Widget | Type | Description |
|---|---|---|
| Open Tickets | MetricCard | Unresolved count |
| Avg Resolution Time | MetricCard | Hours to resolve |
| SLA Compliance | MetricCard | % within SLA |
| Ticket Volume | LineChart | Tickets over time |
| By Priority | PieChart | Distribution |
| Recent Tickets | Table | Latest tickets |

### Time Range Filters
All dashboards support: Today, This Week, This Month, This Quarter, This Year, Custom Range

---

## H. Component Inventory

| Component | Purpose | Key Props |
|---|---|---|
| AppShell | Main layout wrapper | children (via Outlet) |
| Sidebar | Navigation menu | role-filtered nav items |
| Topbar | Header with user menu | color scheme toggle, notifications |
| AuthGuard | Route protection | children |
| RoleGuard | Role-based route access | roles[], children |
| PermissionGuard | Permission-based UI hiding | module, action, children, fallback |
| PageHeader | Page title + breadcrumbs + actions | title, breadcrumbs[], actions |
| DataTable | Full-featured data table | columns, data, pagination, sort, search, actions |
| MetricCard | KPI display card | title, value, icon, change, changeLabel |
| ChartCard | Chart wrapper with title | title, children, timeRanges |
| StatusBadge | Colored status label | status, colorMap |
| EmptyState | No-data placeholder | title, message, icon, action |
| ConfirmDialog | Confirmation modal | title, message, onConfirm |
| EntityAvatar | User/company avatar | name, src, size |

---

## I. MVP Scope (Phase 1)

### Modules
- Authentication (login, forgot password)
- Dashboard (sales-focused)
- Leads (full CRUD + status management)
- Contacts (full CRUD)
- Companies (full CRUD)
- Deals (full CRUD + pipeline view)
- Tasks (full CRUD)
- Settings (profile, password)

### Infrastructure
- Route protection + role guards
- API client with token refresh
- Reusable DataTable, PageHeader, StatusBadge
- Dark mode support
- Responsive sidebar layout

### What's NOT in MVP
- Tickets, Orders, Invoices, Products
- Reports/Analytics beyond dashboard
- Audit Log
- User management / invite flow
- Notifications center
- Rich text editor
- File uploads
- Kanban board view

---

## J. Phase-by-Phase Roadmap

### Phase 1 — MVP (Weeks 1-4)
- Auth, Dashboard, Leads, Contacts, Companies, Deals, Tasks, Settings
- Core layout, DataTable, guards, API layer
- Complexity: Medium | Delivers: Usable sales CRM

### Phase 2 — Extended CRM (Weeks 5-8)
- Tickets, Products, Orders, Invoices
- Activity timeline, Notes panel
- Notification center
- User management + invite flow
- Complexity: Medium-High | Delivers: Full operational CRM

### Phase 3 — Enterprise (Weeks 9-12)
- Reports builder + saved reports
- Audit log with search/filter
- Role/permission editor UI
- Kanban board for deals
- Bulk actions (import/export CSV)
- Email integration
- Complexity: High | Delivers: Enterprise-grade features

### Phase 4 — AI & Automation (Weeks 13-16)
- Lead scoring automation
- Deal win probability prediction
- Smart task suggestions
- Email template engine
- Workflow automation builder
- Complexity: Very High | Delivers: Competitive advantage

---

## K. Risks and Mistakes to Avoid

1. Over-engineering state management — use Zustand for UI, TanStack Query for server state
2. Building a custom table from scratch — use the DataTable pattern provided
3. Skipping TypeScript strictness — keep `strict: true` in tsconfig
4. Not planning permissions early — the guard system is already in place, use it
5. Monolithic components — keep pages thin, extract logic to hooks
6. Ignoring loading/error/empty states — every data view needs all three
7. Client-side only filtering — plan for server-side from day one
8. Hardcoding roles — use the permission system, not role name checks
9. No token refresh strategy — the interceptor pattern is already implemented
10. Skipping form validation — use Mantine form + Zod for API payloads

---

## User Roles & Permissions Matrix

| Module | Admin | Sales Mgr | Sales Rep | Support | Ops Mgr | Marketing | Finance |
|---|---|---|---|---|---|---|---|
| Dashboard | Full | Sales | Sales | Support | Ops | Marketing | Finance |
| Leads | CRUD | CRUD | CRU (own) | View | View | CRUD | View |
| Contacts | CRUD | CRUD | CRU (own) | View | CRUD | View | View |
| Companies | CRUD | CRUD | View | View | CRUD | View | View |
| Deals | CRUD | CRUD | CRU (own) | — | View | View | View |
| Tasks | CRUD | CRUD | CRU (own) | CRU (own) | CRUD | CRU (own) | CRU (own) |
| Tickets | CRUD | View | View | CRUD | CRUD | — | — |
| Products | CRUD | View | View | — | CRUD | View | View |
| Orders | CRUD | CRUD | Create | — | CRUD | — | View |
| Invoices | CRUD | View | — | — | CRUD | — | CRUD |
| Users | CRUD | View | — | — | View | — | — |
| Reports | Full | Sales | Own | Support | Full | Marketing | Finance |
| Audit Log | Full | — | — | — | View | — | — |
| Settings | Full | Profile | Profile | Profile | Profile | Profile | Profile |

---

## CRM Workflows

### 1. Lead → Deal Pipeline
```
Trigger: Lead created (web form / import / manual)
Steps:
  1. Lead status = "new", assigned to sales rep
  2. Sales rep contacts lead → status = "contacted"
  3. Qualification call → status = "qualified" or "unqualified"
  4. If qualified → "Convert to Contact" action
  5. Contact created, Company linked/created
  6. Deal created from contact → enters pipeline
  7. Deal moves: Prospecting → Qualification → Proposal → Negotiation
  8. Deal closed: "won" (→ create Order) or "lost" (→ log reason)
Screens: Lead List → Lead Detail → Convert Dialog → Contact Detail → Deal Detail
Automation: Auto-assign based on territory, auto-create follow-up task
```

### 2. Support Ticket Lifecycle
```
Trigger: Customer submits ticket / agent creates
Steps:
  1. Ticket created, status = "open", priority set
  2. Auto-assigned or manually assigned to agent
  3. Agent works ticket → status = "in_progress"
  4. Waiting on customer → status = "waiting"
  5. Issue resolved → status = "resolved"
  6. Customer confirms → status = "closed"
Screens: Ticket List → Ticket Detail → Resolution Form
Automation: SLA timer, escalation on breach, satisfaction survey
```

### 3. Order → Invoice Flow
```
Trigger: Deal won / manual order creation
Steps:
  1. Order created with line items from Products
  2. Order confirmed → status = "confirmed"
  3. Invoice generated from order
  4. Invoice sent to customer → status = "sent"
  5. Payment received → status = "paid"
  6. Overdue tracking if past due date
Screens: Deal Detail → Create Order → Order Detail → Generate Invoice → Invoice Detail
```

---

## State Management Strategy

| State Type | Tool | Example |
|---|---|---|
| Auth / Session | Zustand (auth-store) | user, tokens, isAuthenticated |
| UI Preferences | Zustand (ui-store) | sidebar collapsed, color scheme |
| Server Data | TanStack Query | leads list, deal detail, contacts |
| Table Params | useState (useTableParams hook) | page, sort, search, filters |
| Form State | @mantine/form | field values, validation, dirty state |
| Optimistic Updates | TanStack Query mutations | onMutate → update cache → rollback on error |

### Rules
- Never duplicate server state in Zustand
- Use query keys consistently: `['leads']`, `['leads', id]`, `['leads', params]`
- Invalidate queries after mutations, don't manually update cache (unless optimistic)
- Keep component state local unless 2+ components need it

---

## API Integration Strategy

### Endpoint Convention
```
GET    /api/{module}          → List (paginated)
GET    /api/{module}/:id      → Get by ID
POST   /api/{module}          → Create
PATCH  /api/{module}/:id      → Update
DELETE /api/{module}/:id      → Delete
```

### Pagination Contract
```json
{
  "data": [...],
  "meta": {
    "total": 248,
    "page": 1,
    "pageSize": 20,
    "totalPages": 13
  }
}
```

### Query Parameters
```
?page=1&pageSize=20&sortBy=createdAt&sortOrder=desc&search=john&filters[status]=new
```

### Error Response
```json
{
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "email": ["Email is required", "Must be valid email"]
  }
}
```

---

## Authentication & Authorization

### Frontend Auth Flow
1. User submits login form → POST /auth/login
2. Server returns { user, tokens: { accessToken, refreshToken } }
3. Tokens stored in localStorage (accessToken + refreshToken)
4. Axios interceptor attaches Bearer token to every request
5. On 401 → interceptor attempts token refresh via POST /auth/refresh
6. If refresh fails → clear tokens, redirect to /login
7. AuthGuard checks isAuthenticated before rendering protected routes
8. RoleGuard checks user.role.name against allowed roles
9. PermissionGuard checks user.role.permissions for module+action

### Security Notes
- Access tokens should be short-lived (15 min)
- Refresh tokens should be long-lived (7 days) and rotated
- Never store sensitive data in localStorage beyond tokens
- Use HttpOnly cookies for refresh tokens in production (requires backend support)
- Always validate permissions server-side — frontend guards are UX only

---

## Form Design Strategy

- All forms use @mantine/form with inline validation
- Create and Edit share the same form component (mode determined by URL params)
- Validation runs on blur + submit
- Error messages appear below fields immediately
- Success → notification toast + redirect to list
- Dirty state → warn before navigation (useBeforeUnload)
- Multi-step forms: use Stepper component for complex entities (Orders, Invoices)
- Autosave: only for Notes (debounced 2s), all other forms are manual save

---

## Table Design Strategy

- All list pages use the shared DataTable component
- Server-side pagination, sorting, and filtering by default
- Column visibility toggle via dropdown (Phase 2)
- Row selection with bulk actions (Phase 2)
- Export to CSV (Phase 3)
- Inline quick-edit for status fields (Phase 2)
- Row click → navigate to detail page
- Actions column with dropdown menu (View, Edit, Delete)

---

## Performance Strategy

1. Route-level code splitting via React.lazy + Suspense (already implemented)
2. TanStack Query staleTime of 30s prevents redundant fetches
3. Debounced search input (300ms) in DataTable
4. Memoize expensive renders with React.memo on table rows
5. Virtualize tables with 1000+ rows using @tanstack/react-virtual
6. Image lazy loading for avatars
7. Bundle analysis with rollup-plugin-visualizer
8. Tree-shaking — import only used Tabler icons

---

## Security Best Practices (Frontend)

1. Tokens in localStorage — acceptable for SPAs, use HttpOnly cookies if possible
2. XSS prevention — React auto-escapes JSX, never use dangerouslySetInnerHTML
3. CSRF — not applicable for token-based auth (no cookies sent automatically)
4. Environment variables — use VITE_* prefix, never commit .env files
5. Permission checks — always server-side, frontend is UX convenience only
6. File uploads — validate file type + size on client, enforce on server
7. Audit visibility — show audit log to admins, log all destructive actions
8. Sensitive fields — mask phone numbers, emails in non-admin views

---

## Code Standards

### Naming
- Components: PascalCase (`LeadsListPage.tsx`)
- Hooks: camelCase with `use` prefix (`use-crud-query.ts`)
- Types: PascalCase (`Lead`, `DealStage`)
- Constants: UPPER_SNAKE_CASE (`DEFAULT_PAGE_SIZE`)
- Files: kebab-case for hooks/utils, PascalCase for components

### Component Conventions
- One component per file
- Props interface defined above component
- Export named (not default) for feature components
- Default export only for App.tsx and lazy-loaded pages

### Commit Style
```
feat(leads): add lead conversion flow
fix(auth): handle token refresh race condition
refactor(table): extract column config to constants
```

---

## Testing Strategy

### Priority Order
1. Auth flow (login, logout, token refresh, guards)
2. Form validation (required fields, email format, etc.)
3. DataTable (sorting, pagination, search)
4. Permission guards (role-based rendering)
5. API service layer (request/response handling)
6. Dashboard metrics (data transformation)

### Tools
- Vitest for unit tests
- Testing Library for component tests
- MSW (Mock Service Worker) for API mocking
- Playwright for E2E critical paths

---

## BONUS 1: Sidebar Navigation Structure

```
── Dashboard
── SALES
   ├── Leads
   ├── Contacts
   ├── Companies
   └── Deals
── WORK
   ├── Tasks
   └── Tickets
── COMMERCE
   ├── Products
   ├── Orders
   └── Invoices
── ADMIN
   ├── Users
   ├── Reports
   ├── Notifications
   ├── Audit Log
   └── Settings
```

---

## BONUS 2: Top 25 Screens

1. Login
2. Forgot Password
3. Dashboard (Sales)
4. Dashboard (Admin)
5. Leads List
6. Lead Detail
7. Lead Create/Edit Form
8. Contacts List
9. Contact Detail
10. Contact Create/Edit Form
11. Companies List
12. Company Detail
13. Deals List
14. Deal Detail (with pipeline stage)
15. Deal Create/Edit Form
16. Tasks List
17. Task Create/Edit Form
18. Tickets List
19. Ticket Detail
20. Products List
21. Orders List + Detail
22. Invoices List + Detail
23. Users List + Invite
24. Settings (Profile/Password/Notifications)
25. Audit Log

---

## BONUS 3: Top 20 Reusable Components (Build Order)

1. AppShell (layout wrapper)
2. Sidebar (navigation)
3. Topbar (header)
4. AuthGuard (route protection)
5. RoleGuard (role-based access)
6. PermissionGuard (permission-based UI)
7. PageHeader (title + breadcrumbs + actions)
8. DataTable (sortable, paginated, searchable)
9. StatusBadge (colored status labels)
10. MetricCard (KPI display)
11. ChartCard (chart wrapper)
12. EmptyState (no-data placeholder)
13. ConfirmDialog (delete confirmation)
14. EntityAvatar (user/company initials)
15. FilterBar (multi-filter row)
16. SearchInput (debounced search)
17. DrawerForm (side panel form)
18. Timeline (activity feed)
19. NotesPanel (rich text notes)
20. FileUploader (drag & drop)

---

## BONUS 4: Top 15 Mistakes to Avoid

1. Building everything at once — ship MVP first, iterate
2. Custom table implementation — use the DataTable pattern, don't reinvent
3. Client-side pagination — always plan for server-side from day one
4. Hardcoding role checks — use permission-based guards, not `if (role === 'admin')`
5. Skipping loading/error/empty states — every data view needs all three
6. Putting business logic in components — extract to hooks and services
7. Not typing API responses — use TypeScript interfaces for every endpoint
8. Ignoring token refresh — users will get logged out randomly
9. Over-fetching data — use pagination, don't load all records
10. No form validation — validate on blur AND submit, show errors inline
11. Monolithic state store — separate auth, UI, and server state
12. Not lazy-loading routes — bundle size grows fast with 20+ pages
13. Inconsistent UI patterns — use shared components, don't copy-paste
14. Skipping dark mode — it's expected in 2026, Mantine makes it trivial
15. No audit trail — log destructive actions from day one

---

## BONUS 5: 30-Day Solo Developer Plan

### Week 1: Foundation
- Day 1-2: Project setup, install deps, folder structure, theme config
- Day 3: Auth store, API client with interceptors, token refresh
- Day 4: AppShell layout (Sidebar, Topbar), AuthGuard, RoleGuard
- Day 5: Login page, Forgot Password page, route protection

### Week 2: Core Components + Leads
- Day 6: DataTable component (sort, paginate, search)
- Day 7: PageHeader, StatusBadge, MetricCard, EmptyState, ConfirmDialog
- Day 8: Leads list page with DataTable
- Day 9: Lead create/edit form
- Day 10: Lead detail page with tabs

### Week 3: Contacts, Companies, Deals
- Day 11: Contacts list + form (follow Leads pattern)
- Day 12: Companies list + form
- Day 13: Deals list page
- Day 14: Deal form + pipeline stage management
- Day 15: Deal detail page

### Week 4: Tasks, Dashboard, Settings
- Day 16: Tasks list + form
- Day 17: Dashboard with MetricCards + charts
- Day 18: Settings page (profile, password)
- Day 19: Polish — responsive layout, dark mode, loading states
- Day 20: Testing — auth flow, form validation, table behavior

### After Day 20: Ship MVP, then iterate on Phase 2
