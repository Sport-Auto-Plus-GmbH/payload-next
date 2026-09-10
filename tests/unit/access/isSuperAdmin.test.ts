import { describe, expect, it } from 'vitest'

import { isSuperAdmin } from '@/access/isSuperAdmin'
import type { User } from '@/payload-types'

function buildUser(roles: User['roles']): User {
  return {
    id: 1,
    collection: 'users',
    roles,
    email: 'user@example.com',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
}

describe('isSuperAdmin', () => {
  it('returns true for a user with the super-admin role', () => {
    expect(isSuperAdmin(buildUser(['super-admin']))).toBe(true)
  })

  it('returns false for a user without the super-admin role', () => {
    expect(isSuperAdmin(buildUser(['user']))).toBe(false)
  })

  it('returns false for a user with no roles', () => {
    expect(isSuperAdmin(buildUser([]))).toBe(false)
  })

  it('returns false for null/undefined (unauthenticated request)', () => {
    expect(isSuperAdmin(null)).toBe(false)
    expect(isSuperAdmin(undefined)).toBe(false)
  })
})
