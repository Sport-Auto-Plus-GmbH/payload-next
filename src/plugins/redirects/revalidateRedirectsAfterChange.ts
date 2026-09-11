import type { CollectionAfterChangeHook } from 'payload'

import type { Redirect } from '@/payload-types'
import { revalidateWebsiteTag } from '@/utilities/revalidateWebsiteTag'

export const revalidateRedirectsAfterChange: CollectionAfterChangeHook<Redirect> = async ({
  doc,
  req,
}) => {
  await revalidateWebsiteTag('redirects', req)
  return doc
}
