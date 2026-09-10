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

| Purpose           | Technology                                                                              | Version |
| ----------------- | --------------------------------------------------------------------------------------- | ------- |
| Framework         | [Next.js](https://nextjs.org/)                                                          | 16.3.3  |
| CMS               | [Payload](https://payloadcms.com/)                                                      | 3.88.0  |
| UI library        | [React](https://react.dev/)                                                             | 19.2.6  |
| Language          | [TypeScript](https://www.typescriptlang.org/)                                           | 5.7.3   |
| Database          | [PostgreSQL](https://www.postgresql.org/)                                               | 17      |
| DB adapter        | `@payloadcms/db-postgres`                                                               | 3.88.0  |
| Multi-tenancy     | `@payloadcms/plugin-multi-tenant`                                                       | 3.88.0  |
| Rich text editor  | `@payloadcms/richtext-lexical`                                                          | 3.88.0  |
| Image processing  | [sharp](https://sharp.pixelplumbing.com/)                                               | 0.34.2  |
| Icons             | FontAwesome Pro+ (licensed)                                                             | 7.x     |
| Styling (admin)   | [Tailwind CSS](https://tailwindcss.com/) (utilities-only, custom admin components only) | 4.x     |
| Package manager   | [pnpm](https://pnpm.io/)                                                                | 10.x    |
| Linting           | [ESLint](https://eslint.org/) (`eslint-config-next`)                                    | 9.x     |
| Formatting        | [Prettier](https://prettier.io/)                                                        | 3.x     |
| Integration tests | [Vitest](https://vitest.dev/)                                                           | 4.0.18  |
| End-to-end tests  | [Playwright](https://playwright.dev/)                                                   | 1.58.2  |

Required Node.js version: `^18.20.2 || >=20.9.0` (developed and tested on Node 24). Required
pnpm version: `^9 || ^10 || ^11`.

## What You Need Before You Start

- **Node.js** — a version matching the range above. Check yours with `node -v`.
- **pnpm** — install it once with `corepack enable` (ships with Node), or see
  [pnpm's install docs](https://pnpm.io/installation).
- **Docker Desktop** — running locally, to provide the Postgres database. Check it's running
  with `docker info`; if that errors, open Docker Desktop and wait until it's ready.
- **A FontAwesome Pro npm auth token**, needed to fetch the `@fortawesome/pro-*` packages:

  ```bash
  cp .npmrc.example .npmrc
  ```

  Then fill in your own token (ask whoever manages the license) in place of
  `YOUR_FONTAWESOME_TOKEN_HERE`. `.npmrc` is gitignored — never commit it.

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
   (default `localhost:5432`)?

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

### Password Resets

Self-service "Forgot password?" is turned off (its link is hidden on the login page, see
`custom.scss`) — there's no email adapter configured, so a reset email would never actually
reach anyone. Password resets are handled by IT instead: a super-admin opens the affected
user's document (Users collection in the admin panel) and sets a new value directly in the
Password field.

### Setting Up the Test Database

Integration tests (`pnpm test:int`, `pnpm test:coverage`) run against their own database
(`.env.test`, already committed — no secrets in it), never the dev database in `.env`. One
extra one-time step beyond the setup above: create that database and apply migrations to it.

```bash
docker exec -i <your-postgres-container> psql -U saplus_dev -d datendrehscheibe -c "CREATE DATABASE datendrehscheibe_test;"
DATABASE_URL="postgres://saplus_dev:saplus_dev@localhost:5432/datendrehscheibe_test" DATABASE_SCHEMA=payload PAYLOAD_SECRET=test-secret-do-not-use-in-production pnpm migrate
```

Re-run the `pnpm migrate` line above (against `datendrehscheibe_test`) whenever a new
migration is added, same as you would for the dev database.

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
| `pnpm test:unit`            | Run unit tests (no database needed)                                          |
| `pnpm test:int`             | Run the integration tests (needs the test database — see below)              |
| `pnpm test:e2e`             | Run the end-to-end (browser) tests                                           |
| `pnpm test:coverage`        | Run unit + integration tests with coverage; fails under 80%                  |

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

## Related Systems

The public website (`website-next`) doesn't only consume this CMS — it also reads live data
(e.g. vehicle inventory/pricing) directly from a third system, the **Datendrehscheibe**, over
its own OpenAPI-described HTTP API. This project has no direct involvement in that
integration; it's documented in `website-next`'s
[`.ai/backend/DATENDREHSCHEIBE_CLIENT.md`](https://github.com/Sport-Auto-Plus-GmbH/website-next/blob/main/.ai/backend/DATENDREHSCHEIBE_CLIENT.md)
and in the Datendrehscheibe's own README, purely for orientation if you're new to how the
three projects fit together.

## Corporate Identity (Design Tokens & Logo)

The `corporate-identity` global holds the brand's design tokens and logo, editable in the
admin panel (Globals → Corporate Identity) without a code change:

- **`colors.primary` / `colors.secondary` / `colors.destructive`** — hex values, defaulting to
  the actual Sport Auto Plus CD values. Plain text fields for now; a real color-picker UI
  (like the old project's `ColorPickerField`) can replace them later without changing the
  data shape.
- **`logo`** — an upload field (Media). `pnpm exec tsx -r dotenv/config
src/scripts/seedCorporateIdentity.ts` seeds it from the vendored master file
  (`src/seeds/assets/sport-auto-plus-logo.svg`) plus a default `sportautoplus` tenant, if
  neither exists yet — safe to re-run.

`website-next` fetches this global (public read, no auth) and applies the colors as CSS
custom properties, and renders the logo — see its own README and
`.ai/backend/CMS_CLIENT.md`-style docs for the client code.

### Media Is Always WebP (Except SVG)

The `Media` collection's `beforeOperation` hook (`collections/Media/hooks/convertToWebp.ts`)
converts every uploaded raster image (JPEG, PNG, GIF, TIFF, BMP) to WebP before it's stored —
uploading a PNG through the admin panel results in a `.webp` file on disk. SVG is
deliberately excluded: converting a vector logo/icon to WebP would rasterize it and throw
away its scalability, which defeats the purpose. If you see a MIME-type validation error on
an SVG upload, check that the file doesn't have a `<!DOCTYPE svg ...>` declaration — Payload's
built-in SVG detection doesn't strip that before checking for the `<svg>` root tag, and
misclassifies it as generic XML (common in Adobe Illustrator exports; safe to remove, it has
no effect on rendering).

## Custom Admin Branding

The login page uses the real Sport Auto Plus branding; the rest of the admin panel stays on
Payload's neutral default theme:

- **`src/components/branding/Logo.tsx`** — replaces the login page's logo, wired via
  `admin.components.graphics.Logo` in `src/payload.config.ts`. Reads the logo straight from
  the `corporate-identity` global (see "Corporate Identity" above), falling back to the
  static `public/cd/logo/sport-auto-plus-logo.svg` if none is set.
- **`src/app/(payload)/custom.scss`** — gives the login page's submit button the brand
  orange. Static (matches the CorporateIdentity global's default hex), not read live from the
  CMS — see the comment there for why.
- A collapsed-nav **Icon** hasn't been added yet — needs a square version of the mark first.

### Styling Custom Admin Components with Tailwind

Custom admin components (`components/`, e.g. `Logo.tsx`) use Tailwind CSS utility classes
instead of inline styles — see [`.ai/cms/ADMIN_COMPONENTS.md`](.ai/cms/ADMIN_COMPONENTS.md)
for the rule and setup details (`src/app/(payload)/tailwind.css`,
`src/app/(payload)/custom.scss`). It's utilities-only: Tailwind's preflight reset is
deliberately excluded so it doesn't fight Payload's own admin panel styling everywhere else.
This is scoped to the admin panel only — it has nothing to do with, and doesn't replace, the
Website's own separate Tailwind setup.

## CI/CD

`.github/workflows/` — carried over from the old `Payload` repo, adapted for this project's
pnpm/Next.js stack (no deployment/workflow-shape changes):

- **`c_test.yml`** — applies migrations to a disposable Postgres service container and runs
  `pnpm test:coverage` (see "Coverage" in `.ai/quality/TESTING.md`). Runs on every PR. No
  separate linting job — Husky's pre-commit/pre-push hooks already enforce format/lint
  locally before anything reaches a PR.
- **`pull_request_actions.yml`** — deploys the PR's branch to the `dev` environment, but only
  when the PR carries a `deploy` label (add it manually when you want a live preview of that
  PR; most PRs don't need one).
- **`c_build_and_deploy.yml`** — the actual build+deploy: builds on the runner
  (`generate:types`, `generate:importmap`, `build`), then builds and pushes the Docker image
  and deploys it to Azure App Service via the shared
  `Sport-Auto-Plus-GmbH/infrastructure` action. Requires the same secrets as the old repo
  (`FONTAWESOME_TOKEN`, `CONTAINER_REGISTRY_*`, `AZURE_*`) configured on this repo/its GitHub
  Environments — not something this repo can set up on its own.

The `Dockerfile` mirrors the old repo's pattern (builds once on the runner, the image just
installs production dependencies and copies the pre-built `.next/standalone` output — not a
second from-scratch build inside Docker). Not carried over: the old repo's Dash0/
OpenTelemetry instrumentation (`telemetry.cjs`), since that needs its own dependencies and
endpoint configuration this project doesn't have yet — add it deliberately if/when this
project adopts the same observability setup.

## Troubleshooting

- **`pnpm dev` can't connect to the database** — see
  [Checking the database connection](#checking-the-database-connection) above.
- **Admin panel shows a blank/error page** — check that `pnpm migrate` (step 4) completed
  without errors.
- **Changed a collection's fields and TypeScript complains** — run `pnpm generate:types`.
