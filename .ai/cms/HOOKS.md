# Hooks (Payload Lifecycle Hooks)

Rules for Payload collection/global lifecycle hooks in this project. Not to be confused with
React hooks — these run server-side around the document lifecycle.

---

# One Hook, One Responsibility

Each hook function does exactly one thing and is composed with others in the collection's
hook arrays:

```ts
hooks: {
  beforeValidate: [formatSlug, ensureUniqueSlug],
  beforeChange: [applyTenantAndPublishSettings],
  afterChange: [revalidateAfterChange],
  afterDelete: [revalidateAfterDelete],
},
```

Do not write one hook that formats a slug, checks uniqueness, and applies tenant defaults —
split it into composable single-purpose hooks from the start.

---

# Naming and Location

Hook file and function names are camelCase verbs describing the effect: `formatSlug`,
`ensureUniqueSlug`, `revalidateAfterChange`.

- Collection-specific hook → `collections/<Name>/hooks/<hookName>.ts`
- Reused by multiple collections → `collections/shared/hooks/<hookName>.ts`
- Global-specific hook → `globals/hooks/<hookName>.ts` or `globals/<Name>/`

---

# Choosing the Right Hook Stage

- `beforeValidate` — derive/normalize a field before validation (slug formatting, defaulting
  a relationship).
- `beforeChange` — apply defaults/derived state right before the write (tenant assignment,
  publish-status derivation) — this is the last chance to alter `data` before it is saved.
- `afterChange` / `afterDelete` — side effects that must happen only once the document is
  durably saved/removed (cache revalidation pings to the Website, external system
  notifications). Never mutate the document itself here.

---

# Hooks Do Not Make Access Decisions

A hook MUST NOT implement authorization logic ("is this user allowed to do this"). That
belongs entirely in `access/` (see `cms/ACCESS_CONTROL.md`). A hook may read `req.user` to
derive data (e.g. defaulting a tenant from the current user), but not to allow/deny the
operation.

---

# Idempotency and Safety

- Uniqueness-ensuring hooks must be safe to run repeatedly (re-saving an already-unique
  document should not change it).
- `afterChange`/`afterDelete` side effects that call external systems (cache invalidation,
  form-submission forwarding) MUST handle failure without corrupting the Payload write that
  already succeeded — log and continue rather than throwing after the document is already
  saved, unless the side effect is itself a hard requirement for correctness.

---

# Cache Revalidation Hooks

Any collection the Website caches needs a matching `revalidate<Name>AfterChange` /
`revalidate<Name>AfterDelete` hook pair that notifies the Website's revalidation webhook (or
this project's own cache endpoints under `app/api/`). Establish this pattern on the first
cacheable collection and reuse the exact same shape for every subsequent one — do not invent
a second invalidation mechanism later.

---

# Testing Hooks

Non-trivial hooks (slug uniqueness, tenant/publish derivation) SHOULD have a unit test
covering: the normal case, the "already correct" case (idempotency), and at least one edge
case (duplicate slug across tenants, missing optional relationship).
