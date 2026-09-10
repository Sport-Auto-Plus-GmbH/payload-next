# Plugins

Rules for Payload plugins in this project.

---

# Chosen Plugin Stack

This project is built around the following official Payload plugins:

- `@payloadcms/plugin-multi-tenant` — tenant scoping (see `backend/MULTI_TENANCY.md`)
- `@payloadcms/plugin-nested-docs` — hierarchical page trees
- `@payloadcms/plugin-redirects` — managed redirects
- `@payloadcms/plugin-seo` — per-document SEO metadata
- `@payloadcms/plugin-form-builder` — editor-built forms, forwarded to downstream systems via
  project-specific glue code
- `@payloadcms/plugin-import-export` — admin import/export for selected collections
- `@payloadcms/storage-azure` — Azure Blob Storage for uploads

Set these up as part of the initial `payload.config.ts`, not bolted on ad hoc per feature.

---

# Prefer a Plugin Over Custom Code

Before writing a custom feature, check whether an already-configured plugin (or the official
Payload plugin catalog) already solves it. Do not hand-roll redirect handling, SEO fields, or
nested document trees when the installed plugins already cover the need.

---

# Configuring a Plugin

Plugin configuration lives in `payload.config.ts`'s `plugins` array. Project-specific glue
code around a plugin (custom field overrides, hook integrations) belongs in
`plugins/<pluginName>/` from the start — not inlined as a large object literal in
`payload.config.ts`.

---

# Adding a Collection to an Existing Plugin

When a new collection needs multi-tenant scoping, SEO fields, or redirect support, register
it in that plugin's config in `payload.config.ts` (e.g. add its slug to
`multiTenantPlugin({ collections: { ... } })` or `seoPlugin({ collections: [...] })`) rather
than reimplementing the same behavior manually on the collection.

---

# Environment-Gated Plugins

Keep every plugin present in every environment's config with the same shape, and gate its
*behavior* via an `enabled` flag (e.g. `azureStorage({ enabled: hasAzureStorageConfig })`) —
do not conditionally include/exclude a plugin from the `plugins` array itself, which changes
the generated import map shape between environments.

---

# New Plugin Evaluation

Before adding a new third-party plugin:

- Confirm it's actively maintained and compatible with the project's Payload 3.x version.
- Confirm it doesn't duplicate an already-configured plugin's functionality.
- Check its access/hook footprint against `backend/SECURITY.md` and
  `backend/MULTI_TENANCY.md` before enabling it for tenant-scoped collections.
