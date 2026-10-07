# AIcomplish

A fast, minimal task manager built with **Next.js (App Router)** and **SQLite**.
Create, edit, delete and search tasks (title + description).

## Getting started

Requires Node.js 24 LTS (`nvm use`).

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script              | Purpose                         |
| ------------------- | ------------------------------- |
| `npm run dev`       | Development server              |
| `npm run build` / `npm start` | Production build / serve |
| `npm test`          | Unit tests (Vitest)             |
| `npm run typecheck` | TypeScript check                |
| `npm run lint`      | ESLint                          |

Configuration: `DATABASE_PATH` (default `./data/aicomplish.db`, see `.env.example`).
The database is created and migrated automatically on first request.

## Architecture

A server-rendered, multi-page app (not a SPA). Every screen is a route; reads happen in
Server Components and writes are plain `<form action>` Server Actions that redirect back,
so everything works without client JavaScript.

```
src/
  app/
    page.tsx                   list + search (GET form) + pagination (links)
    tasks/new/                 create page
    tasks/[id]/edit/           edit page
    tasks/[id]/delete/         delete confirmation page
    actions.ts                 Server Actions (validate → repository → revalidate → redirect)
  components/                  TaskItem, Pagination (server); TaskForm (only client component, for error/pending state)
  lib/db/                      client.ts (connection, WAL), migrations.ts (versioned via user_version)
  lib/tasks/                   schema.ts (Zod validation), repository.ts (SQL), types.ts
```

- **Speed:** HTML is rendered on the server and navigations are prefetched; client JS is minimal.
- **Scale:** 30 tasks per page with server-side search and indexed queries keep large lists snappy.
- **Data safety:** WAL journaling, transactional migrations, parameterized SQL, server-side validation, DB stored in git-ignored `data/`.
- **Responsive & accessible:** fluid layout, dark mode, keyboard and screen-reader friendly, URL-addressable state (`/?q=milk&page=2`).

## Adding a field

Append a migration in `lib/db/migrations.ts`, then extend `types.ts`, `schema.ts` and `repository.ts`.
