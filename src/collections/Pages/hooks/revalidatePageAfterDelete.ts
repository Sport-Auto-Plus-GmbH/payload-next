import type { CollectionAfterDeleteHook } from 'payload'

import type { Page } from '@/payload-types'
import { revalidateWebsiteTag } from '@/utilities/revalidateWebsiteTag'

export const revalidatePageAfterDelete: CollectionAfterDeleteHook<Page> = async ({ doc, req }) => {
  await revalidateWebsiteTag(`page:${doc.slug}`, req)
  return doc
}
