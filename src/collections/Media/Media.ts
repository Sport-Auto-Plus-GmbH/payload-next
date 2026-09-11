import type { CollectionConfig } from 'payload'

import { convertToWebp } from './hooks/convertToWebp'
import { populateYouTubeMetadata } from './hooks/populateYouTubeMetadata'
import { requireUploadFile } from './hooks/requireUploadFile'
import { parseYouTubeVideoId } from './utilities/parseYouTubeVideoId'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alternativtext',
      required: true,
    },
    {
      name: 'sourceType',
      type: 'select',
      label: 'Quelle',
      defaultValue: 'upload',
      required: true,
      options: [
        { label: 'Datei-Upload', value: 'upload' },
        { label: 'YouTube-Link', value: 'youtube' },
      ],
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      label: 'YouTube-URL',
      admin: {
        condition: (_, siblingData) => siblingData?.sourceType === 'youtube',
        description: 'Akzeptiert youtube.com-, youtu.be- und YouTube-Shorts-Links.',
      },
      validate: (value: unknown, { siblingData }: { siblingData?: { sourceType?: string } }) => {
        if (siblingData?.sourceType !== 'youtube') {
          return true
        }

        return parseYouTubeVideoId(value) ? true : 'Bitte eine gültige YouTube-URL angeben.'
      },
    },
    {
      name: 'videoThumbnail',
      type: 'upload',
      relationTo: 'media',
      label: 'Video-Vorschaubild',
      admin: {
        description:
          'Optionales Poster für Video-Player. Im Video-Teaser ist das Teaserbild maßgeblich.',
      },
    },
  ],
  hooks: {
    beforeValidate: [requireUploadFile, populateYouTubeMetadata],
    beforeOperation: [convertToWebp],
  },
  upload: {
    // image/svg+xml stays allowed and is never converted (see convertToWebp) —
    // needed for the logo and other vector assets.
    filesRequiredOnCreate: false,
    mimeTypes: [
      'image/*',
      'video/youtube',
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/quicktime',
    ],
  },
}
