import { describe, expect, it } from 'vitest'

import { createAccess } from '@/collections/shared/access/createAccess'
import type { User } from '@/payload-types'

function buildReq(user: User | null) {
  return { req: { user } } as Parameters<typeof createAccess>[0]
}

describe('createAccess', () => {
  it('allows a super-admin', () => {
    const user = { id: 1, collection: 'users', roles: ['super-admin'], email: 'a@b.com' } as User
    expect(createAccess(buildReq(user))).toBe(true)
  })

  it('allows a user assigned to at least one tenant', () => {
    const user = {
      id: 1,
      collection: 'users',
      roles: ['user'],
      email: 'a@b.com',
      tenants: [{ tenant: 1, roles: ['tenant-admin'] }],
    } as User
    expect(createAccess(buildReq(user))).toBe(true)
  })

  it('denies a user with no tenant assignments', () => {
    const user = { id: 1, collection: 'users', roles: ['user'], email: 'a@b.com' } as User
    expect(createAccess(buildReq(user))).toBe(false)
  })

  it('denies an unauthenticated request', () => {
    expect(createAccess(buildReq(null))).toBe(false)
  })
})
