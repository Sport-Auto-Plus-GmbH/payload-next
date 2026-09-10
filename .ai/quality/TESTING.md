# Testing

Rules for automated testing in this project. Integration tests: Vitest (`pnpm test:int`).
End-to-end tests: Playwright (`pnpm test:e2e`). Combined: `pnpm test`.

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

# Integration Tests (Vitest)

Integration tests exercise Payload's local API (`getPayload`) against a real (test) Postgres
database — not a mocked Payload instance. Follow the existing `vitest.config.mts` /
`test:int` setup rather than introducing a second test runner or a mocked-Payload testing
approach.

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

# Running Tests

The AI MAY run `pnpm test:int` (and `pnpm lint`, `pnpm format:check`) to verify a change. The
AI MUST NOT run `pnpm migrate` against a shared database as part of "testing," and MUST NOT
start the dev server to manually verify — use the test suite and `migrate:status` instead.
