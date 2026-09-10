import { describe, expect, it } from 'vitest'

import { readAccess } from '@/collections/shared/access/readAccess'

describe('readAccess', () => {
  it('always allows read (public, unauthenticated included)', () => {
    expect(readAccess({} as Parameters<typeof readAccess>[0])).toBe(true)
  })
})
