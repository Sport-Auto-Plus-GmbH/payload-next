# Admin Branding

This folder is reserved for custom Payload admin panel branding components (logo, favicon
icon, and similar), once a real design exists. Nothing is customized yet — the admin panel
currently uses Payload's own defaults.

When ready, add components here (e.g. `Logo.tsx`, `Icon.tsx`) following
[`.ai/cms/ADMIN_COMPONENTS.md`](../../../.ai/cms/ADMIN_COMPONENTS.md), and wire them into
`admin.components.graphics` in `src/payload.config.ts` — the exact spot is already
commented there.

Global style overrides (colors, fonts, layout tweaks) belong in
`src/app/(payload)/custom.scss`, which the generated admin layout already imports.
