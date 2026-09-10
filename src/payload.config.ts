import { postgresAdapter } from '@payloadcms/db-postgres'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { isSuperAdmin } from './access/isSuperAdmin'
import { Media } from './collections/Media/Media'
import { Pages } from './collections/Pages/Pages'
import { Tenants } from './collections/Tenants/Tenants'
import { Users } from './collections/Users'
import { CorporateIdentity } from './globals/CorporateIdentity/CorporateIdentity'
import type { Config } from './payload-types'
import { resolvePageLivePreviewUrl } from './utilities/resolvePageLivePreviewUrl'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001'
const SERVER_URL = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'

export default buildConfig({
  // Payload's own public origin. Without this set explicitly, adding `cors`/`csrf` below
  // makes Payload require the request's own Host header to also be in the allowlist (see
  // getRequestOrigin's warning) — the admin UI's own same-origin requests would otherwise
  // start failing once cors/csrf are scoped to the Website's origin only.
  serverURL: SERVER_URL,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      collections: [Pages.slug],
      breakpoints: [
        { label: 'Desktop', name: 'desktop', width: 1440, height: 1080 },
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
      ],
      // Only Pages is previewable right now, so `data.slug` always resolves via
      // resolvePageLivePreviewUrl. A second previewable collection with a different
      // URL shape would need to branch on `collectionConfig.slug` here.
      url: ({ data }) => resolvePageLivePreviewUrl(FRONTEND_URL, data?.slug),
    },
    components: {
      graphics: {
        Logo: '@/components/branding/Logo.tsx#default',
      },
    },
    meta: {
      titleSuffix: '- Sport Auto Plus',
    },
    // Global style overrides (e.g. the login page's brand-colored button) go in
    // src/app/(payload)/custom.scss, already wired into the admin layout by the
    // generator. A custom Icon (collapsed nav mark) can be added the same way as
    // Logo above once a square version of the mark exists.
  },
  collections: [Tenants, Users, Media, Pages],
  globals: [CorporateIdentity],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  // Scoped to the Website's own origin(s) only — see .ai/backend/REST_API.md's "CORS and
  // CSRF". Needed for Live Preview: useLivePreview fetches the full document cross-origin
  // (localhost:3001 -> localhost:3000) to populate relationships beyond the postMessage
  // payload.
  cors: [FRONTEND_URL],
  csrf: [FRONTEND_URL],
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
        pages: {},
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
