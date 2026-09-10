import { describe, expect, it } from 'vitest'

import { readPublishedOrAuthenticated } from '@/collections/Pages/access/readPublishedOrAuthenticated'
import type { User } from '@/payload-types'

describe('readPublishedOrAuthenticated', () => {
  it('scopes an unauthenticated request to published pages only', () => {
    const result = readPublishedOrAuthenticated({
      req: { user: null },
    } as Parameters<typeof readPublishedOrAuthenticated>[0])

    expect(result).toEqual({ _status: { equals: 'published' } })
  })

  it('allows any authenticated user to read everything, including drafts', () => {
    const user = { id: 1, collection: 'users', roles: ['user'], email: 'a@b.com' } as User

    const result = readPublishedOrAuthenticated({
      req: { user },
    } as Parameters<typeof readPublishedOrAuthenticated>[0])

    expect(result).toBe(true)
  })
})
