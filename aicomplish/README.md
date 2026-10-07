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
| `npm test`          | Unit tests (Vitest, `tests/unit`) |
| `npm run test:ct`   | Cypress component tests, headless (`tests/component`) |
| `npm run cy:open`   | Cypress component runner (interactive) |
| `npm run typecheck` | TypeScript check (app + tests)  |
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

## Testing

All tests live in `tests/`:

- `tests/component/*.cy.tsx` – Cypress **component** tests (no e2e). Each test mounts a component in isolation
  and is independent of the others. Server Actions are passed to components as props, so tests mock them with
  `cy.stub()`; `next/link` and `next/navigation` are replaced by tiny stubs (`tests/support/stubs`) and Vite is
  the dev server, which keeps runs fast. Page files (`app/**/page.tsx`) only load data and render a
  `*View` / `*Card` component, which is what the tests mount.
  Create/edit/delete flows run against a stateful fake of the Server Actions (`tests/support/fakeTaskApi.ts`)
  that uses the real validation schema.
- `tests/unit/*.test.ts` – Vitest tests for the repository, migrations, validation and Server Actions
  (in-memory SQLite).

## Adding a field

Append a migration in `lib/db/migrations.ts`, then extend `types.ts`, `schema.ts` and `repository.ts`.
