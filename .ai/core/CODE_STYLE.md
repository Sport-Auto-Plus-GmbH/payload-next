# Code Style Guide

Coding standards for this project, enforced from the first commit. Readable code beats
clever code. This is a fresh project — there is no legacy debt to tolerate, so hold the
strict standard from day one rather than "cleaning it up later."

---

# Size Limits

- Functions (hooks, access functions, utilities): 50 lines maximum — prefer under 30.
- Non-config files (hooks, utilities, components): 500 lines maximum.
- Collection/global config files (`<Name>.ts`) MAY exceed the general file guidance when the
  bulk is declarative field definitions — but extract any field group used by more than one
  collection/global into `collections/shared/fields/` or `globals/fields/`, and extract any
  non-trivial inline function (a `filterOptions` callback doing real work, a computed
  default) into `hooks/` or `utilities/` instead of growing the config file with logic.

---

# Structure

- Prefer early returns over deep nesting, including inside hooks and access functions.
- Default to `const`; use `let` only when reassignment is required.
- Avoid magic numbers/strings — use named constants (`constants/`) for values reused across
  files.
- Prefer array methods (`map`, `filter`, `find`, `reduce`) over manual loops.
- Extract shared logic to `collections/shared/` or `utilities/` as soon as it is needed by a
  second collection/global — do not let a second collection quietly copy-paste a first
  collection's logic "for now."

---

# TypeScript — Strict, No Exceptions

- `strict` mode is on in `tsconfig.json` and MUST stay on.
- `any` is not acceptable. The project's ESLint config MUST enforce
  `@typescript-eslint/no-explicit-any` and `@typescript-eslint/no-unused-vars` as **errors**,
  not warnings — configure the linter this way from the start rather than allowing warnings
  to accumulate as silent debt. Use `unknown` and narrow, or a precise type, instead of `any`.
- Prefer precise Payload field types (`RelationshipField`, `Field`, `CollectionConfig`) over
  loosely-typed object literals when a cast would otherwise be required.
- Use the `@/*` path alias instead of long relative imports (see `core/FOLDER_STRUCTURE.md`).

---

# Exports

Use named exports matching the file's primary purpose
(`export const BlogPosts: CollectionConfig = ...`, `export const formatSlug = ...`).
Avoid default exports outside of Next.js's own required files (`route.ts` handlers,
`layout.tsx`, `page.tsx` under `app/`).

---

# Hooks and Access Functions

- One hook function does one thing (see `cms/HOOKS.md`). Compose multiple hooks in the
  collection's `hooks.beforeValidate`/`hooks.afterChange` arrays rather than writing one hook
  that does several unrelated things.
- Access functions return a boolean, a Payload `Where` query, or `false` — never throw for a
  normal "not allowed" case; throwing is reserved for genuine errors.

---

# Comments

Comments explain **why**, not what — e.g. why a `dbName` was shortened, why a field is no
longer editable after publish (to keep existing URLs valid), why a hook order matters.

---

# Logging

Use `req.payload.logger` inside hooks/endpoints instead of `console.log`. Never log secrets,
tokens, passwords, or full request bodies — configure the logger's redaction list for these
from the start (see `backend/SECURITY.md`).

---

# Common Pitfalls to Avoid

- Business logic inlined directly in a collection's `fields`/`hooks` array instead of a named
  function in `hooks/`/`utilities/`.
- A new collection that duplicates an existing shared access/field pattern instead of
  importing it from `collections/shared/`.
- Editing `payload-types.ts` by hand instead of running `pnpm generate:types`.
- Hand-editing a migration file that has already been applied anywhere.
- Letting ESLint warnings (`any`, unused vars) accumulate instead of fixing them immediately
  — in a fresh project, zero tolerance is cheap; it only gets expensive later.

---

# Final Standard

A developer should understand any collection, hook, or utility file within five minutes. If
comprehension requires longer, extract and name the unclear part.
