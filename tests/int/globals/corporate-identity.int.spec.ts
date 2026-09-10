import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { beforeAll, describe, expect, it } from 'vitest'

let payload: Payload

const superAdmin = { roles: ['super-admin'] }
const regularUser = { roles: ['user'] }

describe('corporate-identity global access control', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('allows unauthenticated read', async () => {
    const result = await payload.findGlobal({
      slug: 'corporate-identity',
      overrideAccess: false,
    })

    expect(result).toBeDefined()
  })

  it('denies update for a user without the super-admin role', async () => {
    await expect(
      payload.updateGlobal({
        slug: 'corporate-identity',
        data: { colors: { primary: '#000000' } },
        overrideAccess: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- minimal fake user, only `roles` matters to the access check
        user: regularUser as any,
      }),
    ).rejects.toThrow()
  })

  it('allows update for a super-admin user', async () => {
    const result = await payload.updateGlobal({
      slug: 'corporate-identity',
      data: { colors: { primary: '#123456' } },
      overrideAccess: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- minimal fake user, only `roles` matters to the access check
      user: superAdmin as any,
    })

    expect(result.colors.primary).toBe('#123456')
  })
})
