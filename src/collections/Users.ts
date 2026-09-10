import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'roles'],
  },
  auth: true,
  fields: [
    // Email added by default
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['user'],
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'User', value: 'user' },
      ],
      admin: {
        description:
          'Global system role. Super Admin bypasses all tenant scoping (see isSuperAdmin). ' +
          'Per-tenant roles (tenant-admin / tenant-viewer) are set per row in the "Tenants" ' +
          'field below, added automatically by the multi-tenant plugin.',
      },
    },
    // The multi-tenant plugin adds a `tenants` array field here automatically
    // (see payload.config.ts's tenantsArrayField.rowFields for the per-tenant role).
  ],
}
