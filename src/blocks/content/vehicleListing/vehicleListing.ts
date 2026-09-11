import type { Block } from 'payload'

import { styledTextField } from '../heroTeaser/styledTextField'

/**
 * A live vehicle listing pulled from the Datendrehscheibe at render time — see
 * .ai/cms/BLOCKS.md's "Rendering Is the Website's Job". This block only holds editorial
 * config (heading/subheading, how many vehicles to show); it never stores vehicle data
 * itself, matching how the old Payload project's vehicle blocks worked.
 */
export const vehicleListing: Block = {
  slug: 'vehicleListing',
  labels: {
    singular: 'Fahrzeug-Liste',
    plural: 'Fahrzeug-Listen',
  },
  fields: [
    styledTextField('heading', 'Überschrift', { required: true }),
    styledTextField('subheading', 'Unterüberschrift'),
    {
      name: 'maxItems',
      type: 'number',
      label: 'Maximale Anzahl Fahrzeuge',
      required: true,
      defaultValue: 6,
      min: 1,
      max: 24,
    },
  ],
}
