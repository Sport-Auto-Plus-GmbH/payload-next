# Good Examples

Reference patterns to build from day one in this project. These are illustrative — no
collection named exactly this exists yet — but they show the shape every real collection
should follow from the first one you build.

---

# Collection With Composed Hooks and Shared Access

```ts
// collections/FAQs/FAQs.ts
import { createAccess, readAccess, updateAccess, deleteAccess } from '@/collections/shared/access'
import { publishSettingsField } from '@/collections/shared/fields/publishSettingsField'
import { formatFaqSlug } from './hooks/formatFaqSlug'
import { revalidateFaqAfterChange, revalidateFaqAfterDelete } from './hooks/revalidateFaq'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  access: { create: createAccess, read: readAccess, update: updateAccess, delete: deleteAccess },
  hooks: {
    beforeValidate: [formatFaqSlug],
    afterChange: [revalidateFaqAfterChange],
    afterDelete: [revalidateFaqAfterDelete],
  },
  fields: [
    { name: 'question', type: 'text', required: true, localized: true },
    { name: 'answer', type: 'richText', required: true, localized: true },
    publishSettingsField({}),
  ],
}
```

Why this is good: reuses shared access, composes small named hooks instead of one large
function, reuses a shared publish-settings field group instead of redefining it.

---

# Tenant-Scoped Access Function

```ts
// collections/shared/access/updateAccess.ts
import { isSuperAdmin } from '@/access/isSuperAdmin'
import { getUserTenantIDs } from '@/utilities/getUserTenantIDs'

export const updateAccess = ({ req }: { req: PayloadRequest }) => {
  if (isSuperAdmin(req.user)) return true

  const tenantIDs = getUserTenantIDs(req.user)
  if (tenantIDs.length === 0) return false

  return { tenant: { in: tenantIDs } }
}
```

Why this is good: uses the project's one `isSuperAdmin` bypass, scopes everyone else to their
own tenants via a `Where` query rather than an all-or-nothing boolean.

---

# Cache-Revalidation Hook Pair

```ts
// collections/FAQs/hooks/revalidateFaq.ts
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

export const revalidateFaqAfterChange: CollectionAfterChangeHook = async ({ doc, req }) => {
  try {
    await fetch(`${process.env.FRONTEND_URL}/api/revalidate`, {
      method: 'POST',
      headers: { 'x-revalidate-secret': process.env.REVALIDATE_SECRET!, 'content-type': 'application/json' },
      body: JSON.stringify({ tag: `faq:${doc.slug}` }),
    })
  } catch (error) {
    req.payload.logger.error({ err: error }, 'FAQ revalidation failed')
  }
  return doc
}

export const revalidateFaqAfterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  // mirrors revalidateFaqAfterChange
  return doc
}
```

Why this is good: the side effect is isolated in its own named hook, failures are logged
without throwing (the document write already succeeded), and this exact shape should be
reused for every other cacheable collection instead of inventing a new one each time.

---

# Registering a New Tenant-Scoped Collection

```ts
// payload.config.ts (excerpt)
multiTenantPlugin<Config>({
  collections: {
    pages: {},
    faqs: {},
    'faq-categories': {}, // every tenant-scoped collection gets registered here
  },
  ...
})
```

Why this is good: the new collection is wired into the multi-tenant plugin configuration
from the moment it is created, rather than left to rely on ad-hoc scoping.
