# 🧠 Master Prompt — Self-Hosted Editing Work Tracker (Next.js)
> Paste this entire prompt into your Agentic IDE (Cursor, Windsurf, etc.) to scaffold and build the full app from scratch.

---

## 🎯 Project Overview

Build a **self-hosted, personal video editing work tracker** web app using **Next.js 15+ with TypeScript**. This is a single-user internal tool — not a SaaS — for tracking editing/creative projects, linking them to clients, and recording payment status. The app will later be made open source.

**Design principle**: Clean, minimal, functional. Prioritize speed of use over visual flair. Think compact tables, clear status badges, and one-click filters — not heavy dashboards.

---

## 🛠️ Tech Stack (Non-Negotiable)

| Layer | Choice |
|---|---|
| Framework | Next.js 15+ (App Router) with TypeScript |
| Database | SQLite (local dev) → PostgreSQL (VPS/production) |
| ORM | Prisma (with migrations) |
| Styling | Tailwind CSS + shadcn/ui |
| Validation | Zod (shared between client and server) |
| API Layer | Next.js Route Handlers (REST-style, `/api/*`) |
| Auth | None for MVP — protect via `.env` secret or reverse proxy later |
| Deployment | Docker Compose (app + DB) |

Do **not** use tRPC, Supabase, Firebase, Clerk, NextAuth, or any cloud-lock-in services unless explicitly asked later.

---

## 📁 Project Structure

Scaffold the following file/folder structure:

```
/
├── app/
│   ├── layout.tsx                  # Root layout with sidebar nav
│   ├── page.tsx                    # Redirects to /projects
│   ├── projects/
│   │   ├── page.tsx                # Main project list / dashboard
│   │   ├── new/page.tsx            # New project form
│   │   └── [id]/
│   │       ├── page.tsx            # Project detail view
│   │       └── edit/page.tsx       # Edit project form
│   ├── clients/
│   │   ├── page.tsx                # Client list
│   │   ├── new/page.tsx            # New client form
│   │   └── [id]/page.tsx           # Client detail + their projects
│   └── api/
│       ├── projects/
│       │   ├── route.ts            # GET (list+filter), POST (create)
│       │   └── [id]/route.ts       # GET, PUT, DELETE
│       └── clients/
│           ├── route.ts            # GET, POST
│           └── [id]/route.ts       # GET, PUT, DELETE
├── components/
│   ├── ui/                         # shadcn/ui auto-generated components
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   ├── projects/
│   │   ├── ProjectTable.tsx        # Main data table
│   │   ├── ProjectFilters.tsx      # Filter bar (status, payment, client, search)
│   │   ├── ProjectForm.tsx         # Shared create/edit form
│   │   ├── ProjectStatusBadge.tsx  # Colored badge for status
│   │   └── PaymentTypeBadge.tsx    # Colored badge for payment type
│   ├── clients/
│   │   ├── ClientTable.tsx
│   │   └── ClientForm.tsx
│   └── dashboard/
│       └── KpiCards.tsx            # Stats summary cards
├── lib/
│   ├── prisma.ts                   # Prisma client singleton
│   ├── validators.ts               # Zod schemas for Project and Client
│   └── utils.ts                   # cn(), formatCurrency(), formatDate()
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                     # Seed with realistic dummy data
├── types/
│   └── index.ts                    # Shared TypeScript types/interfaces
├── .env.example
├── docker-compose.yml
├── Dockerfile
└── README.md
```

---

## 🗃️ Database Schema (Prisma)

Create `prisma/schema.prisma` with the following exact models:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"  // Switch to "postgresql" for VPS
  url      = env("DATABASE_URL")
}

model Client {
  id           String    @id @default(cuid())
  name         String
  contactEmail String?
  notes        String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  projects     Project[]
}

model Project {
  id            String        @id @default(cuid())
  title         String
  clientId      String
  client        Client        @relation(fields: [clientId], references: [id])
  status        ProjectStatus @default(PLANNED)
  paymentType   PaymentType   @default(UNPAID)
  agreedAmount  Float?
  currency      String        @default("INR")
  isPaid        Boolean       @default(false)
  tags          String        @default("") // comma-separated string for SQLite compat
  notes         String?
  createdAt     DateTime      @default(now())
  dueDate       DateTime?
  completedAt   DateTime?
  updatedAt     DateTime      @updatedAt
}

enum ProjectStatus {
  PLANNED
  IN_PROGRESS
  DELIVERED
  CANCELLED
}

