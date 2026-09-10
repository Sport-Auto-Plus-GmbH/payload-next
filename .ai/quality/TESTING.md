# Testing

Rules for automated testing in this project. Unit tests: Vitest (`pnpm test:unit`).
Integration tests: Vitest (`pnpm test:int`). End-to-end tests: Playwright (`pnpm test:e2e`).
Combined: `pnpm test`. Coverage: `pnpm test:coverage` (see "Coverage" below).

---

# What to Test

- **Hooks** — slug formatting/uniqueness, tenant/publish derivation: normal case, idempotent
  re-save case, at least one edge case (duplicate across tenants, missing optional field).
- **Access control functions** — for each of `create`/`read`/`update`/`delete`: a
  super-admin, a same-tenant admin/viewer, a different-tenant user, and an unauthenticated
  request, asserting the expected allow/deny/scoped result.
- **Utilities** — pure functions (`getUserTenantIDs`, `extractID`, formatting/mapping
  helpers) with direct input/output tests.
- **Custom endpoints** (`app/api/`) — success path, auth/secret failure path, malformed
  input.
- **Migrations** — new migrations should be exercised via `migrate:status`/a local
  apply-and-rollback check before being considered done, not merely generated.

---

# Unit Tests (Vitest)

Unit tests live under `tests/unit/`, mirroring `src/`'s structure (e.g.
`src/access/isSuperAdmin.ts` → `tests/unit/access/isSuperAdmin.test.ts`) — never colocated
with source files. Use these for anything that doesn't need a real database: pure
utilities, access-control functions tested in isolation (as plain functions, not through the
local API), collection hooks, and custom admin components (`components/`) rendered with
`@testing-library/react`. No network, no Postgres — that's what makes these fast enough to
run on every save.

---

# Integration Tests (Vitest)

Integration tests exercise Payload's local API (`getPayload`) against a real (test) Postgres
database — not a mocked Payload instance. Follow the existing `vitest.config.mts` /
`test:int` setup rather than introducing a second test runner or a mocked-Payload testing
approach.

They run against a dedicated database (`.env.test`, `DATABASE_URL` pointing at
`datendrehscheibe_test` — a separate database, not just a separate schema, since Payload/
Drizzle bakes the schema name into each generated migration's raw SQL, so same-database/
different-schema doesn't actually isolate anything). Never point `.env.test` at the same
database as `.env` — integration tests create, update, and delete real documents, and would
corrupt local seeded demo data otherwise. Apply migrations to it the same way as any other
environment (`DATABASE_URL=... DATABASE_SCHEMA=payload pnpm migrate`, using the values from
`.env.test`) whenever a new migration is added.

---

# End-to-End Tests (Playwright)

Reserve Playwright for flows that only make sense through the actual admin UI or the
rendered frontend (login, editing a document through the admin panel, live preview).
Business-logic edge cases belong in faster Vitest integration tests, not Playwright.

---

# Test Data

Build test data through `seeds/` builders/helpers rather than constructing ad-hoc documents
inline in every test file, so tenant/role fixtures stay consistent across the whole test
suite. Create the first shared fixture builder as soon as a second test needs the same
tenant/user/document setup.

---

# Coverage

This project enforces a minimum of **80% coverage** (lines, statements, functions, branches)
via `pnpm test:coverage` (`vitest.config.mts`'s `coverage.thresholds`) — enforced in CI, so a
PR that drops below it fails the build. This applies to new code going forward: components,
hooks, access-control functions, utilities, and custom endpoints all need tests written
alongside them, not bolted on afterward.

`coverage.exclude` in `vitest.config.mts` carves out what genuinely can't/shouldn't be unit
tested — generated files (`payload-types.ts`), one-off scripts (`scripts/`, `seeds/`),
migrations, and Payload/Next.js's own generated route-group scaffolding
(`src/app/(payload)/layout.tsx`, `admin/**/page.tsx`, `api/**/route.ts` — several are marked
"DO NOT MODIFY" at the top of the file). Do not add something to this exclude list just to
dodge the threshold — every exclusion needs the same justification as the existing ones:
generated or non-logic, not "hard to test."

When a coverage gap is a collection/global's inline access-control closure (e.g.
`access: { read: () => true }`), prefer closing it with a real integration test that
exercises the collection/global through the local API with `overrideAccess: false` (see
`tests/int/globals/corporate-identity.int.spec.ts` for the pattern) over inlining a named,
separately-unit-tested function purely to make coverage easier.

---

# Running Tests

The AI MAY run `pnpm test:unit`, `pnpm test:int`, `pnpm test:coverage`, `pnpm lint`, and
`pnpm format:check` to verify a change. The AI MUST NOT run `pnpm migrate` against the dev
database (`.env`) as part of "testing" — integration tests use `.env.test`'s separate
database instead, see "Integration Tests" above. The AI MUST NOT start the dev server to
manually verify — use the test suite and `migrate:status` instead.
