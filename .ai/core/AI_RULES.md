# AI Rules

These rules define the mandatory behavior for every AI assistant working on this project.

These rules take precedence over all technology-specific guidelines.

Every generated code change must comply with these standards.

---

# Rule Keywords

## MUST

A mandatory rule. Violating a MUST rule is considered an incorrect implementation.

## SHOULD

A strong recommendation. Only deviate when there is a clear technical justification.

## MAY

Optional guidance. Use professional judgment.

## MUST NOT

A prohibited behavior. Never violate these rules unless explicitly instructed.

---

# Core Principles

## Rule 1

MUST prioritize correctness over speed.

## Rule 2

MUST prioritize readability over cleverness.

## Rule 3

MUST write code for humans first.

## Rule 4

MUST optimize for long-term maintainability.

## Rule 5

MUST keep the codebase consistent. Consistency is more valuable than personal preference.

---

# This Is a Headless CMS, Not the Website

Payload is the content and data authority. The public Website is a separate repository that
only consumes this project's REST API.

The AI MUST NOT:

- add Website-specific rendering logic (Tailwind/shadcn components, Zustand stores) to this
  repository
- assume knowledge of the Website's internal folder structure or components
- design a collection/field/API shape around one specific frontend rendering detail instead
  of around the actual content model

→ See `core/PROJECT_ARCHITECTURE.md` and `backend/REST_API.md`.

---

# Understanding the Task

Before generating code the AI MUST:

- Understand the requested task.
- Understand the existing implementation (the collection/global/block it touches).
- Understand the affected architecture (config → collection/global → fields/hooks/access →
  Postgres).
- Understand the surrounding code.

---

# Existing Code

The AI MUST reuse existing solutions, follow existing patterns, preserve existing
conventions, and integrate naturally into the project (see `cms/COLLECTIONS.md`,
`core/FOLDER_STRUCTURE.md` for the actual established patterns).

The AI MUST NOT introduce new patterns without a compelling reason — this project defines one
required collection/hooks/access shape (`cms/COLLECTIONS.md`, `core/FOLDER_STRUCTURE.md`);
do not invent a parallel one, even on the very first collection.

---

# Scope

The AI MUST only modify code required for the requested task.

The AI MUST NOT:

- refactor unrelated collections/globals/blocks
- rename existing field names, collection slugs, or `dbName` values without an explicit
  migration plan (see `backend/DATABASE.md`) — this breaks production data and generated
  migrations
- change formatting outside the task
- move files without justification

---

# Simplicity

The AI MUST choose the simplest solution that correctly solves the problem. Avoid
unnecessary abstractions, generic code, and configuration. Complexity must always be
justified.

---

# Reusability

Before writing new code the AI MUST search for existing shared fields
(`collections/shared/fields/`), shared access rules (`collections/shared/access/`), shared
hooks (`collections/shared/hooks/`), utilities (`utilities/`), and admin components
(`components/`). Reuse existing code whenever practical.

---

# Architecture

The AI MUST respect the existing architecture (see `core/PROJECT_ARCHITECTURE.md`). The AI
MUST NOT bypass Payload's access-control/hook layers with a raw database query.

---

# Production Quality

Every generated code change MUST be production ready: compiles, is type-safe, is formatted,
passes linting, is understandable. Incomplete implementations are not acceptable.

---

# Migrations Are Not Optional

Any change to collection/global fields that affects the database schema MUST come with a
corresponding migration generated via `pnpm migrate:create`. The AI MUST NOT hand-edit an
already-applied migration file, and MUST NOT delete or reorder existing files in
`src/migrations/`.

→ See `backend/DATABASE.md`.

---

# Dependencies

The AI MUST NOT introduce new dependencies unless existing libraries cannot solve the
problem, the dependency provides significant value, or it is explicitly requested. Always
prefer the project's existing stack (Payload's own field/hook/plugin APIs) over a bespoke
solution.

---

# File Organization

The AI MUST follow the folder conventions in `core/FOLDER_STRUCTURE.md`:

- one collection per `collections/<Name>/<Name>.ts`, with `hooks/`, `access/`, `utils/`
  subfolders as needed
- one global per `globals/<Name>/<Name>.ts` (or a flat `globals/<Name>.ts` when it needs no
  sibling helper files)
- one block per `blocks/content/<name>/` (or `blocks/layouts/<name>.ts` for structural
  layout blocks)

Size limits:

- functions: 50 lines maximum
- files: 500 lines maximum (a single collection config with many fields MAY exceed this when
  the fields themselves are the bulk of the file — extract reusable field groups into
  `collections/shared/fields/` or a colocated `fields.ts` rather than trimming necessary
  fields)

Split code when it approaches these limits or when readability suffers.

---

# Development Server

The AI MUST NOT start, restart, or stop the development server (`pnpm dev`, `next dev`).

The AI MUST NOT run `pnpm migrate` against a real environment without being asked — creating
a migration file (`migrate:create`) is fine; applying it is a deliberate, user-directed step.

---

# Naming

Names MUST describe intent. See `core/NAMING_CONVENTIONS.md` for this project's exact
casing rules (they differ by layer: PascalCase collection folders, camelCase hook/utility
files, kebab-case slugs).

---

# Comments

Comments MUST explain WHY, never WHAT.

---

# Error Handling

The AI MUST handle failures gracefully in hooks, access control, and endpoints. Never
silently ignore errors. Never leave empty catch blocks. A `beforeChange`/`afterChange` hook
that can fail must fail loudly (throw) rather than silently skip its side effect.

---

# Logging

Use the project's configured `pino` logger (via `req.payload.logger` inside hooks/endpoints)
instead of `console.log`. Never log secrets, tokens, passwords, or full request bodies —
follow the existing redaction list in `payload.config.ts`.

---

# Security

Security always has priority over convenience. Never expose secrets, weaken access control
for convenience, trust unvalidated external input, or bypass multi-tenant scoping.

→ See `backend/SECURITY.md`, `backend/MULTI_TENANCY.md`.

---

# Breaking Changes

The AI MUST NOT introduce a breaking change to a collection slug, field name, or the public
REST contract without explicit instruction. If a breaking change appears necessary: stop,
explain why, request confirmation, and plan the migration.

---

# Assumptions

The AI MUST NOT guess business rules, tenant-role permissions, or field requirements. When
uncertain, ask.

---

# Decision Priority

1. Security
2. Correctness
3. Data Integrity
4. Existing Architecture
5. Existing Project Patterns
6. Readability
7. Maintainability
8. Simplicity
9. Performance
10. Developer Convenience

---

# Definition of Done

A task is complete only if:

- The implementation works and the code compiles and is type-safe.
- `pnpm payload generate:types` was run (or is noted as needed) when fields changed, so
  `payload-types.ts` stays in sync.
- A migration exists for any schema-affecting change.
- Access control and multi-tenant scoping are respected for any new collection/field/endpoint.
- Existing patterns (folder shape, naming, shared fields/access/hooks) are reused.
- The development server was not started/restarted/stopped by the AI.

---

# Final Principle

Leave the project in a better state than before. Never leave the project worse than you
found it.
