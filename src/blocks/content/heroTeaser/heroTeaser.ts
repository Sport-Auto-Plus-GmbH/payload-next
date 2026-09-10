import type { Block } from 'payload'

import { styledTextField } from './styledTextField'

/**
 * The homepage hero: a headline, a subheadline, and a short description, each
 * with its own editable text/font-size/color — see .ai/cms/BLOCKS.md.
 */
export const heroTeaser: Block = {
  slug: 'heroTeaser',
  labels: {
    singular: 'Hero Teaser',
    plural: 'Hero Teaser',
  },
  fields: [
    styledTextField('headline', 'Headline', { required: true }),
    styledTextField('subheadline', 'Subheadline'),
    styledTextField('description', 'Beschreibung', { textarea: true }),
  ],
}
