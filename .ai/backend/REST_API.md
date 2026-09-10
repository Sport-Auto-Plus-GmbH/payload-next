# REST API

Rules for the public REST surface this project exposes to the decoupled Next.js Website.
This is a contract other people's code depends on from the moment it ships — treat every
addition to it deliberately, even on day one.

---

# The Default Surface

Every collection and global automatically gets Payload's standard REST endpoints
(`/api/<collection-slug>`, `/api/<collection-slug>/:id`, `/api/globals/<global-slug>`),
governed by that collection/global's `access` rules. This is the Website's primary way of
reading content — prefer it over a custom endpoint whenever it already covers the need
(filtering via `where`, depth via `depth`, locale via `locale`, drafts via `draft=true`).

---

# Custom Endpoints (`app/api/`)

Add a custom, purpose-built endpoint only when:

- the Website needs a shape or aggregation the standard collection/global REST response
  cannot express reasonably (e.g. a lightweight cache-version check to decide whether to
  refetch), or
- the endpoint intentionally exposes a narrower, safer public read than the full collection
  REST response would (e.g. resolving a tenant by domain without exposing the full tenant
  document).

Do not add a custom endpoint that just re-shapes a standard collection response for
convenience — that logic belongs in the Website's own `lib/cms/` mapping layer, not here.

---

# Breaking Changes Are Cross-Repo Breaking Changes

Because the Website is a separate repository, changing a collection slug, a field name a
custom endpoint returns, or a custom endpoint's path/response shape breaks the Website at
runtime with no compile-time warning on either side. Before doing so:

- confirm whether the Website actually depends on the field/endpoint
- prefer additive changes (a new field, a new optional query param) over renaming/removing
- if a breaking change is unavoidable, treat it like an API version bump: coordinate timing
  with whoever deploys the Website

---

# CORS and CSRF

Scope `cors`/`csrf` in `payload.config.ts` to an explicit list of known origins (the
project's own public server URL, the Website's preview/production origins). Adding a new
consuming origin (a new Website deployment/preview environment) means adding it to these
lists explicitly — never widen `cors`/`csrf` to `'*'` or a wildcard pattern to "make it work."

---

# Drafts and Live Preview

Requests with `draft=true` (paired with appropriate live-preview auth) return unpublished
content — this is intentional, for the Website's live-preview mode, and is separate from
normal public reads. Access rules still apply on top of draft mode — never let `draft=true`
bypass access control for non-preview, unauthenticated requests.

---

# Localization

Public REST consumers select a locale via `?locale=de` / `?locale=en`. If locale fallback is
enabled, an unset `en` field falls back to the default locale — be aware of this when a
custom endpoint aggregates localized fields; do not silently assume a field is present in the
requested locale.

---

# Rate Limiting and Abuse

Custom public endpoints (especially cache/version-check endpoints likely to be polled)
should be cheap to compute and cacheable at the HTTP layer (appropriate cache headers) — do
not add a public endpoint that performs an expensive query with no caching story.
