import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../payload.config'

/**
 * One-off operational script to bootstrap the first super-admin user in a
 * fresh environment (local dev, a new staging instance, ...).
 *
 * Usage: pnpm exec tsx -r dotenv/config src/scripts/createSuperAdmin.ts <email> <password>
 */
async function run(): Promise<void> {
  const [email, password] = process.argv.slice(2)

  if (!email || !password) {
    console.error('Usage: tsx src/scripts/createSuperAdmin.ts <email> <password>')
    process.exit(1)
  }

  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    console.log(`User ${email} already exists (id ${existing.docs[0].id}) — skipping.`)
    process.exit(0)
  }

  const user = await payload.create({
    collection: 'users',
    data: {
      email,
      password,
      roles: ['super-admin'],
    },
  })

  console.log(`Created super-admin user ${user.email} (id ${user.id}).`)
  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
