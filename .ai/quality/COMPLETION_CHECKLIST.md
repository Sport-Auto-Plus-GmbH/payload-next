# Completion Checklist

A task is complete only when every applicable item below is true.

---

# Always

- [ ] The implementation works and solves the actual requested task, nothing more.
- [ ] The code compiles and is type-safe.
- [ ] ESLint and Prettier pass (`pnpm lint`, `pnpm format:check`) with no new warnings beyond
      the project's existing baseline.
- [ ] No unrelated collections/globals/blocks/files were touched.
- [ ] No secret, token, or credential was logged or hardcoded.
- [ ] The development server was not started, restarted, or stopped by the AI.

---

# If the Change Touches the Content Model (Collections/Globals/Blocks/Fields)

- [ ] Naming and folder placement follow `core/FOLDER_STRUCTURE.md` /
      `core/NAMING_CONVENTIONS.md`.
- [ ] Shared fields/access/hooks were reused where an equivalent already exists.
- [ ] `pnpm generate:types` was run (or is flagged as needed) so `payload-types.ts` is
      current.
- [ ] A migration was generated (`pnpm migrate:create`) for any schema-affecting change.
- [ ] Access control enforces the correct tenant scoping and role checks
      (`cms/ACCESS_CONTROL.md`, `backend/MULTI_TENANCY.md`).
- [ ] Any new tenant-scoped collection is registered in the `multiTenantPlugin` config.
- [ ] Any collection/global slug or field the Website consumes was not renamed/removed
      without explicit confirmation this is intended (`backend/REST_API.md`).

---

# If the Change Touches Hooks

- [ ] Each hook has one responsibility and is composed with others, not merged into one
      function.
- [ ] Side-effect hooks (cache revalidation, external forwarding) fail without corrupting the
      already-successful document write.
- [ ] No access/authorization decision was implemented inside a hook.

---

# If the Change Touches a Custom Endpoint or Plugin Config

- [ ] Input is validated; errors return typed responses without leaking internal detail.
- [ ] CORS/CSRF origins were not widened beyond explicit known origins.
- [ ] The endpoint/plugin change was checked against `backend/SECURITY.md`.

---

# Tests

- [ ] New non-trivial hooks, access functions, and utilities have a test.
- [ ] Existing tests still pass (`pnpm test:int`).
