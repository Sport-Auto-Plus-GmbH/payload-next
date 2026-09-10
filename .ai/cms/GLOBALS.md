# Globals

Rules for Payload globals (singleton, site-wide configuration) in this project.

---

# When Something Is a Global vs a Collection

A global MUST represent data with exactly one instance per environment/tenant context (site
header, footer, corporate identity/theme, SEO defaults). If the data could ever have more
than one instance, it is a collection, not a global — see `cms/COLLECTIONS.md`.

---

# Anatomy of a Global

Every global, without exception, gets its own folder — even a simple one:

```ts
// globals/Header/Header.ts
export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  access: { read: () => true, update: updateAccess },
  fields: [ /* ... */ ],
}
```

```
globals/Header/Header.ts
globals/CorporateIdentity/CorporateIdentity.ts
```

Do not create a flat `globals/<Name>.ts` file "because it's simple right now" — nesting from
day one means adding a sibling helper file later never requires a restructuring commit.

---

# Register in Config

Add every new global to the `globals` array in `payload.config.ts`. A global that exists but
is not registered there will not be reachable through the admin UI or the REST API.

---

# Shared Field Groups

Build `globals/fields/` (e.g. a color picker field group) the first time two globals need the
same field shape, and reuse it — do not redefine an equivalent field group inline in a new
global.

---

# Access

Globals are commonly public-read (the Website needs to fetch header/footer/theme data
without auth) with restricted write access. Use `read: () => true` paired with an explicit
`update` access function — never make `update` public.

---

# Cache Invalidation

Any global the Website caches needs an `afterChange` hook (in `globals/hooks/`) that notifies
the Website's revalidation webhook — establish this pattern on the first cacheable global and
reuse the same shape for every subsequent one, matching the equivalent pattern for
collections (`cms/HOOKS.md`).

---

# Live Preview

If a global's content should be previewable, wire it into `admin.livePreview` in
`payload.config.ts` using the same URL-resolution approach used for previewable collections —
do not build a second, parallel preview mechanism.
