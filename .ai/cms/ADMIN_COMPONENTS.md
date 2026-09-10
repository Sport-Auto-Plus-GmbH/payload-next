# Admin UI Components

Rules for custom Payload admin panel React components in this project (`components/`).
These are internal editor-facing tools, not the public Website's UI.

---

# When to Build a Custom Admin Component

Only when Payload's default field UI genuinely cannot express the editing experience needed:
a color picker with project presets, an icon picker backed by FontAwesome, a themed
row-label summarizing an array item, a button that triggers a server-side sync action. Do
not build a custom component to replicate what a standard field type already does well.

---

# Naming and Location

PascalCase `.tsx` files under `components/`, matching the exported component:

```
components/ColorPickerField.tsx
components/IconSelectField.tsx
```

A small camelCase helper file directly supporting one or two of these components (shared
option lists, shared defaults) may sit alongside them here (e.g.
`components/buttonThemeFieldShared.ts`).

---

# Wiring Into a Field

Point the field's `admin.components.Field` (or `Cell`, `RowLabel`, etc.) at the component's
import path:

```ts
admin: {
  components: { Field: '@/components/ColorPickerField' },
  custom: { defaultColor: '#f4f4f4' },
},
```

---

# Import Map

Custom components referenced from field configs must be resolvable through Payload's
generated import map (`generate:importmap`). After adding or moving a custom component,
regenerate the import map — do not hand-edit the generated import map file.

---

# Keep Editor UX Consistent

Build a custom field component once and reuse it across every collection/global that needs
the same editing experience — do not build a near-duplicate with a different name for the
second use case.

---

# Client-Only Boundaries

Payload admin field components run in the browser inside the admin panel. Keep server-only
concerns (secrets, direct DB access) out of these components — they should call Payload's own
REST/GraphQL API or a dedicated custom endpoint for any server interaction, never embed
credentials client-side.

---

# Accessibility

Custom admin components are used daily by real editors — apply the same baseline as any UI:
keyboard operability, visible focus, labeled controls. Prefer building on Payload's own UI
primitives (`@payloadcms/ui`) over hand-rolled form controls to inherit this for free.

---

# Icons (FontAwesome Pro+)

FontAwesome Pro+ (`@fortawesome/fontawesome-svg-core`, `@fortawesome/react-fontawesome`, and
the `pro-regular`/`pro-solid`/`pro-duotone` icon packages) is installed for use inside custom
admin components — an icon picker field, a themed row-label, branding assets under
`components/branding/`. It is the only icon system in this project; do not add another icon
library alongside it.

Import individual icons, never a whole style package:

```ts
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/pro-regular-svg-icons'
```

The private FontAwesome npm registry token is a per-developer credential — it lives in the
project-local `.npmrc` (gitignored, never committed). Copy `.npmrc.example` to `.npmrc` and
fill in your own token; never put a real token in `.npmrc.example`. See `README.md`.
