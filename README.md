# EditTracker — Self-Hosted Work Tracker for Video Editors

A minimal, privacy-first project tracker built for freelance video editors. Track your clients, projects, payment types, and earnings — all on your own machine or server.

## Features

- 📁 **Project Management** — Track projects with status, payment type, amount, due dates, and notes
- 👥 **Client Directory** — Manage clients and studios you work with
- 💰 **KPI Dashboard** — See total projects, unpaid work, free work, and total earned at a glance
- 🔍 **Filter & Sort** — Filter by status, payment type, client, and search by title
- 🏷️ **Tags** — Tag projects (wedding, reels, corporate, etc.)
- 🐳 **Docker Ready** — One-command deployment with Docker Compose
- 🔒 **100% Local** — No cloud, no accounts, no tracking

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Prisma ORM** + **SQLite** (zero-config database)
- **shadcn/ui** + **Tailwind CSS**
- **Zod** validation

## Quick Start (Local)

```bash
# 1. Clone and install
git clone <repo>
cd edittracker
npm install

# 2. Set up environment
cp .env.example .env

# 3. Initialize database
npx prisma db push

# 4. (Optional) Seed sample data
npx tsx prisma/seed.ts

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quick Start (Docker)

```bash
cp .env.example .env
docker compose up -d
```

Open [http://localhost:3000](http://localhost:3000).

Data is persisted in a Docker volume (`edittracker_data`).

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `file:./dev.db` | SQLite database path |
| `NEXTAUTH_SECRET` | — | (Future use for auth) |

See `.env.example` for a template.

## Project Structure

```
edittracker/
├── app/
│   ├── api/          # REST API routes
│   ├── projects/     # Project pages
│   └── clients/      # Client pages
├── components/
│   ├── dashboard/    # KPI cards
│   ├── projects/     # Project table, filters, form, badges
│   ├── clients/      # Client form
│   └── layout/       # Sidebar
├── lib/              # Prisma client, utilities, validators
├── prisma/           # Schema + seed
└── types/            # TypeScript types
```

## Payment Types

| Type | Description |
|---|---|
| `UNPAID` | Work done, payment not yet agreed or received |
| `PAID_ADVANCE` | Client paid an advance |
| `FREE` | Done as a favour, no charge |
| `SALARY` | Ongoing salary arrangement |

## Self-Hosting Without Docker

Any Node.js 18+ host works. Set `DATABASE_URL` to a SQLite file path and run:

```bash
npm run build && npm start
```

## License

MIT
