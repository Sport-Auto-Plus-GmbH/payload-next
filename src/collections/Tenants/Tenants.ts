import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  labels: {
    singular: 'Tenant',
    plural: 'Tenants',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'domain', 'allowPublicRead'],
  },
  // Create/read/update/delete constraints are applied automatically by the
  // multi-tenant plugin's `useTenantsCollectionAccess` (see payload.config.ts) —
  // do not add a second, hand-written access layer on top of it.
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Used to resolve the tenant when a request has no matching domain.',
      },
    },
    {
      name: 'domain',
      type: 'text',
      unique: true,
      admin: {
        description: 'Public domain this tenant is served under, e.g. sportautoplus.de',
      },
    },
    {
      name: 'allowPublicRead',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          "Enables unauthenticated public read access to this tenant's content through the REST API. Off by default — opt in deliberately per tenant.",
      },
    },
  ],
}
