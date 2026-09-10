import { describe, expect, it } from 'vitest'

import { getUserTenantIDs } from '@/utilities/getUserTenantIDs'
import type { User } from '@/payload-types'

function buildUser(tenants: User['tenants']): User {
  return {
    id: 1,
    collection: 'users',
    roles: ['user'],
    email: 'user@example.com',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    tenants,
  }
}

describe('getUserTenantIDs', () => {
  it('returns the IDs of every tenant the user is assigned to', () => {
    const user = buildUser([
      { tenant: 1, roles: ['tenant-admin'] },
      { tenant: 2, roles: ['tenant-viewer'] },
    ])

    expect(getUserTenantIDs(user)).toEqual([1, 2])
  })

  it('returns an empty array for a user with no tenant assignments', () => {
    expect(getUserTenantIDs(buildUser(undefined))).toEqual([])
    expect(getUserTenantIDs(buildUser(null))).toEqual([])
  })

  it('returns an empty array for null/undefined (unauthenticated request)', () => {
    expect(getUserTenantIDs(null)).toEqual([])
    expect(getUserTenantIDs(undefined)).toEqual([])
  })
})
