# AI Engineering Playbook — Payload CMS

This directory contains the complete engineering standards for the **Payload** project: the
headless CMS backing the Website. Payload runs on its latest 3.x release, Next.js, and
Postgres (via `@payloadcms/db-postgres`).

The public Website is a **separate, decoupled Next.js repository** that only talks to this
project through Payload's REST API. This project has no knowledge of the Website's
components, hooks, or Zustand stores — see `core/PROJECT_ARCHITECTURE.md`.

Every AI agent MUST read this playbook before making implementation decisions.

This repository also has a root-level `AGENTS.md` (imported by `CLAUDE.md`). The block inside
it between `<!-- BEGIN:nextjs-agent-rules -->` / `<!-- END:nextjs-agent-rules -->` is
generated automatically by `next dev` — do not remove or hand-edit it. This `.ai/` playbook
is the human-and-AI-authored source of truth for everything else.

## Reading Order

1. `core/AI_RULES.md`
2. `core/AI_BEHAVIOR.md`
3. `core/PROJECT_ARCHITECTURE.md`
4. Task-specific documents

## Task-Specific Reading

### Collection / Content-Model Task

- `cms/COLLECTIONS.md`
- `cms/FIELDS.md`
- `cms/HOOKS.md`
- `cms/ACCESS_CONTROL.md`
- `backend/DATABASE.md` (migrations)

### Global (Site-Wide Settings) Task

- `cms/GLOBALS.md`
- `cms/FIELDS.md`

### Page Builder / Blocks Task

- `cms/BLOCKS.md`
- `cms/FIELDS.md`

### Admin UI Customization Task

- `cms/ADMIN_COMPONENTS.md`

### Plugin / Integration Task

- `cms/PLUGINS.md`
- `backend/SECURITY.md`

### Public REST API Task (consumed by the Website)

- `backend/REST_API.md`
- `cms/ACCESS_CONTROL.md`
- `backend/MULTI_TENANCY.md`

### Multi-Tenancy Task

- `backend/MULTI_TENANCY.md`
- `cms/ACCESS_CONTROL.md`

### Database / Migration Task

- `backend/DATABASE.md`

### Code Review / Review Artifacts

- `quality/CODE_REVIEW.md`
- `core/FOLDER_STRUCTURE.md` (Reviews Folder)
- `core/NAMING_CONVENTIONS.md` (Review document names)

Always read only the documents relevant to the current task.

Never ignore an existing project pattern.
