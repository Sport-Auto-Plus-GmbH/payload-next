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

# Deploy Safety: Migrations Must Never Break a Running Deploy

A schema change and a code deploy are never perfectly atomic — there is always a window
where either the old code runs against the new schema, or the new code runs against the old
schema (a rolling deploy, a deploy that fails partway, a migration that's slower than the
app boot). A migration that isn't written with this in mind can take the whole app down
even when the migration itself "succeeds." This is the most important rule in this file —
correctness of the SQL is necessary but not sufficient.

## Additive First (Expand/Contract)

Split a breaking schema change into multiple migrations/releases so every step stays
backward-compatible with whatever code happens to be running against it at the time:

1. **Expand**: add the new column/table/index alongside the old one. Nullable, or with a
   default — never `NOT NULL` with no default on a table that already has rows, and never
   introduced in the same release that immediately starts requiring it.
2. **Backfill**: populate the new column for existing rows (a migration, a one-off script
   under `scripts/`, or a hook — pick based on data volume).
3. **Migrate reads/writes**: ship the code that uses the new shape. Both old and new code
   paths must tolerate the data existing in either the old or the new shape during rollout.
4. **Contract**: only once the old code path is no longer deployed anywhere, ship a later
   migration that drops the old column/table/constraint.

Never rename a column/table/`dbName` directly — from the database's perspective that's a
drop-and-recreate, and breaks any code still using the old name (old instances mid-rollout,
a slow-draining request). Add the new name, dual-write/backfill, migrate reads over, then
drop the old name in a later release.

## What This Means Concretely

- Adding an optional field: one migration, safe on its own.
- Adding a required field: needs a default, or a backfill step before it's enforced — see
  Expand/Contract above.
- Renaming a field/collection/`dbName`: two-or-more migrations across two-or-more releases,
  never one.
- Removing a field/collection: only after confirming (grep the actual codebase, not memory)
  that no deployed code path — including the previous release, during a rolling deploy —
  reads or writes it.
- Changing a column's type: only widening changes (e.g. `varchar(50)` → `varchar(200)`) are
  usually safe in one step; a narrowing or otherwise incompatible type change needs
  Expand/Contract.

## Verify Before Merging

Beyond the `migrate:status`/apply-and-rollback check (see `quality/TESTING.md`), CI applies
every migration from scratch against an empty database on every PR (see `.github/workflows/
c_test.yml`) — that catches broken SQL, but NOT a migration that's individually valid yet
incompatible with data or code that already exists in a real environment. That gap is
exactly what Expand/Contract exists to close; CI cannot verify authoring discipline for you.

## Migrations Run as Their Own Deploy Step

`c_build_and_deploy.yml` applies pending migrations against the target environment as an
explicit step, before the Docker image is built or deployed. If a migration fails, the job
stops there — the currently-running app is never touched, and the new code never goes live
against a schema it wasn't written for. Do not move this step to run inside the container's
own startup (e.g. the Docker `CMD`) — a migration failing during container boot means the
platform may still swap traffic to (or restart into a crash loop on) the new, broken
revision, which is the exact failure mode this step exists to prevent.

## Rollback: Roll Forward, Don't Run `down`

Migration files have a `down()`, but running it against a real environment after `up()` has
already run against live data is often itself destructive (it was written to reverse an
empty/test database, not to preserve data that arrived in the meantime). Treat `down()` as a
local development convenience only. If a migration turns out to be wrong after it's been
applied anywhere shared, fix it with a **new** migration, never by rolling the old one back
or hand-editing it (see "Migrations Are Generated, Not Hand-Authored" above).

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
