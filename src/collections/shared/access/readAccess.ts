import type { Access } from 'payload'

/**
 * Standard public read access for tenant-scoped content the Website fetches
 * without authentication (matches Media's existing access). Reused across every
 * tenant-scoped collection meant to be publicly readable.
 */
export const readAccess: Access = () => true
