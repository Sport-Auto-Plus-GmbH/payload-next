# Multi-Tenancy

Rules for the multi-tenant architecture in this project
(`@payloadcms/plugin-multi-tenant`, a `Tenants` collection). This is a deliberate product
requirement (multiple dealer/brand sites on one Payload instance) — build it correctly from
the first tenant-scoped collection rather than retrofitting it later.

---

# The Model

Design and build a **hybrid multi-tenant** system:

- **Global system roles**: `super-admin` (full cross-tenant access) and `user` (base role,
  needs tenant-specific roles to do anything).
- **Tenant-specific roles**: `tenant-admin` (full access within their tenant),
  `tenant-viewer` (read-only within their tenant).
- Tenants are resolved by domain and/or slug (`Tenant.domain`, `Tenant.slug`), and may allow
  public read access via an explicit `Tenant.allowPublicRead` flag.

---

# Registering a Tenant-Scoped Collection

Add the collection's slug to the `multiTenantPlugin` config in `payload.config.ts` from the
moment the collection is created:

```ts
multiTenantPlugin<Config>({
  collections: {
    pages: {},
    'blog-posts': {},
    // register every tenant-scoped collection here
  },
  ...
})
```

A tenant-scoped collection without this registration will not get the plugin's automatic
tenant field/filtering behavior — never try to replicate tenant scoping manually instead of
registering the collection.

---

# Access Control Must Enforce Tenant Boundaries

Registering with the plugin adds the tenant relationship; it does not by itself guarantee
every access function checks it. Every `read`/`update`/`delete` access function for
tenant-scoped data MUST restrict non-super-admins to their own tenant(s) via
`getUserTenantIDs(req.user)` (see `cms/ACCESS_CONTROL.md`) from the first version of that
access function — never ship a "temporary" version that skips tenant scoping.

---

# `isSuperAdmin` Is the Only Bypass

`src/access/isSuperAdmin.ts` MUST be the single, project-wide way to grant cross-tenant
access. Do not introduce a second "is this user special" check elsewhere.

---

# Relationship Fields Must Stay Tenant-Scoped

Any `relationship` field pointing at another tenant-scoped collection MUST use
`filterOptions` to restrict the pickable documents to the current document's tenant, so an
editor in one tenant cannot link to another tenant's content.

---

# Public Read Per Tenant

`Tenant.allowPublicRead` lets a specific tenant's content be publicly readable (needed for
the Website's unauthenticated REST reads). This is a per-tenant, explicit opt-in — default it
to `false` for new tenants and only enable it deliberately; never let it influence
`create`/`update`/`delete` access.

---

# Adding a New Tenant

Tenant creation/configuration (domain, slug, `allowPublicRead`) goes through the `Tenants`
collection like any other content — do not hardcode tenant identifiers in application code
beyond a small, explicit set of constants used for local-development/preview defaults.

---

# Testing Tenant Isolation

When changing access control or adding a tenant-scoped collection, verify (manually or via a
test): a `tenant-admin`/`tenant-viewer` of Tenant A cannot read, update, or delete Tenant B's
documents, and a plain `user` with no tenant role can do neither for any tenant's data. Write
this test the first time tenant scoping is introduced, and extend it for every new
tenant-scoped collection.
