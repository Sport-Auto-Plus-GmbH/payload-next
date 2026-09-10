# Code Review

Rules for reviewing changes and writing review artifacts in this project.

---

# What a Review Checks

1. **Data integrity** — does a schema-affecting change have a corresponding migration? Is
   `payload-types.ts` regenerated?
2. **Access control** — do new/changed collections, globals, or fields enforce the correct
   tenant scoping and role checks (`cms/ACCESS_CONTROL.md`, `backend/MULTI_TENANCY.md`)?
3. **Architecture** — does the change respect the config/hooks/access/utilities split in
   `core/PROJECT_ARCHITECTURE.md`? Is business logic in a named hook/utility, not inlined in
   a collection config?
4. **Consistency** — does it follow `core/NAMING_CONVENTIONS.md` and
   `core/FOLDER_STRUCTURE.md`, and match sibling collections/globals/blocks?
5. **Public contract** — does it change a slug, field name, or custom endpoint the Website
   depends on (`backend/REST_API.md`)? Was that intentional and coordinated?
6. **Security** — secrets, redaction, CORS/CSRF, public read scope (`backend/SECURITY.md`).

---

# Scope Discipline

Flag any change outside the stated task scope (unrelated collection edits, unrelated
formatting, opportunistic refactors) even if the change itself is an improvement.

---

# Written Review Artifacts

Store written reviews under:

```
reviews/<branch-folder>/YYYY-MM-DD_HH-MM-<slug>.md
```

Where `<branch-folder>` is the current branch name with `/` replaced by `-`. See
`core/NAMING_CONVENTIONS.md`.

Order findings by severity — data-integrity and access-control issues first, style last —
and be specific: file, line, the problem, and the concrete fix.

---

# Definition of a Passing Review

- Every schema-affecting change has a migration; `payload-types.ts` is current.
- No access-control regression, especially cross-tenant.
- No secret or credential exposure.
- No unannounced breaking change to a collection slug, field name, or custom endpoint.
- Naming and folder placement match established project conventions.
