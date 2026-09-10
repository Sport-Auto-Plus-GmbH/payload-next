import type { CollectionConfig } from 'payload'

import { contentBlocks } from '@/blocks/content'
import { createAccess } from '@/collections/shared/access/createAccess'
import { deleteAccess } from '@/collections/shared/access/deleteAccess'
import { updateAccess } from '@/collections/shared/access/updateAccess'

import { readPublishedOrAuthenticated } from './access/readPublishedOrAuthenticated'
import { ensureUniqueSlug } from './hooks/ensureUniqueSlug'
import { formatSlug } from './hooks/formatSlug'
import { revalidatePageAfterChange } from './hooks/revalidatePageAfterChange'
import { revalidatePageAfterDelete } from './hooks/revalidatePageAfterDelete'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Seite',
    plural: 'Seiten',
  },
  access: {
    create: createAccess,
    // Pages-specific, not the shared readAccess — see readPublishedOrAuthenticated's
    // comment for why drafts need this override.
    read: readPublishedOrAuthenticated,
    update: updateAccess,
    delete: deleteAccess,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
  },
  versions: {
    // Enables the Draft/Publish workflow and the "Live Preview" tab (see
    // payload.config.ts's admin.livePreview.collections). Saving now defaults to a
    // draft; editors explicitly Publish to make a change public.
    drafts: true,
  },
  hooks: {
    beforeValidate: [formatSlug, ensureUniqueSlug],
    afterChange: [revalidatePageAfterChange],
    afterDelete: [revalidatePageAfterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Slug',
      admin: {
        description:
          'Wird automatisch aus dem Titel erzeugt, falls leer gelassen. Die Seite mit dem ' +
          'Slug "home" ist die Startseite der Website.',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      label: 'Inhalt',
      blocks: contentBlocks,
    },
  ],
}
