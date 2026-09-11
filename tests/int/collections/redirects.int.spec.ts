import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

let payload: Payload
let tenantAID: number
let tenantBID: number
const createdRedirectIDs: number[] = []

const superAdmin = { roles: ['super-admin'] }
const regularUser = { roles: ['user'] }

// Unique per run so re-running this file locally (against a database that isn't reset
// between runs, unlike CI's disposable Postgres service) never collides with a previous
// run's leftover tenant/redirects.
const runID = Date.now()

describe('redirects collection', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    const tenantA = await payload.create({
      collection: 'tenants',
      data: { name: `Redirects Tenant A ${runID}`, slug: `redirects-tenant-a-${runID}` },
      overrideAccess: true,
    })
    tenantAID = tenantA.id

    const tenantB = await payload.create({
      collection: 'tenants',
      data: { name: `Redirects Tenant B ${runID}`, slug: `redirects-tenant-b-${runID}` },
      overrideAccess: true,
    })
    tenantBID = tenantB.id
  })

  afterAll(async () => {
    for (const id of createdRedirectIDs) {
      await payload.delete({ collection: 'redirects', id, overrideAccess: true })
    }
    await payload.delete({ collection: 'tenants', id: tenantAID, overrideAccess: true })
    await payload.delete({ collection: 'tenants', id: tenantBID, overrideAccess: true })
  })

  it('allows unauthenticated read', async () => {
    const result = await payload.find({
      collection: 'redirects',
      overrideAccess: false,
    })

    expect(result).toBeDefined()
  })

  it('denies create for a user without a tenant assignment', async () => {
    await expect(
      payload.create({
        collection: 'redirects',
        data: {
          from: `/should-not-save-${runID}`,
          to: { type: 'custom', url: '/somewhere' },
        },
        overrideAccess: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- minimal fake user, only `roles`/`tenants` matter to the access check
        user: regularUser as any,
      }),
    ).rejects.toThrow()
  })

  it('allows a super-admin to create a redirect', async () => {
    const redirect = await payload.create({
      collection: 'redirects',
      data: {
        from: `/old-path-${runID}`,
        to: { type: 'custom', url: '/new-path' },
        tenant: tenantAID,
      },
      overrideAccess: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- minimal fake user, only `roles` matters to the access check
      user: superAdmin as any,
    })
    createdRedirectIDs.push(redirect.id)

    expect(redirect.from).toBe(`/old-path-${runID}`)
  })

  it("denies a Tenant B admin from updating Tenant A's redirect", async () => {
    const redirect = await payload.create({
      collection: 'redirects',
      data: {
        from: `/tenant-a-only-${runID}`,
        to: { type: 'custom', url: '/somewhere' },
        tenant: tenantAID,
      },
      overrideAccess: true,
    })
    createdRedirectIDs.push(redirect.id)

    const tenantBAdmin = {
      roles: ['user'],
      tenants: [{ tenant: tenantBID, roles: ['tenant-admin'] }],
    }

    await expect(
      payload.update({
        collection: 'redirects',
        id: redirect.id,
        data: { from: `/hijacked-${runID}` },
        overrideAccess: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- minimal fake user, only `roles`/`tenants` matter to the access check
        user: tenantBAdmin as any,
      }),
    ).rejects.toThrow()
  })
})