enum PaymentType {
  PAID_ADVANCE
  UNPAID
  FREE
  SALARY
}
```

After defining the schema, run:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## 🔐 Environment Variables

Create `.env.example` with:

```env
# For SQLite (local)
DATABASE_URL="file:./dev.db"

# For PostgreSQL (VPS)
# DATABASE_URL="postgresql://user:password@localhost:5432/edittracker"
```

---

## 🔌 API Route Handlers

### `GET /api/projects`
Accept query params: `?status=`, `?paymentType=`, `?clientId=`, `?isPaid=`, `?search=`, `?sort=` (values: `createdAt_desc`, `createdAt_asc`, `dueDate_asc`, `agreedAmount_desc`, `clientName_asc`)

Return: array of projects with nested `client { id, name }`.

### `POST /api/projects`
Accept JSON body validated with Zod. Return created project.

### `GET /api/projects/[id]`
Return single project with full client details.

### `PUT /api/projects/[id]`
Accept partial JSON body. Validate with Zod `.partial()`. Return updated project.

### `DELETE /api/projects/[id]`
Soft-delete or hard-delete. Return `{ success: true }`.

Implement the same pattern for `/api/clients`.

---

## ✅ Zod Validators (`lib/validators.ts`)

```ts
import { z } from "zod"

export const ProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  clientId: z.string().cuid(),
  status: z.enum(["PLANNED", "IN_PROGRESS", "DELIVERED", "CANCELLED"]).default("PLANNED"),
  paymentType: z.enum(["PAID_ADVANCE", "UNPAID", "FREE", "SALARY"]).default("UNPAID"),
  agreedAmount: z.number().positive().nullable().optional(),
  currency: z.string().default("INR"),
  isPaid: z.boolean().default(false),
  tags: z.string().optional().default(""),
  notes: z.string().optional(),
  dueDate: z.coerce.date().nullable().optional(),
  completedAt: z.coerce.date().nullable().optional(),
})

export const ClientSchema = z.object({
  name: z.string().min(1).max(100),
  contactEmail: z.string().email().optional().or(z.literal("")),
  notes: z.string().optional(),
})

