import type { GlobalConfig } from 'payload'

import { isSuperAdmin } from '@/access/isSuperAdmin'
import {
  VIDEO_TEASER_DEFAULTS,
  videoTeaserDesignFields,
  videoTeaserHeadingStyleFields,
  videoTeaserYouTubeFields,
} from '@/blocks/content/videoTeaser/videoTeaserFields'

import { revalidateCorporateIdentityAfterChange } from './hooks/revalidateCorporateIdentityAfterChange'

export const CorporateIdentity: GlobalConfig = {
  slug: 'corporate-identity',
  label: 'Corporate Identity',
  access: {
    // Public read — the Website fetches this without authentication.
    read: () => true,
    update: ({ req }) => isSuperAdmin(req.user),
  },
  hooks: {
    afterChange: [revalidateCorporateIdentityAfterChange],
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
      admin: {
        description:
          'Horizontal logo on a light background. Falls back to the static default in ' +
          'public/cd/logo (both here and in website-next) if empty.',
      },
    },
    {
      type: 'group',
      name: 'colors',
      label: 'Farben',
      admin: {
        description:
          'Hex-Werte aus dem Corporate-Design-Dokument. Plain-Text-Felder für den Start — ein ' +
          'echtes Farbwähler-UI (siehe ColorPickerField-Muster in .ai/cms/ADMIN_COMPONENTS.md) ' +
          'kann später ergänzt werden.',
      },
      fields: [
        {
          name: 'primary',
          type: 'text',
          required: true,
          defaultValue: '#E94E1D',
          label: 'Primär (Orange)',
        },
        {
          name: 'secondary',
          type: 'text',
          required: true,
          defaultValue: '#323E48',
          label: 'Sekundär (Dunkelgrau)',
        },
        {
          name: 'destructive',
          type: 'text',
          required: true,
          defaultValue: '#990000',
          label: 'Fehler/Warnung (Rot)',
        },
      ],
    },
    {
      type: 'group',
      name: 'videoTeaser',
      label: 'Video-Teaser',
      admin: {
        description:
          'Zentrale Standardwerte für alle Video-Teaser. Einzelne Blöcke können diese Werte gezielt überschreiben.',
      },
      fields: [
        {
          type: 'group',
          name: 'headline',
          label: 'Headline',
          fields: videoTeaserHeadingStyleFields(VIDEO_TEASER_DEFAULTS.headline),
        },
        {
          type: 'group',
          name: 'subheadline',
          label: 'Subheadline',
          fields: videoTeaserHeadingStyleFields(VIDEO_TEASER_DEFAULTS.subheadline),
        },
        {
          type: 'group',
          name: 'design',
          label: 'Design',
          fields: videoTeaserDesignFields(VIDEO_TEASER_DEFAULTS.design),
        },
        {
          type: 'group',
          name: 'youtube',
          label: 'YouTube & Datenschutz',
          fields: videoTeaserYouTubeFields(VIDEO_TEASER_DEFAULTS.youtube),
        },
      ],
    },
  ],
}
