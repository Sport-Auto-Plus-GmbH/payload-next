# payload-next

Headless Payload CMS for Sport Auto Plus. This project has no frontend of its own — the
[`website-next`](https://github.com/Sport-Auto-Plus-GmbH/website-next) repository is the only
consumer of its REST API.

Before touching any code, read [`.ai/README.md`](.ai/README.md) — it defines the mandatory
engineering rules, architecture, and conventions for this project.

## Local Development

This project uses the shared local Postgres container defined in the workspace root
(`../ensure-db.sh` / `../Datendrehscheibe/postgres/docker-compose.yaml`), in its own
`payload` schema so it never collides with Datendrehscheibe's tables.

1. `cp .env.example .env` (defaults already match the shared local container)
2. From the workspace root: `bash ensure-db.sh` (starts/reuses the `datendrehscheibe-dev`
   container), or just run `../dev-up.sh` to start the whole local stack at once
3. `pnpm install`
4. `pnpm migrate` — apply the committed migrations to your local database
5. `pnpm dev` — open `http://localhost:3000/admin`

### First admin user

Create the first super-admin account from the command line instead of the admin panel's
own first-user form, so it always gets the `super-admin` role:

```bash
pnpm exec tsx -r dotenv/config src/scripts/createSuperAdmin.ts <email> <password>
```

Safe to re-run — it skips creating the user if that email already exists.

## Architecture

- **Multi-tenant**: `@payloadcms/plugin-multi-tenant` + a `Tenants` collection
  (`name`, `slug`, `domain`, `allowPublicRead`). `Users` carries a global `roles` field
  (`super-admin` / `user`) and a per-tenant `roles` field (`tenant-admin` / `tenant-viewer`)
  on each row of the plugin-managed `tenants` array. See `.ai/backend/MULTI_TENANCY.md`.
- **Collections so far**: `Tenants`, `Users`, `Media` (registered as the first
  tenant-scoped collection). Extend following `.ai/cms/COLLECTIONS.md`.
- Every schema-affecting change ships with a migration under `src/migrations/` — see
  `.ai/backend/DATABASE.md`.

## Scripts

- `pnpm dev` — start the dev server
- `pnpm build` / `pnpm start` — production build / start
- `pnpm generate:types` — regenerate `src/payload-types.ts` after changing fields
- `pnpm migrate:create` — generate a migration for a schema change
- `pnpm migrate` / `pnpm migrate:status` — apply / inspect migrations
- `pnpm test:int` — Vitest integration tests
- `pnpm test:e2e` — Playwright e2e tests
- `pnpm lint` / `pnpm format` — lint / format
- `src/scripts/createSuperAdmin.ts` — bootstrap the first super-admin user (see above)
