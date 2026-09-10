import type { Access } from 'payload'

import { isSuperAdmin } from '@/access/isSuperAdmin'
import { getUserTenantIDs } from '@/utilities/getUserTenantIDs'

/**
 * Standard tenant-scoped create access: a super-admin, or any user assigned to at
 * least one tenant (the multi-tenant plugin assigns the document to one of the
 * user's tenants on create). Reused across every tenant-scoped collection.
 */
export const createAccess: Access = ({ req }) => {
  if (isSuperAdmin(req.user)) {
    return true
  }
  return getUserTenantIDs(req.user).length > 0
}
