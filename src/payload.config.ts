import { postgresAdapter } from '@payloadcms/db-postgres'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { isSuperAdmin } from './access/isSuperAdmin'
import { Media } from './collections/Media'
import { Tenants } from './collections/Tenants/Tenants'
import { Users } from './collections/Users'
import type { Config } from './payload-types'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    // Custom admin branding is not configured yet — using Payload's defaults for
    // now. When a real design is ready, wire it in here rather than inventing a
    // different mechanism (see src/components/branding/README.md):
    //
    // components: {
    //   graphics: {
    //     Logo: '@/components/branding/Logo',
    //     Icon: '@/components/branding/Icon',
    //   },
    // },
    // meta: {
    //   titleSuffix: '- Sport Auto Plus',
    //   icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' }],
    // },
    //
    // Global style overrides go in src/app/(payload)/custom.scss, already wired
    // into the admin layout by the generator.
  },
  collections: [Tenants, Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    ...(process.env.DATABASE_SCHEMA && process.env.DATABASE_SCHEMA !== 'public'
      ? { schemaName: process.env.DATABASE_SCHEMA }
      : {}),
  }),
  sharp,
  plugins: [
    multiTenantPlugin<Config>({
      collections: {
        // Every tenant-scoped collection is registered here as it is created.
        media: {},
      },
      tenantsArrayField: {
        rowFields: [
          {
            name: 'roles',
            type: 'select',
            hasMany: true,
            required: true,
            defaultValue: ['tenant-viewer'],
            options: [
              { label: 'Tenant Admin', value: 'tenant-admin' },
              { label: 'Tenant Viewer', value: 'tenant-viewer' },
            ],
          },
        ],
      },
      userHasAccessToAllTenants: (user) => isSuperAdmin(user),
    }),
  ],
})
