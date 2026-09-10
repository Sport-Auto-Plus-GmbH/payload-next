import type { GlobalConfig } from 'payload'

import { isSuperAdmin } from '@/access/isSuperAdmin'

export const CorporateIdentity: GlobalConfig = {
  slug: 'corporate-identity',
  label: 'Corporate Identity',
  access: {
    // Public read — the Website fetches this without authentication.
    read: () => true,
    update: ({ req }) => isSuperAdmin(req.user),
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
      admin: {
        description:
          'Horizontal logo on a light background. Falls back to the static default in website-next/public/cd/logo if empty.',
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
  ],
}
