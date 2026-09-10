import type { CollectionAfterChangeHook } from 'payload'

import type { Page } from '@/payload-types'
import { revalidateWebsiteTag } from '@/utilities/revalidateWebsiteTag'

export const revalidatePageAfterChange: CollectionAfterChangeHook<Page> = async ({
  doc,
  previousDoc,
  req,
}) => {
  await revalidateWebsiteTag(`page:${doc.slug}`, req)

  // The slug changed — the Website also has the OLD slug's URL cached, which would
  // otherwise keep serving stale (or now-nonexistent) content until that cache entry
  // naturally expires.
  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    await revalidateWebsiteTag(`page:${previousDoc.slug}`, req)
  }

  return doc
}
