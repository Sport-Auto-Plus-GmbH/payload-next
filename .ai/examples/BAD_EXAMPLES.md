# Bad Examples

Anti-patterns to avoid in this project, and why. None of this exists in the codebase — these
are the mistakes to catch before they get written, since there is no legacy debt yet to blame
them on.

---

# Inline, Unnamed Hook Logic

```ts
// BAD
hooks: {
  beforeChange: [
    async ({ data }) => {
      data.slug = data.title.toLowerCase().replace(/\s+/g, '-')
      if (!data.tenant) data.tenant = 1
      data.publishedAt = data.publishedAt || new Date().toISOString()
      return data
    },
  ],
},
```

Why this is bad: three unrelated responsibilities (slug formatting, tenant defaulting,
publish-date defaulting) crammed into one anonymous function. Split into named hooks
(`formatSlug`, `applyTenantAndPublishSettings`) and reuse a shared hook for tenant/publish
defaulting instead of writing it inline again for each collection.

---

# Access Function That Ignores Tenancy

```ts
// BAD
export const readAccess = () => true
export const updateAccess = ({ req }) => Boolean(req.user)
```

Why this is bad: any authenticated user — regardless of tenant — can read and update every
tenant's data. Must scope via `getUserTenantIDs(req.user)` (or a `Where` query) unless the
collection is genuinely global/non-tenant data, and even then `update` should not be a bare
`Boolean(req.user)`. This must be correct from the very first version of the function, not
"fixed later."

---

# Hand-Editing a Migration

```ts
// BAD — editing an already-applied migration file directly
export async function up({ db }) {
  // "just adding one more column here, no need for a new migration"
  await db.schema.alterTable(...)
}
```

Why this is bad: once a migration may have been applied anywhere, it is immutable history.
Add a new migration (`pnpm migrate:create`) instead — this applies even to a project's first
few migrations.

---

# Renaming a Shipped Slug Without Coordination

```ts
// BAD
export const BlogPosts: CollectionConfig = {
  slug: 'articles', // was 'blog-posts', changed after the Website already integrated it
  ...
}
```

Why this is bad: this silently breaks the Website's `lib/cms/blog/*` calls and any plugin
registration still referencing `'blog-posts'`. Treat this as a breaking API change requiring
explicit coordination (`backend/REST_API.md`), not a routine rename — even early on, once the
Website has started consuming it.

---

# Bypassing Access Control From Application Code

```ts
// BAD — inside a hook reachable from a normal editor save
const relatedDocs = await req.payload.find({
  collection: 'pages',
  overrideAccess: true, // silently ignores tenant/role checks
})
```

Why this is bad: `overrideAccess: true` is only acceptable in trusted, operator-run
scripts/seeds — using it inside application logic reachable by regular editors defeats
`cms/ACCESS_CONTROL.md` and can leak cross-tenant data.

---

# Widening CORS to Make a New Frontend "Just Work"

```ts
// BAD
cors: '*',
csrf: '*',
```

Why this is bad: this project scopes `cors`/`csrf` to known, explicit origins. Add the new
origin explicitly instead — never reach for a wildcard as a shortcut, even during early setup.

---

# Mixing Flat and Nested Global Files

```
// BAD
globals/Header/Header.ts       nested
globals/Footer.ts              flat
```

Why this is bad: `core/FOLDER_STRUCTURE.md` requires every global to live in its own folder,
with no exceptions. Mixing the two shapes from the start creates unnecessary inconsistency
that a fresh project has no excuse for.
