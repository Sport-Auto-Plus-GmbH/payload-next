import type { CollectionAfterDeleteHook } from 'payload'

import type { Redirect } from '@/payload-types'
import { revalidateWebsiteTag } from '@/utilities/revalidateWebsiteTag'

export const revalidateRedirectsAfterDelete: CollectionAfterDeleteHook<Redirect> = async ({
  doc,
  req,
}) => {
  await revalidateWebsiteTag('redirects', req)
  return doc
}
