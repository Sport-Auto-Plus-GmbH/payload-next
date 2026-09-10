# Admin Branding

Custom Payload admin panel branding components, wired into `admin.components.graphics` in
`src/payload.config.ts`.

- **`Logo.tsx`** — replaces the logo on the login page. A Server Component that reads the
  `corporate-identity` global's `logo` field directly via the `payload` local API (no HTTP
  round trip — it's the same process), falling back to the static
  `public/cd/logo/sport-auto-plus-logo.svg` if the global has no logo set yet.
- **`Icon.tsx`** — not added yet. Would replace the small mark in the collapsed nav; needs a
  square version of the logo first.

Follow [`.ai/cms/ADMIN_COMPONENTS.md`](../../../.ai/cms/ADMIN_COMPONENTS.md) for any further
custom admin component.

Global style overrides (colors, fonts, layout tweaks) belong in
`src/app/(payload)/custom.scss`, which the generated admin layout already imports — currently
used to give the login page's submit button the brand color.
