# payload-next

This is the **headless CMS** for Sport Auto Plus, built on [Payload](https://payloadcms.com/).
"Headless" means it has no public website of its own — it only manages content and data
through an admin panel and an API. The actual public website lives in a separate project,
[`website-next`](https://github.com/Sport-Auto-Plus-GmbH/website-next), which reads its
content from here.

If you're going to write code in this repository (including AI assistants), read
[`.ai/README.md`](.ai/README.md) first — it defines the engineering rules and conventions
this project follows.

## Tech Stack

| Purpose           | Technology                                           | Version |
| ----------------- | ---------------------------------------------------- | ------- |
| Framework         | [Next.js](https://nextjs.org/)                       | 16.3.3  |
| CMS               | [Payload](https://payloadcms.com/)                   | 3.88.0  |
| UI library        | [React](https://react.dev/)                          | 19.2.6  |
| Language          | [TypeScript](https://www.typescriptlang.org/)        | 5.7.3   |
| Database          | [PostgreSQL](https://www.postgresql.org/)            | 17      |
| DB adapter        | `@payloadcms/db-postgres`                            | 3.88.0  |
| Multi-tenancy     | `@payloadcms/plugin-multi-tenant`                    | 3.88.0  |
| Rich text editor  | `@payloadcms/richtext-lexical`                       | 3.88.0  |
| Image processing  | [sharp](https://sharp.pixelplumbing.com/)            | 0.34.2  |
| Package manager   | [pnpm](https://pnpm.io/)                             | 10.x    |
| Linting           | [ESLint](https://eslint.org/) (`eslint-config-next`) | 9.x     |
| Formatting        | [Prettier](https://prettier.io/)                     | 3.x     |
| Integration tests | [Vitest](https://vitest.dev/)                        | 4.0.18  |
| End-to-end tests  | [Playwright](https://playwright.dev/)                | 1.58.2  |

Required Node.js version: `^18.20.2 || >=20.9.0` (developed and tested on Node 24). Required
pnpm version: `^9 || ^10 || ^11`.

## What You Need Before You Start

- **Node.js** — a version matching the range above. Check yours with `node -v`.
- **pnpm** — install it once with `corepack enable` (ships with Node), or see
  [pnpm's install docs](https://pnpm.io/installation).
- **A running PostgreSQL 17 database** you can connect to — see the next section for how to
  get and verify one.

## Setting Up the Project (Step by Step)

All commands below are run from inside this folder (`payload-next/`), unless noted otherwise.

1. **Copy the environment file.** This gives the project the settings it needs (database
   connection, secret key) to run locally:

   ```bash
   cp .env.example .env
   ```

   The defaults already point at the shared local database described below, so you normally
   don't need to change anything in `.env`.

2. **Make sure a PostgreSQL 17 database is running and reachable** at the connection string
   in your `.env` (`DATABASE_URL`). This repository doesn't start or manage that database
   itself — how you run it depends on your local setup (a shared container used by the wider
   Sport Auto Plus workspace, your own Docker container, a local Postgres install, ...). If
   you're not sure whether one is already running, see
   [Checking the database connection](#checking-the-database-connection) below.

   This project keeps its own tables inside a dedicated schema (`DATABASE_SCHEMA=payload` in
   `.env`), so it's safe to point it at a Postgres instance that other projects also use —
   it won't collide with their tables.

3. **Install dependencies:**

   ```bash
   pnpm install
   ```

4. **Apply the database migrations.** This creates all the tables Payload needs:

   ```bash
   pnpm migrate
   ```

5. **Start the dev server:**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000/admin](http://localhost:3000/admin) in your browser — you
   should see the Payload login screen.

### Checking the database connection

If a step above fails with a connection error, use one of these to check whether Postgres is
actually reachable at the host/port configured in your `.env` (default: `127.0.0.1:5432`)
before looking anywhere else:

```bash
# If your database runs in Docker, see if any container is publishing port 5432:
docker ps --filter "publish=5432"

# Works regardless of Docker — checks if anything is listening on the port at all:
nc -z -v 127.0.0.1 5432 && echo "Something is listening on 5432"

# If you have the Postgres command-line tools installed, this checks the server itself:
pg_isready -h 127.0.0.1 -p 5432
```

If none of these show anything running, you need to start your Postgres instance first —
ask a teammate how the shared local database is started in this workspace, or start your own
Postgres 17 (e.g. `docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:17`) and
update `DATABASE_URL` in `.env` to match.

### Creating your first admin account

Instead of using the admin panel's own sign-up form, create your account from the terminal so
it automatically gets the correct `super-admin` permissions:

```bash
pnpm exec tsx -r dotenv/config src/scripts/createSuperAdmin.ts you@example.com "a-strong-password"
```

Then log in at `/admin` with that email and password. This command is safe to run again
later — it does nothing if an account with that email already exists.

## Everyday Commands

| Command                     | What it does                                                                 |
| --------------------------- | ---------------------------------------------------------------------------- |
| `pnpm dev`                  | Start the local dev server                                                   |
| `pnpm build` / `pnpm start` | Build for production / run that production build                             |
| `pnpm lint`                 | Check the code for style/quality problems                                    |
| `pnpm format`               | Auto-format the code                                                         |
| `pnpm generate:types`       | Regenerate TypeScript types after changing a collection's fields             |
| `pnpm migrate:create`       | Create a new migration after a schema change (see `.ai/backend/DATABASE.md`) |
| `pnpm migrate`              | Apply any pending migrations                                                 |
| `pnpm migrate:status`       | Show which migrations have run                                               |
| `pnpm test:int`             | Run the integration tests                                                    |
| `pnpm test:e2e`             | Run the end-to-end (browser) tests                                           |

## How the Project Is Organized

- **`src/collections/`** — the content types Payload manages. Right now: `Tenants` (each
  dealer/brand), `Users` (admin accounts), `Media` (uploaded files).
- **`src/migrations/`** — the history of database schema changes, applied in order.
- **`src/scripts/`** — small one-off scripts you run by hand, like creating the first admin.
- **`src/payload.config.ts`** — the central configuration file wiring everything together.
- **`.ai/`** — the engineering playbook. Read it before making non-trivial changes.

## Multi-Tenancy in Short

This CMS can serve multiple dealer/brand sites from one installation. Each one is a row in
the `Tenants` collection. A user's access is controlled by two things: a global `role`
(`super-admin` sees everything; a plain `user` sees nothing by default) and, per tenant they
are assigned to, a role of `tenant-admin` (full access to that tenant's content) or
`tenant-viewer` (read-only). See [`.ai/backend/MULTI_TENANCY.md`](.ai/backend/MULTI_TENANCY.md)
for the full model.

## Troubleshooting

- **`pnpm dev` can't connect to the database** — see
  [Checking the database connection](#checking-the-database-connection) above.
- **Admin panel shows a blank/error page** — check that `pnpm migrate` (step 4) completed
  without errors.
- **Changed a collection's fields and TypeScript complains** — run `pnpm generate:types`.
