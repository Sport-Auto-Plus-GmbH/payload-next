import type { CollectionBeforeValidateHook } from 'payload'

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Normalizes the slug field to lowercase kebab-case, deriving it from the title
 * when left empty. Idempotent — re-saving an already-correct slug is a no-op.
 */
export const formatSlug: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) {
    return data
  }

  if (data.slug) {
    data.slug = slugify(data.slug)
  } else if (data.title) {
    data.slug = slugify(data.title)
  }

  return data
}
