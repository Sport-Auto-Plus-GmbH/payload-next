import type { CollectionConfig } from 'payload'

import { convertToWebp } from './hooks/convertToWebp'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  hooks: {
    beforeOperation: [convertToWebp],
  },
  upload: {
    // image/svg+xml stays allowed and is never converted (see convertToWebp) —
    // needed for the logo and other vector assets.
    mimeTypes: ['image/*'],
  },
}
