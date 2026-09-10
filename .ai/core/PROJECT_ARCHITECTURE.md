# Project Architecture

This document defines the architectural principles of the Payload project.

Every AI-generated implementation MUST respect this architecture.

---

# Architectural Philosophy

This project is a **headless Payload CMS** running as a Next.js application. It is the
single source of truth for content and structured data. It is consumed by a separate,
decoupled Next.js **Website** repository over Payload's REST API — this project has no
compile-time dependency on the Website, and the Website has no compile-time dependency on
this project.

---

# High-Level Architecture

```
                     Payload Admin UI
                            │
                            ▼
   Collections / Globals / Blocks (content model + fields)
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
        Access Control   Hooks       Plugins
              │             │             │
              └─────────────┴─────────────┘
                            │
                            ▼
                   Payload ORM (db-postgres / Drizzle)
                            │
                            ▼
                        PostgreSQL
                            │
                            ▼
        REST API (/api/<collection>, /api/globals/<slug>)
                            │
                            ▼
        Decoupled Next.js Website (separate repository)
```

Data always flows downward from the content model to Postgres, and outward through the REST
API. The Website is a consumer, never a dependency this project reaches into.

---

# Layer Responsibilities

## Collections (`collections/<Name>/<Name>.ts`)

Define the content model: fields, labels, admin UI behavior, versioning/drafts, and wire up
that collection's access rules and hooks. Collections should stay declarative — logic lives
in `hooks/`, `access/`, and `utilities/`, imported into the config.

## Globals (`globals/<Name>/<Name>.ts`)

Same role as collections, for singleton, site-wide data (header, footer, corporate identity,
SEO defaults). Never model something that has multiple instances as a global.

## Fields (`collections/shared/fields/`, `globals/fields/`)

Reusable field groups (e.g. a color picker, publish-settings fields) shared across multiple
collections/globals. Extract a field group here as soon as it is duplicated in a second
place.

## Access Control (`collections/<Name>/access/`, `collections/shared/access/`,
`src/access/`)

Own **who can create/read/update/delete**. Access functions MUST be the only place that
makes that decision — never re-implement an authorization check inline inside a hook or
component. Project-wide helpers like `isSuperAdmin` live in `src/access/`.

## Hooks (`collections/<Name>/hooks/`, `collections/shared/hooks/`, `globals/hooks/`)

Own **side effects and derived data** around the document lifecycle: slug generation and
uniqueness, cache invalidation/revalidation pings to the Website, cross-field consistency
enforcement, forwarding form submissions to external systems. Hooks MUST NOT make access
decisions — that belongs to `access/`.

## Blocks (`blocks/content/<name>/`, `blocks/layouts/`)

Own reusable, editor-composable content units. `blocks/content/` holds concrete content
blocks (hero, FAQ, testimonial, vehicle slider, ...); `blocks/layouts/` holds structural
column/section layout wrappers used to arrange content blocks.

## Plugins (`plugins/`, `payload.config.ts`)

Own integration with Payload's plugin ecosystem (multi-tenant, nested-docs, redirects, SEO,
form-builder, import-export, storage) and this project's glue code around them (e.g.
`plugins/formBuilder/formIntegration.ts`).

## Payload ORM / Postgres (`db-postgres` adapter, `migrations/`)

Own persistence. Business rules do not belong at the database level beyond what is required
for integrity (constraints, indexes) — see `backend/DATABASE.md`.

## REST API

Payload's built-in REST endpoints are the Website's only integration point. Custom
endpoints (e.g. cache-version/read endpoints under `app/api/`) exist only to serve a specific
public, read-only need beyond what a standard collection/global REST response provides.

---

# Dependency Rules

Allowed:

```
Collection/Global config → Hooks / Access / Fields (this project's own modules)
Hooks → Utilities
Website (separate repo) → Payload REST API only
```

Forbidden:

```
This project → Website's components, hooks, or stores (no cross-repo imports)
Hook → bypassing access control to read/write data an unauthorized actor shouldn't touch
Collection config → raw SQL bypassing Payload's query/access layer
```

---

# Multi-Tenancy

Multiple dealer/brand tenants share this one Payload instance (`@payloadcms/plugin-multi-tenant`).
Every tenant-scoped collection MUST be registered with the plugin and MUST enforce tenant
scoping in its access rules. See `backend/MULTI_TENANCY.md`.

---

# Single Responsibility

Every collection, global, hook, and access function should have one clear responsibility.
A hook that both generates a slug and pings a cache-invalidation endpoint should be two
hooks composed in the collection's `hooks.beforeValidate`/`hooks.afterChange` arrays, not one
function doing both.

---

# Circular Dependencies

Circular dependencies are strictly forbidden. If two collections/utilities depend on each
other, the architecture is incorrect — refactor responsibilities.

---

# AI Decision Process

Before creating new code ask:

1. Which layer owns this responsibility — field, hook, access, or utility?
2. Does this responsibility already exist in `collections/shared/` or `utilities/`?
3. Does this touch tenant-scoped data, and is scoping enforced?
4. Does this change the database schema, and does a migration exist?
5. Does this change the public REST contract the Website depends on?

If any answer is uncertain: stop, analyze further.

---

# Final Architecture Rule

The architecture exists to keep content modeling predictable and the Website/Payload
boundary clean. Every change should strengthen that boundary, never blur it.
