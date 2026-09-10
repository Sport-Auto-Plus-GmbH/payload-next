# Blocks

Rules for Payload blocks (the page-builder content units) in this project.

---

# Two Kinds of Blocks

- `blocks/content/<name>/` — concrete, editor-composable content units (hero, FAQ,
  testimonial, vehicle slider, newsletter signup, ...). One folder per block, camelCase name
  matching the block's `slug`/`blockType`.
- `blocks/layouts/<name>.ts` — structural/column layout wrappers (one/two/three/four-column
  layouts) that arrange content blocks. Flat files, aggregated by `blocks/layouts/index.ts`
  as `layoutBlocks`.

Do not put a structural layout concern inside a content block, and do not put concrete
editorial content fields inside a layout block.

---

# Adding a New Content Block

1. Create `blocks/content/<camelCaseName>/` with the block's field definition.
2. Export it and add it to `blocks/content/index.ts`.
3. Reference it (via `blocks`/`blockReferences`) from the collection's `layout`-style field
   that should offer it — do not redefine its fields inline in the collection.
4. If the block needs a custom admin field component (a manual-selection picker, a filter
   builder), add it under `components/` — see `cms/ADMIN_COMPONENTS.md`.
5. Run `pnpm migrate:create` — a new block typically adds new tables/columns.

---

# Shared Block Settings

Extract cross-block settings (spacing, background) into a shared field group (e.g.
`blocks/layouts/sectionSettings.ts`) the first time two blocks need the same setting, and
reuse it — do not redefine it per block.

---

# Block Data Shape Stability

A block's fields are part of the stored document structure (Postgres block tables). Once a
block has shipped (a migration applied anywhere), renaming or removing a field is a breaking,
migration-heavy change — prefer adding a new optional field and deprecating the old one over
renaming in place, unless a proper data migration is planned (see `backend/DATABASE.md`).

---

# Rendering Is the Website's Job

This project defines block **data shapes** and admin editing UX only. How a block actually
renders visually is the decoupled Website's responsibility, driven by `blockType`/`slug` — do
not add rendering/presentation concerns here beyond what the Payload admin preview needs.
