# Folder Structure Guide

This document defines the **target folder structure** for this project. There is no legacy
code to preserve — every collection, global, and block built from now on MUST follow this
structure exactly, from the very first file. Do not deviate "just this once" and do not
carry over an inconsistent shape from an old prototype.

---

# Top-Level Layout (`src/`)

```
access/                  project-wide access helpers (e.g. isSuperAdmin.ts)
app/
  (payload)/             Payload admin panel route group
  api/                   custom public read/cache endpoints (see backend/REST_API.md)
blocks/
  content/<blockName>/   one folder per content block (camelCase folder name)
  layouts/<name>.ts      structural/layout blocks, flat files + index.ts aggregator
collections/
  <Name>/<Name>.ts       one collection config per PascalCase folder
    access/              collection-specific access rules
    hooks/                collection-specific hooks
    utils/                collection-specific helpers
  shared/
    access/              access rules reused by multiple collections
    fields/               field groups reused by multiple collections
    hooks/                hooks reused by multiple collections
components/              custom Payload admin UI components (PascalCase .tsx)
constants/               project-wide constants (camelCase files)
globals/
  <Name>/<Name>.ts       every global lives in its own folder — see below
  fields/                 field groups shared by globals
  hooks/                  hooks shared by globals
migrations/              generated migrations (never hand-authored from scratch)
  helpers/                shared migration helper functions
plugins/
  <pluginName>/          glue code around a third-party Payload plugin
scripts/                 one-off operational scripts (run manually, not part of the app)
seeds/                   seed data builders used by seed.ts / seed-backfill.ts
utilities/               cross-cutting helpers (camelCase files)
payload.config.ts
payload-types.ts         generated — never hand-edit, regenerate with `pnpm generate:types`
seed.ts
```

---

# Collections

Every collection is a **PascalCase folder** whose main file matches the folder name, with a
lowercase, kebab-case, plural `slug`:

```
collections/BlogPosts/BlogPosts.ts        slug: 'blog-posts'
collections/BlogPosts/hooks/formatSlug.ts
collections/BlogPosts/hooks/ensureUniqueSlug.ts
collections/Tenants/Tenants.ts            slug: 'tenants'
collections/Tenants/access/
```

Add a `hooks/`/`access/`/`utils/` subfolder only once the collection actually needs content
there — do not scaffold empty folders. A collection with only default access/no custom hooks
MAY stay a single flat file (e.g. `collections/Media.ts`) — but as soon as it needs a second
file, it MUST move into its own folder rather than growing flat sibling files at the
`collections/` root.

Cross-collection reuse MUST live in `collections/shared/{access,hooks,fields}/` from the
start — do not let a second collection duplicate a first collection's hook/access logic
"temporarily."

---

# Globals

Every global gets its own folder, always, for consistency with collections and so that
adding a helper file later never requires restructuring:

```
globals/Header/Header.ts
globals/CorporateIdentity/CorporateIdentity.ts
globals/BlogSettings/BlogSettings.ts
globals/fields/colorPicker.ts             shared across globals
globals/hooks/updateGlobalCache.ts        shared across globals
```

Do not mix flat `globals/<Name>.ts` files with nested `globals/<Name>/<Name>.ts` folders in
the same project — pick the nested form for every global, with no exceptions.

---

# Blocks

```
blocks/content/blogListing/               one folder per content block, camelCase name
blocks/content/vehicleSlider/
blocks/content/index.ts                   aggregates/exports all content blocks
blocks/layouts/oneColumn.ts                flat files for structural layout blocks
blocks/layouts/twoColumnEqual.ts
blocks/layouts/sectionSettings.ts         shared field set used by layout blocks
blocks/layouts/index.ts                   aggregates/exports layoutBlocks
```

---

# Components (Admin UI)

```
components/ColorPickerField.tsx           PascalCase, one custom admin field/component
components/IconSelectField.tsx
components/buttonThemeFieldShared.ts      camelCase helper colocated with the components
                                           that use it (admin-field glue, not domain logic)
```

Unlike a typical frontend app, a small camelCase helper file directly supporting one or two
admin field components MAY sit next to those components here — this is Payload admin glue,
not reusable business logic. Genuine cross-cutting business logic still belongs in
`utilities/`.

---

# Utilities, Constants, Seeds, Scripts

```
utilities/getUserTenantIDs.ts             camelCase, one clear purpose per file
utilities/payloadDb.ts
constants/defaultTenant.ts
seeds/vehicleBootstrap.ts
scripts/upsertCareerPage.ts               manual/operational, not imported by the app config
```

---

# Migrations

```
migrations/20260101_120000_init.ts
migrations/helpers/idempotentSchema.ts
migrations/index.ts                       aggregates and exports `migrations` in order
```

Generated via `pnpm migrate:create`, named with a timestamp prefix by Payload's own tooling.
Never rename, delete, or reorder a migration file once it may have been applied anywhere.
See `backend/DATABASE.md`.

---

# Path Aliases

```
@/*             → ./src/*
@payload-config → ./src/payload.config.ts
```

Use `@/...` imports instead of long relative `../../../` chains, from the first file written.

---

# File Organization Principles

- Collection/global folders: PascalCase, matching the exported config name — no exceptions.
- Everything else (hooks, utilities, blocks, constants, migrations): camelCase file names.
- Slugs (collection/global/block identifiers used in the database and REST API): kebab-case,
  plural for collections.
- Create a subfolder (`hooks/`, `access/`, `utils/`) only once a collection/global actually
  has content for it — do not scaffold empty folders, but also do not let a second file pile
  up flat once one is warranted.
