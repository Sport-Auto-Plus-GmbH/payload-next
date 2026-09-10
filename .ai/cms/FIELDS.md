# Fields

Rules for defining Payload fields in this project.

---

# Field Naming

Field `name` values are camelCase and describe the data, not the UI widget:
`featuredImage`, not `imageUpload`; `showAdditionalTopicLabels`, not `labelsCheckbox`.

---

# Build Shared Field Groups Early, Reuse Them Always

The first time a field group is needed by more than one collection/global (a color picker, a
publish-date/status pattern, an SEO-adjacent field set), extract it into
`collections/shared/fields/` or `globals/fields/` immediately — do not wait for a third
duplicate to "prove" it's shared. Every later collection/global needing the same concept MUST
import it rather than redefining an equivalent field group inline.

---

# Localization

Set `localized: true` only on fields whose content genuinely differs per locale (editorial
text: titles, excerpts, keywords). Do not localize structural/relationship fields (tenant,
category, media references) unless the relationship target itself legitimately differs by
locale.

---

# Tabs and Grouping

Use `type: 'tabs'` to group a collection's fields into editorial sections once it grows past
a handful of top-level fields (e.g. splitting core content, layout/blocks, and related-item
fields into separate tabs). Use `type: 'row'` to place short, related fields side-by-side.

---

# Conditional Fields

Use `admin.condition` for fields that only make sense given a sibling value, rather than
always showing an irrelevant field or splitting into two near-duplicate collections.

---

# Validation and Constraints

- Use field-level constraints (`min`, `max`, `required`, `index`) instead of enforcing the
  same rule only in a hook — the schema should reflect real constraints.
- Add `index: true` to fields queried/filtered often (slugs, dates used for sorting/filtering)
  — check `backend/DATABASE.md` for the migration implication.

---

# Relationships vs Embedded Data

- Use `relationship`/`upload` fields for anything that is its own editorial entity (a
  category, an author, a media asset) so it can be managed and reused independently.
- Use `group`/`array` fields for data that only ever exists as part of the parent document.

---

# Custom Admin Field Components

When a field needs bespoke admin UI (a color picker, an icon select, a themed row label),
point `admin.components.Field` at a component under `components/` (see
`cms/ADMIN_COMPONENTS.md`) rather than trying to force Payload's default field UI to do
something it is not designed for.

---

# Blocks as Fields

A `type: 'blocks'` field should reference block definitions via `blockReferences`/`blocks`
pointing at `blocks/content/` and `blocks/layouts/` — never redefine a block's fields inline
inside a collection.
