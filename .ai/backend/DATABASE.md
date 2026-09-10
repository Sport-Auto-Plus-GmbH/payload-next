# Database (Postgres)

Rules for the database layer in this project. Adapter: `@payloadcms/db-postgres` (Drizzle
under the hood).

---

# Schema Changes Go Through Payload's Config, Not Raw SQL

The database schema is derived from collection/global/block field definitions. To change the
schema: change the field definitions, then generate a migration — never hand-write DDL
against a running database outside of a migration file.

---

# Migrations Are Generated, Not Hand-Authored

```bash
pnpm migrate:create   # generates a new migration reflecting the current config diff
pnpm migrate          # applies pending migrations
pnpm migrate:status   # shows pending/applied state
```

The AI MAY run `migrate:create` to produce a migration file for review. The AI MUST NOT run
`migrate` against any shared/remote environment without being explicitly asked — applying
migrations is a deliberate, human-directed step. This applies from the very first migration —
do not skip generating one just because the schema is still small.

Migration files live in `src/migrations/` with a generated timestamp-prefixed name, and are
aggregated in `src/migrations/index.ts`. Never rename, delete, reorder, or hand-edit a
migration that may already be applied anywhere (including other developers' local databases,
staging, or production).

---

# `dbName` and Identifier Length

Postgres has identifier length limits. Set a short `dbName` on a collection proactively when
its slug or its generated block/relationship table names are likely to be long (deeply
nested blocks, long relationship names) — decide this when the collection is designed, not
as a later fix once names start getting truncated. Changing `dbName` later requires a rename
migration, not just a config edit.

---

# Indexes

Add `index: true` to fields that are filtered or sorted on frequently (slugs, publish dates,
tenant foreign keys) from the start. Confirm the generated migration actually creates the
expected index before considering the change done.

---

# Idempotent Migration Helpers

Build shared migration helpers (e.g. a helper for schema-name-aware statements, using
whatever `DATABASE_SCHEMA` is configured) under `migrations/helpers/` the first time a
migration needs to be safe to re-run or schema-name-sensitive, and reuse them for every
migration afterward — do not write a one-off, schema-unaware migration when the project has
multiple Postgres schemas in play.

---

# Local Development

Build the Postgres connection string from discrete env vars
(`DATABASE_HOST/PORT/NAME/USER/PASSWORD`), and disable SSL only for
`localhost`/`127.0.0.1`/`::1` — never hardcode `sslmode` or a full connection string
elsewhere. Use a schema-push flag (e.g. `PAYLOAD_DB_PUSH=true`) for rapid local iteration
only; production always applies through generated migrations, never a schema push.

---

# Seeding

Keep seed data builders under `seeds/`, composed into a single `seed.ts` entry point (fired
via `onInit` when a seed flag is set) — do not inline large literal seed data directly in
`seed.ts`.

---

# Never Bypass Access Control From a Script

Scripts and seed builders commonly need `overrideAccess: true` to run outside a normal
authenticated request — that is expected for trusted, operator-run scripts/seeds.
Application code (collection hooks, admin components, anything reachable by a regular editor
or the public API) MUST NOT use `overrideAccess: true` to sidestep `cms/ACCESS_CONTROL.md`.
