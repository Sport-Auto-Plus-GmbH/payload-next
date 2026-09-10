import type { CollectionBeforeValidateHook } from 'payload'

/**
 * Appends -2, -3, ... to the slug until it's unique, rather than letting the
 * database's unique constraint reject the save outright. Slugs are globally
 * unique across tenants for now (not per-tenant) — see .ai/backend/DATABASE.md
 * if/when true multi-tenant page content needs each tenant to reuse slugs like
 * "home" independently; that needs the tenant relationship resolved before this
 * hook runs, which multi-tenant-plugin-assigned collections don't guarantee yet.
 */
export const ensureUniqueSlug: CollectionBeforeValidateHook = async ({
  data,
  req,
  originalDoc,
}) => {
  if (!data?.slug) {
    return data
  }

  const isSlugTaken = async (slug: string): Promise<boolean> => {
    const existing = await req.payload.find({
      collection: 'pages',
      where: {
        and: [
          { slug: { equals: slug } },
          ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
        ],
      },
      limit: 1,
      overrideAccess: true,
      req,
    })
    return existing.docs.length > 0
  }

  if (!(await isSlugTaken(data.slug))) {
    return data
  }

  let suffix = 2
  let candidate = `${data.slug}-${suffix}`
  while (await isSlugTaken(candidate)) {
    suffix += 1
    candidate = `${data.slug}-${suffix}`
  }

  data.slug = candidate
  return data
}
