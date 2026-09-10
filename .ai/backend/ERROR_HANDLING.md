# Error Handling

Rules for error handling in this project.

---

# Never Swallow Errors

No empty `catch` blocks in hooks, access functions, custom endpoints, or utilities. Every
caught error is either handled meaningfully or logged and re-thrown.

---

# Hooks

- `beforeValidate`/`beforeChange` hooks SHOULD throw on genuine invalid state (e.g. a slug
  collision that could not be resolved) so the save fails clearly instead of persisting bad
  data.
- `afterChange`/`afterDelete` side-effect hooks (cache revalidation, external forwarding)
  SHOULD catch and log their own failures rather than throwing after the underlying document
  write already succeeded — the document change should not appear to fail because a
  non-critical side effect failed. Log via `req.payload.logger` with enough context (collection,
  document id, what failed) to act on it.

---

# Access Functions

Return `false` for a normal "not allowed" outcome. Reserve throwing for genuine unexpected
failures (e.g. a lookup required to make the decision itself fails).

---

# Custom Endpoints (`app/api/`)

- Validate input/method before acting.
- Return explicit, typed error responses with correct status codes.
- Never leak internal error detail (stack traces, DB errors, secrets) in the response body —
  log server-side, return a generic message.

---

# Logging

Use `req.payload.logger` (backed by the project's configured structured logger) instead of
`console.log`/`console.error`, so errors are captured consistently and can be correlated with
traces if observability tooling is added later. Respect the configured redaction list — never
log a secret, token, password, or full request body.

---

# Migrations

A failed migration should fail loudly and stop the deploy/apply process — never wrap a
migration's schema operations in a try/catch that silently continues on failure.
