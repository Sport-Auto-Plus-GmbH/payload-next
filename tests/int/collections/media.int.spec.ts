import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { beforeAll, describe, expect, it } from 'vitest'

let payload: Payload

describe('media collection access control', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('allows unauthenticated read', async () => {
    const result = await payload.find({
      collection: 'media',
      overrideAccess: false,
    })

    expect(result).toBeDefined()
  })
})
