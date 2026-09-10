# Security

Security rules for this project. Security always has priority over convenience.

---

# Access Control Is Non-Negotiable

Never weaken an access function, add an `overrideAccess: true` outside of trusted
scripts/seeds, or return an unconditional `true` for `create`/`update`/`delete` on
tenant-scoped or user-authored data. See `cms/ACCESS_CONTROL.md`,
`backend/MULTI_TENANCY.md`.

---

# Secrets

- `PAYLOAD_SECRET`, database credentials, `PAYLOAD_LIVE_PREVIEW_SECRET`, Azure storage
  credentials, and any plugin API keys MUST stay in environment variables, never hardcoded
  or committed.
- Never log a secret. Configure the project's logger with a redaction list from the start
  (`password`, `token`, `accessToken`, `refreshToken`, `authorization`, `cookie`, `email` at
  minimum) — extend that list whenever a new sensitive field is introduced, rather than
  logging around it.

---

# CORS / CSRF

Keep `cors`/`csrf` in `payload.config.ts` scoped to known, explicit origins
(`PAYLOAD_PUBLIC_SERVER_URL`, the resolved frontend preview origin). Never widen it to `'*'`.
See `backend/REST_API.md`.

---

# Live Preview Secret

The live-preview URL resolver appends `previewSecret` when `PAYLOAD_LIVE_PREVIEW_SECRET` is
set. Do not remove this check or make preview mode reachable without it in a shared
environment.

---

# Webhooks and External Integrations

The form-builder integration forwards submissions to the Datendrehscheibe system
(`plugins/formBuilder/formIntegration.ts`). Any such outbound integration MUST validate/sanitize
the data it forwards and MUST fail safely (log, don't crash the triggering request) if the
downstream system is unavailable.

---

# File Uploads

Media uploads go through Azure Blob Storage (`@payloadcms/storage-azure`). Do not bypass the
configured storage adapter to write files to local disk in a shared environment. Validate
file types/sizes at the field level rather than trusting client-supplied metadata.

---

# Import/Export

`@payloadcms/plugin-import-export` is enabled for `users` and `pages`. Adding a new
collection to it exposes that collection's data for bulk export — confirm the collection
does not contain data that shouldn't be bulk-exportable (e.g. sensitive user fields) before
adding it.

---

# Dependencies

Do not add a new npm dependency, especially one with database, filesystem, or network
access, without checking it is actively maintained and does not duplicate an existing
plugin's functionality.

---

# Error Detail Exposure

Never return a raw internal error (stack trace, SQL error, secret-bearing config) from a
custom endpoint under `app/api/`. Log the detail server-side via the configured logger;
return a generic error response to the caller.
