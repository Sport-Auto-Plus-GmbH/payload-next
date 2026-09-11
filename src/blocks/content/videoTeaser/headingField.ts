import type { GroupField } from 'payload'

import { videoTeaserHeadingStyleFields } from './videoTeaserFields'

export function headingField(
  name: string,
  label: string,
  options: { required?: boolean },
): GroupField {
  return {
    type: 'group',
    name,
    label,
    fields: [
      { name: 'text', type: 'text', label: 'Text', required: options.required ?? false },
      ...videoTeaserHeadingStyleFields(),
    ],
  }
}
