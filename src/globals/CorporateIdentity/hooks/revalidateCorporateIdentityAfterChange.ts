import type { GlobalAfterChangeHook } from 'payload'

import { revalidateWebsiteTag } from '@/utilities/revalidateWebsiteTag'

export const revalidateCorporateIdentityAfterChange: GlobalAfterChangeHook = async ({
  doc,
  req,
}) => {
  await revalidateWebsiteTag('corporate-identity', req)
  return doc
}
