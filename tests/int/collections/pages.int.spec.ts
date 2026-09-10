import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

let payload: Payload
let tenantID: number
const createdPageIDs: number[] = []

const superAdmin = { roles: ['super-admin'] }
const regularUser = { roles: ['user'] }

// Unique per run so re-running this file locally (against a database that isn't reset
// between runs, unlike CI's disposable Postgres service) never collides with a previous
// run's leftover tenant/slugs.
const runID = Date.now()

describe('pages collection', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    const tenant = await payload.create({
      collection: 'tenants',
      data: { name: `Test Tenant ${runID}`, slug: `test-tenant-${runID}` },
      overrideAccess: true,
    })
    tenantID = tenant.id
  })

  afterAll(async () => {
    for (const id of createdPageIDs) {
      await payload.delete({ collection: 'pages', id, overrideAccess: true })
    }
    await payload.delete({ collection: 'tenants', id: tenantID, overrideAccess: true })
  })

  it('allows unauthenticated read', async () => {
    const result = await payload.find({
      collection: 'pages',
      overrideAccess: false,
    })

    expect(result).toBeDefined()
  })

  it('denies create for a user without a tenant assignment', async () => {
    await expect(
      payload.create({
        collection: 'pages',
        data: { title: 'Should Not Save', slug: `should-not-save-${runID}` },
        draft: false,
        overrideAccess: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- minimal fake user, only `roles`/`tenants` matter to the access check
        user: regularUser as any,
      }),
    ).rejects.toThrow()
  })

  it('appends a numeric suffix when the slug is already taken', async () => {
    const first = await payload.create({
      collection: 'pages',
      data: { title: 'Kontakt', slug: `kontakt-${runID}`, tenant: tenantID },
      draft: false,
      overrideAccess: true,
    })
    createdPageIDs.push(first.id)
    expect(first.slug).toBe(`kontakt-${runID}`)

    const second = await payload.create({
      collection: 'pages',
      data: { title: 'Kontakt', slug: `kontakt-${runID}`, tenant: tenantID },
      draft: false,
      overrideAccess: true,
    })
    createdPageIDs.push(second.id)

    expect(second.slug).toBe(`kontakt-${runID}-2`)
  })

  it('allows a super-admin to create a page', async () => {
    const page = await payload.create({
      collection: 'pages',
      data: { title: 'Impressum', slug: `impressum-${runID}`, tenant: tenantID },
      draft: false,
      overrideAccess: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- minimal fake user, only `roles` matters to the access check
      user: superAdmin as any,
    })
    createdPageIDs.push(page.id)

    expect(page.slug).toBe(`impressum-${runID}`)
  })
})
