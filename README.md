# EditTracker - Self-Hosted Work Tracker for Video Editors

A minimal, privacy-first project tracker for freelance video editors. Users sign in with Clerk, manage their own clients and projects, and upload project work to Supabase Storage.

## Features

- Project management with status, payment type, amount, due dates, and notes
- Client directory with project counts and totals
- KPI dashboard for unpaid work, free work, and earned revenue
- Filtering, sorting, and search
- Tags for project categorization
- Docker support for local and self-hosted Postgres
- Vercel-friendly deployment with hosted Postgres

## Tech Stack

- Next.js 16
- Clerk authentication
- Prisma ORM
- PostgreSQL
- Supabase Storage
- shadcn/ui + Tailwind CSS
- Zod validation

## Environment Variables

Copy `.env.example` to `.env` and set:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
DATABASE_URL="postgresql://edittracker:edittracker@localhost:5432/edittracker?schema=public"
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
SUPABASE_STORAGE_BUCKET="project-files"
```

## Local Development

If you already have Postgres running locally:

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

If you want the repo to bring up Postgres for you:

```bash
docker compose up -d postgres
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

## Docker

This repo includes a Postgres service and an app container. The app runs `prisma migrate deploy` on startup.

```bash
docker compose up -d --build
```

Then open `http://localhost:3000`.

## Vercel Deployment

1. Create a Clerk application and add the Clerk env vars from `.env.example` to Vercel.
2. Create a Supabase project.
3. Use the Supabase Postgres connection string as `DATABASE_URL`.
4. Create a private storage bucket named `project-files` or set `SUPABASE_STORAGE_BUCKET` to your preferred bucket name.
5. Add `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to Vercel.
6. Deploy.

`vercel.json` runs:

```bash
npm run db:migrate:deploy && npm run build
```

That ensures the Prisma migrations are applied before Next.js builds.

## Helpful Scripts

```bash
npm run db:generate
npm run db:migrate
npm run db:migrate:deploy
npm run db:seed
npm run db:studio
```

## Notes

- `/projects/new` is forced dynamic so builds do not fail when no database is present during prerender.
- All app routes and API routes are protected with Clerk.
- Data is scoped by Clerk `userId`, so each signed-in user sees only their own clients, projects, and files.
- Project files are uploaded through authenticated API routes and stored in Supabase Storage.

## License

MIT
