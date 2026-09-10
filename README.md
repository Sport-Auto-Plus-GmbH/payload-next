# CMS for Website Frontend

**Repository:** `payload-next`

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
| Icons             | FontAwesome Pro+ (licensed)                          | 7.x     |
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
- **Docker Desktop** — running locally, to provide the Postgres database. Check it's running
  with `docker info`; if that errors, open Docker Desktop and wait until it's ready.
- **A FontAwesome Pro npm auth token** in your own global `~/.npmrc` (ask whoever manages the
  license) — only needed if `pnpm install` fails to fetch the `@fortawesome/pro-*` packages:

  ```
  //npm.fontawesome.com/:_authToken=YOUR_TOKEN_HERE
  ```

  Never put the token in this project's own `.npmrc` — that one is committed and only maps
  `@fortawesome` to FontAwesome's registry, not the secret itself.

## Setting Up the Project (Step by Step)

All commands below are run from inside this folder (`payload-next/`), unless noted otherwise.

1. **Copy the environment file.** This gives the project the settings it needs (database
   connection, secret key) to run locally:

   ```bash
   cp .env.example .env
   ```

   The defaults already point at the shared local database described below, so you normally
   don't need to change anything in `.env`.

2. **Make sure the shared Postgres 17 container is running** in Docker Desktop, reachable at
   the connection string already set in your `.env` (`DATABASE_URL`). This repository
   doesn't start that container itself — it's shared with other projects in the Sport Auto
   Plus workspace. If you're not sure whether it's running, see
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

Postgres runs inside a Docker container, managed outside this repository (this project just
connects to it — it doesn't start or own that container). If a step above fails with a
connection error, check Docker Desktop first:

1. **Is Docker Desktop running at all?**

   ```bash
   docker info
   ```

   If this errors out, open Docker Desktop and wait until it says it's running.

2. **Is a Postgres container actually up and listening on the port your `.env` expects**
   (default `127.0.0.1:5432`)?

   ```bash
   docker ps --filter "publish=5432"
   ```

   You can check the same thing visually in the Docker Desktop app, under **Containers** —
   look for one whose port mapping includes `5432`.

If neither shows a running container, ask a teammate how the shared local database is
started in this workspace — this repository assumes it's already available, not that you
need to create it yourself.

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

## Custom Admin Branding (Not Yet Configured)

The admin panel currently uses Payload's own default look — no custom design has been built
yet. The hook points are already prepared for when it is:

- **`src/components/branding/`** — where custom logo/icon components will live (see the
  README in that folder).
- **`admin.components.graphics`** and **`admin.meta`** in `src/payload.config.ts` — already
  commented with the exact shape to wire in a custom logo, favicon, and page title suffix.
- **`src/app/(payload)/custom.scss`** — global admin style overrides, already imported by the
  admin layout; currently empty.

## Troubleshooting

- **`pnpm dev` can't connect to the database** — see
  [Checking the database connection](#checking-the-database-connection) above.
- **Admin panel shows a blank/error page** — check that `pnpm migrate` (step 4) completed
  without errors.
- **Changed a collection's fields and TypeScript complains** — run `pnpm generate:types`.
