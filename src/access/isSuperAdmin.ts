import type { User } from '@/payload-types'

/**
 * The single, project-wide check for a platform-wide administrator.
 * Every access function that needs to bypass tenant scoping MUST go through
 * this helper rather than re-deriving a role check inline.
 */
export const isSuperAdmin = (user: User | null | undefined): boolean => {
  return Boolean(user?.roles?.includes('super-admin'))
}
