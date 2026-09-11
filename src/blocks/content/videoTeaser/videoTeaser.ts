import type { Block } from 'payload'

import { headingField } from './headingField'
import { videoTeaserDesignFields, videoTeaserYouTubeFields } from './videoTeaserFields'
import { validateTeaserImage, validateVideoSource } from './validateVideoTeaserMedia'

export const videoTeaser: Block = {
  slug: 'videoTeaser',
  labels: {
    singular: 'Video-Teaser',
    plural: 'Video-Teaser',
  },
  fields: [
    headingField('headline', 'Headline', { required: true }),
    headingField('subheadline', 'Subheadline', {}),
    {
      name: 'durationLabel',
      type: 'text',
      label: 'Laufzeit',
      admin: { description: 'Optionales Label im Play-Button, z. B. 00:30.' },
    },
    {
      name: 'teaserMedia',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Teaserbild',
      filterOptions: { mimeType: { like: 'image/%' } },
      validate: validateTeaserImage,
    },
    {
      name: 'videoMedia',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Video',
      filterOptions: { mimeType: { like: 'video/%' } },
      validate: validateVideoSource,
      admin: { description: 'Lokaler Video-Upload oder ein Medium mit hinterlegter YouTube-URL.' },
    },
    {
      type: 'group',
      name: 'design',
      label: 'Design-Überschreibungen',
      admin: { description: 'Leere Werte übernehmen die zentralen Video-Teaser-Werte der CI.' },
      fields: videoTeaserDesignFields(),
    },
    {
      type: 'group',
      name: 'youtube',
      label: 'YouTube & Datenschutz – Überschreibungen',
      admin: { description: 'Leere Werte übernehmen die zentralen Video-Teaser-Werte der CI.' },
      fields: videoTeaserYouTubeFields(),
    },
  ],
}
