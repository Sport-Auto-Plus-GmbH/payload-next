import { describe, expect, it } from 'vitest'

import { deleteAccess } from '@/collections/shared/access/deleteAccess'
import type { User } from '@/payload-types'

function buildReq(user: User | null) {
  return { req: { user } } as Parameters<typeof deleteAccess>[0]
}

describe('deleteAccess', () => {
  it('allows a super-admin unconditionally', () => {
    const user = { id: 1, collection: 'users', roles: ['super-admin'], email: 'a@b.com' } as User
    expect(deleteAccess(buildReq(user))).toBe(true)
  })

  it('scopes a tenant member to their own tenant(s)', () => {
    const user = {
      id: 1,
      collection: 'users',
      roles: ['user'],
      email: 'a@b.com',
      tenants: [{ tenant: 5, roles: ['tenant-admin'] }],
    } as User
    expect(deleteAccess(buildReq(user))).toEqual({ tenant: { in: [5] } })
  })

  it('denies a user with no tenant assignments', () => {
    const user = { id: 1, collection: 'users', roles: ['user'], email: 'a@b.com' } as User
    expect(deleteAccess(buildReq(user))).toBe(false)
  })

  it('denies an unauthenticated request', () => {
    expect(deleteAccess(buildReq(null))).toBe(false)
  })
})
