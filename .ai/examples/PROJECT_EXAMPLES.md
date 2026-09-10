# Project Examples

Concrete, end-to-end examples specific to this project's domains. Extend this file with real
entries as real collections/globals/blocks get built — replace the illustrative examples
below with your actual ones once they exist, and keep it in sync with reality.

---

# Example: Building a New Editorial Collection (e.g. `BlogPosts`)

1. Create `collections/BlogPosts/BlogPosts.ts`, following the tab structure that groups core
   content, layout/blocks, and related-item fields (`cms/FIELDS.md`).
2. Build (or reuse, if it already exists) `collections/shared/access` for tenant-scoped
   access, and `collections/shared/fields/publishSettingsField.ts` for the publish-state
   pattern.
3. Add named hooks under `collections/BlogPosts/hooks/` (slug formatting, uniqueness,
   tenant/publish defaults) — composed, not merged into one function.
4. Register the collection in `payload.config.ts`, in the multi-tenant plugin's collections
   map, and in the SEO plugin's collections list if applicable.
5. Run `pnpm migrate:create` and `pnpm generate:types`.
6. If it needs a custom admin field (e.g. a themed color picker), add it under `components/`
   and reference it via `admin.components.Field` (`cms/ADMIN_COMPONENTS.md`).
7. Note in the PR/review whether the Website's `types/cms/blog/` and `lib/cms/blog/` need a
   corresponding update (a separate repo change) — this project cannot make that change
   itself.

---

# Example: Multi-Tenant Content Flow

`Tenants` defines each dealer/brand. A tenant-scoped collection stores a `tenant`
relationship (added by the multi-tenant plugin), and:

- `access/updateAccess` restricts non-super-admins to their own tenant(s)
  (`backend/MULTI_TENANCY.md`)
- `filterOptions` on relationship fields keeps editors from linking across tenants
- the Website resolves the current tenant from the request host and passes it explicitly into
  every `lib/cms/` call that needs it (documented on the Website side)

---

# Example: Cache Revalidation Chain

1. An editor publishes a change to a document.
2. A `revalidate<Name>AfterChange` hook fires, notifying the Website's revalidation webhook
   with a tag like `<collection>:<slug>`.
3. The Website's revalidation Route Handler (separate repo) verifies the shared secret and
   calls `revalidateTag`.
4. The next request for that page re-fetches fresh data from this project's REST API.

Every cacheable collection should follow this exact chain (`revalidate<Name>AfterChange` /
`AfterDelete` hooks) — establish it on the first one and reuse it for every subsequent one.

---

# Example: Form Submission Forwarding

If forms are built with the `form-builder` plugin and submissions need to reach a downstream
system, add a `beforeChange` hook on `formSubmissionOverrides.hooks` under
`plugins/formBuilder/`, validating/mapping the submission and failing safely (logged, not
thrown) if the downstream system is unavailable. Reuse this exact integration point for every
downstream target rather than wiring a second, parallel forwarding mechanism.
