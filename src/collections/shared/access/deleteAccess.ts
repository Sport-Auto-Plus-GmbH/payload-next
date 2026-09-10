import type { Access } from 'payload'

import { isSuperAdmin } from '@/access/isSuperAdmin'
import { getUserTenantIDs } from '@/utilities/getUserTenantIDs'

/**
 * Standard tenant-scoped delete access: a super-admin can delete anything; anyone
 * else is scoped to documents belonging to one of their own tenants. Reused across
 * every tenant-scoped collection.
 */
export const deleteAccess: Access = ({ req }) => {
  if (isSuperAdmin(req.user)) {
    return true
  }

  const tenantIDs = getUserTenantIDs(req.user)
  if (tenantIDs.length === 0) {
    return false
  }

  return { tenant: { in: tenantIDs } }
}
