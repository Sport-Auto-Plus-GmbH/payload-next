# Collections

Rules for defining Payload collections in this project. This project starts fresh — apply
this shape to the very first collection, not just once a "real" pattern has emerged.

---

# Anatomy of a Collection

A collection config (`collections/<Name>/<Name>.ts`) declares, in this order of concern:

1. `slug` (kebab-case, plural) and `dbName` when a shorter Postgres identifier is needed
2. `labels` (German editorial labels)
3. `access` — imported from `collections/shared/access` or a collection-specific
   `access/` folder, never inlined
4. `admin` — `useAsTitle`, `defaultColumns`, pagination
5. `versions`/drafts if the collection needs editorial review before publish
6. `hooks` — imported named functions, never inline anonymous logic for anything non-trivial
7. `fields`

Example shape (illustrative — not a collection that already exists):

```ts
export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  labels: { singular: 'Blogartikel', plural: 'Blogartikel' },
  access: { create: createAccess, read: readAccess, update: updateAccess, delete: deleteAccess },
  admin: { useAsTitle: 'title', defaultColumns: [...], pagination: { defaultLimit: 25 } },
  versions: { drafts: true },
  hooks: {
    beforeValidate: [formatSlug, ensureUniqueSlug],
    beforeChange: [applyTenantAndPublishSettings],
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [ /* ... */ ],
}
```

---

# New Collection Checklist

1. Does this content genuinely have multiple instances? (If not, it's a global — see
   `cms/GLOBALS.md`.)
2. Pick a kebab-case, plural `slug`.
3. Build `collections/shared/access` and `collections/shared/fields/` as soon as a second
   collection needs the same rules/fields — do not wait until three collections have
   duplicated the same logic.
4. Register the collection in `payload.config.ts`'s `collections` array.
5. If tenant-scoped, register it in the multi-tenant plugin's collections map — see
   `backend/MULTI_TENANCY.md`.
6. If it should be indexed by the SEO plugin, add its slug to `seoPlugin({ collections: [...] })`.
7. Run `pnpm migrate:create` for the resulting schema change and `pnpm generate:types`.

---

# Slugs Are Immutable Once Shipped

Changing a `slug` changes the REST endpoint path and any plugin registration keyed by it.
Once a collection has a migration applied anywhere (including a shared dev/staging
database), treat its `slug` as a breaking change to the Website's integration — do not rename
it without an explicit, coordinated migration plan.

---

# Drafts and Versions

Use `versions: { drafts: true }` for editorial content that needs a draft/preview state
before publish. Build one shared `publishSettingsField()` field group in
`collections/shared/fields/` for the publish-date/status pattern the first time it's needed,
and reuse it for every collection that needs the same pattern — never redefine equivalent
publish-state fields per collection.

---

# Admin UX

- Set `useAsTitle` to the field editors actually recognize the document by (usually `title`).
- Set `defaultColumns` to the handful of fields editors scan most (title, key relationship,
  status/date, slug) — not every field.
- Put fields editors set once and rarely revisit (SEO meta, structured data type) in
  `admin: { position: 'sidebar' }`.

---

# Relationships

- Use `filterOptions` to scope a relationship field to the current tenant whenever the
  related collection is tenant-scoped — never let an editor pick a document from another
  tenant.
- Prefer `hasMany: true` relationship fields over a repeatable array-of-relationship pattern
  when order does not matter; use a `blocks`/`array` field when order or additional per-item
  data does matter.

---

# Do Not Duplicate Shared Collection Concerns

As soon as a second collection needs the same access rules, the same publish-settings
fields, or the same tenant-filtering hook as an existing one, extract it into
`collections/shared/` and import it from both — do not copy-paste the function body into the
new collection's own `hooks/`/`access/` folder.
