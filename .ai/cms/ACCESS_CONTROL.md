# Access Control

Rules for Payload access-control functions in this project. Access control is the single
place authorization decisions are made.

---

# The Four Named Functions

Every collection's `access` MUST use the same four names, imported rather than inlined:

```ts
access: {
  create: createAccess,
  read: readAccess,
  update: updateAccess,
  delete: deleteAccess,
},
```

- Reuse `collections/shared/access` for the common tenant-scoped pattern — build this the
  first time a collection needs tenant scoping, not per collection.
- Define collection-specific overrides in `collections/<Name>/access/` only when that
  collection's rules genuinely differ from the shared default.

---

# System Roles

`isSuperAdmin` (`src/access/isSuperAdmin.ts`) MUST be the single, project-wide way to check
for a platform-wide administrator:

```ts
export const updateAccess = ({ req }) => {
  if (isSuperAdmin(req.user)) return true
  return getUserTenantIDs(req.user).length > 0
}
```

Never re-derive "is this user a super admin" with an ad-hoc role string check elsewhere —
always go through `isSuperAdmin`.

---

# Tenant Scoping

Any access function for tenant-scoped data MUST restrict non-super-admin users to their own
tenant(s), using `getUserTenantIDs(req.user)` — either by returning a Payload `Where` query
scoped to those tenant IDs, or a boolean gate combined with a `filterOptions`/query elsewhere.
Never return a bare `true` for `read`/`update`/`delete` on tenant-scoped data without a tenant
check, even on the first draft of a collection "to get it working."

→ See `backend/MULTI_TENANCY.md` for the full tenant-role model.

---

# Public Read Access

Some collections intentionally allow public, unauthenticated read access (so the Website's
REST calls succeed without credentials) — e.g. a tenant's `allowPublicRead` flag. This MUST
remain a deliberate, explicit `read` rule — never widen `create`/`update`/`delete` to public
as a side effect of making `read` public.

---

# Return Type Discipline

An access function returns one of:

- `true` / `false` — unconditional allow/deny
- a Payload `Where` query — row-level scoping (e.g. "only documents where `tenant` is one of
  the user's tenants")

Never throw from an access function for a normal "not allowed" outcome — return `false`.
Throwing is reserved for genuine unexpected errors (e.g. a downstream lookup failing).

---

# Do Not Duplicate Authorization Logic

The moment a second collection needs the same authorization shape, extract it into
`collections/shared/access/` and import it from both — do not write similar-but-subtly-
different access functions per collection.

---

# Reviewing an Access Change

Before changing any access function, check:

- Does this still prevent cross-tenant access for non-super-admins?
- Does this still block public write access to anything not explicitly meant to be public?
- Does this match `backend/SECURITY.md`'s priority: security over convenience?
