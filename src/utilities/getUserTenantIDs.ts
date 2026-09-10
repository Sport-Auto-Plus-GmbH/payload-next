import { getUserTenantIDs as getUserTenantIDsFromPlugin } from '@payloadcms/plugin-multi-tenant/utilities'
import type { User } from '@/payload-types'

/**
 * Returns the tenant IDs a user is assigned to. Thin wrapper around the
 * multi-tenant plugin's own utility so the rest of the app imports it from
 * `@/utilities/*` like every other project utility.
 */
export const getUserTenantIDs = (user: User | null | undefined): number[] =>
  getUserTenantIDsFromPlugin<number>(user ?? null)
