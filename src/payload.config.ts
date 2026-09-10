import { postgresAdapter } from '@payloadcms/db-postgres'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { isSuperAdmin } from './access/isSuperAdmin'
import { Media } from './collections/Media/Media'
import { Tenants } from './collections/Tenants/Tenants'
import { Users } from './collections/Users'
import { CorporateIdentity } from './globals/CorporateIdentity/CorporateIdentity'
import type { Config } from './payload-types'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001'

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    // No page-like (draft/versioned) collection exists yet, so `collections` stays
    // empty — Payload only shows the Live Preview tab for collections listed here.
    // Once one exists (e.g. a future Pages collection with `versions.drafts`), add
    // its slug and adjust the URL below to resolve that document's actual public
    // path (see .ai/cms/GLOBALS.md's Live Preview section and
    // src/app/(frontend) in the old project for the previous slug-resolution
    // approach, if useful as a reference).
    livePreview: {
      collections: [],
      breakpoints: [
        { label: 'Desktop', name: 'desktop', width: 1440, height: 1080 },
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
      ],
      url: async () => FRONTEND_URL,
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
  globals: [CorporateIdentity],
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
