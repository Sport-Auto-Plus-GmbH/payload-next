import 'dotenv/config'
import { readFileSync } from 'fs'
import { getPayload } from 'payload'

import config from '../payload.config'

/**
 * One-off operational script that:
 * - ensures a default tenant exists (Media is tenant-scoped and needs one)
 * - uploads the master brand logo (src/seeds/assets/sport-auto-plus-logo.svg)
 *   into the Media collection, owned by that tenant
 * - sets it as the CorporateIdentity global's logo, if not already set
 *
 * Usage: pnpm exec tsx -r dotenv/config src/scripts/seedCorporateIdentity.ts
 */
async function run(): Promise<void> {
  const payload = await getPayload({ config })

  const existing = await payload.findGlobal({ slug: 'corporate-identity' })

  if (existing.logo) {
    console.log('CorporateIdentity already has a logo set — skipping.')
    process.exit(0)
  }

  const existingTenants = await payload.find({
    collection: 'tenants',
    limit: 1,
    overrideAccess: true,
  })

  let tenant = existingTenants.docs[0]

  if (!tenant) {
    tenant = await payload.create({
      collection: 'tenants',
      data: { name: 'Sport Auto Plus', slug: 'sportautoplus', allowPublicRead: true },
      overrideAccess: true,
    })
    console.log(`Created default tenant "${tenant.slug}" (id ${tenant.id}).`)
  }

  const filePath = new URL('../seeds/assets/sport-auto-plus-logo.svg', import.meta.url)
  const data = readFileSync(filePath)

  const logo = await payload.create({
    collection: 'media',
    data: { alt: 'Sport Auto Plus Logo', tenant: tenant.id },
    file: {
      data,
      mimetype: 'image/svg+xml',
      name: 'sport-auto-plus-logo.svg',
      size: data.length,
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'corporate-identity',
    data: { logo: logo.id },
    overrideAccess: true,
  })

  console.log(`Set CorporateIdentity logo to media id ${logo.id}.`)
  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