export type ProjectInput = z.infer<typeof ProjectSchema>
export type ClientInput = z.infer<typeof ClientSchema>
```

---

## 🖥️ Pages & UI

### `/projects` — Main Dashboard Page

This is the most important page. Build it with:

**1. KPI Summary Cards (`KpiCards.tsx`)**
A horizontal row of 4 stat cards at the top:
- **Total Projects** — count of all projects
- **Unpaid** — count where `paymentType = UNPAID OR PAID_ADVANCE` and `isPaid = false`, shown in amber/red
- **Free Work** — count where `paymentType = FREE`, shown in muted
- **Earned (Paid)** — sum of `agreedAmount` where `isPaid = true`, formatted as currency

**2. Filter Bar (`ProjectFilters.tsx`)**
A compact filter row below the KPI cards:
- **Search input** — debounced, searches `title` and `notes`
- **Status tabs** — pill-style: `All | Planned | In Progress | Delivered | Cancelled`
- **Payment filter** — dropdown: `All Types | Paid Advance | Unpaid | Free | Salary`
- **Client filter** — dropdown populated from DB
- **Paid toggle** — checkbox or toggle: `Show only unpaid`
- **Sort dropdown** — `Newest | Oldest | Due Date | Highest Value | Client A-Z`

**3. Project Table (`ProjectTable.tsx`)**
Columns:
| # | Title | Client | Status | Payment Type | Amount | Paid? | Due Date | Actions |
|---|---|---|---|---|---|---|---|---|

- Status column: colored badge (`PLANNED` = blue, `IN_PROGRESS` = yellow, `DELIVERED` = green, `CANCELLED` = red/muted)
- Payment Type column: colored badge (`UNPAID` = red, `PAID_ADVANCE` = amber, `FREE` = gray, `SALARY` = purple)
- Paid? column: green checkmark or red X icon
- Actions: Edit and Delete icon buttons (with confirm dialog for delete)
- Clicking a row title navigates to `/projects/[id]`
- Table shows "No projects found" empty state with a CTA to add one

**4. Quick Add Button**
A `+ New Project` button in the top-right that navigates to `/projects/new`.

---

### `/projects/new` and `/projects/[id]/edit` — Project Form

Use a single shared `ProjectForm.tsx` component for both create and edit. Fields:

- **Title** — text input (required)
- **Client** — select dropdown (required), with a small `+ New Client` link beside it
- **Status** — segmented control or select (`PLANNED`, `IN_PROGRESS`, `DELIVERED`, `CANCELLED`)
- **Payment Type** — segmented control or select (`UNPAID`, `PAID_ADVANCE`, `FREE`, `SALARY`)
- **Agreed Amount** — number input (hidden/disabled when `FREE` or `SALARY`)
- **Currency** — text input, default `INR`
- **Is Paid** — toggle/checkbox
- **Tags** — text input (comma-separated, e.g. `YOUTUBE, SHORTS, TRAILER`)
- **Due Date** — date picker
- **Notes** — textarea

Submit button: `Save Project` / `Update Project`. Cancel navigates back.

---

### `/clients` — Client List Page

Simple table with columns: Name, Email, # Projects, Total Agreed Amount, Actions (Edit/Delete).

### `/clients/[id]` — Client Detail Page

Shows client info + a filtered project table showing only that client's projects + a mini KPI (total projects, total value, unpaid count).

---

## 🎨 UI Design Guidelines

- Use `shadcn/ui` components throughout: `Button`, `Input`, `Select`, `Table`, `Badge`, `Card`, `Dialog`, `Separator`, `Tabs`
- Color theme: **neutral/zinc base** with colored accents only for badges and KPI cards
- Sidebar navigation: `Projects`, `Clients` links with icons (use `lucide-react`)
- Sidebar footer: app name `EditTracker` + version tag
- Typography: clean sans-serif, compact line heights, no decorative fonts
- Responsive: works on desktop first, tablet acceptable, mobile not required for MVP
- No animations, no loaders beyond a simple spinner — keep it snappy

---

## 🌱 Seed Data (`prisma/seed.ts`)

Generate realistic dummy data for testing:
- 4 clients (e.g., `TechYoutuber`, `GameDevStudio`, `The Work Smart`, `Personal`)
- 15 projects spread across clients with varied statuses, payment types, amounts, and dates
- Mix of paid and unpaid entries to make KPI cards meaningful

Run with:
```bash
npx ts-node prisma/seed.ts
```

---

## 🐳 Docker Setup

### `Dockerfile`
```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### `docker-compose.yml` (PostgreSQL variant)
```yaml
version: "3.9"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      - db
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: edittracker
      POSTGRES_PASSWORD: changeme
      POSTGRES_DB: edittracker
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

---

## 📋 Build Order (Follow This Sequence)

Build in this exact order to avoid dependency issues:

1. **Init project** — `npx create-next-app@latest` with TypeScript, Tailwind, App Router, no src/ dir
2. **Install dependencies** — `prisma`, `@prisma/client`, `zod`, `lucide-react`, `shadcn/ui` init
3. **Prisma schema** — write schema, run `migrate dev`, run `generate`
4. **Zod validators** — write `lib/validators.ts`
5. **Prisma client singleton** — write `lib/prisma.ts`
6. **API routes** — clients first (simpler), then projects with full filter/sort logic
7. **Layout + Sidebar** — root layout with sidebar nav
8. **Client pages** — list and form first (no dependencies)
9. **Project pages** — list (with filters, KPI cards, table), then form, then detail
10. **Seed data** — write and run seed script
11. **Docker** — write Dockerfile + docker-compose.yml
12. **README** — write setup/run instructions

---

## ✅ Definition of Done (MVP)

The app is complete when:

- [ ] You can create, edit, and delete clients
- [ ] You can create, edit, and delete projects linked to clients
- [ ] The project list filters correctly by status, payment type, client, and paid/unpaid
- [ ] Search works on project title and notes
- [ ] All 4 KPI cards show correct live data
- [ ] Sorting works across all sort options
- [ ] The app runs locally via `npm run dev`
- [ ] The app can be started via `docker-compose up`
- [ ] No TypeScript errors on `npm run build`
- [ ] No hardcoded values — all config via `.env`

---

## 🚫 Out of Scope for MVP

Do **not** build these unless explicitly asked:
- Authentication / login system
- PaymentRecord table or partial payments
- Time tracking / time entries
- Invoice PDF generation
- CSV/JSON export
- Charts or analytics graphs
- Mobile responsiveness
- Dark mode toggle
- Email notifications

---

*Generated for Zaid Ali — EditTracker Personal Tool — Open Source Roadmap*
