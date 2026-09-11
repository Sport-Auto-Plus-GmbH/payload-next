import type { Field } from 'payload'

export const VIDEO_TEASER_DEFAULTS = {
  headline: {
    tag: 'h2',
    color: '#FFFFFF',
    fontSize: 'clamp(1.8rem, 4.5vw, 4.4rem)',
  },
  subheadline: {
    tag: 'h3',
    color: '#E94E1D',
    fontSize: 'clamp(1.4rem, 3.2vw, 4rem)',
  },
  design: {
    overlayColor: 'rgba(0, 0, 0, 0.24)',
    playButtonBackgroundColor: 'rgba(63, 64, 66, 0.9)',
    playButtonTextColor: '#FFFFFF',
    playButtonRadius: '18px',
    lightboxBackdropColor: 'rgba(0, 0, 0, 0.8)',
    lightboxFrameColor: '#FFFFFF',
    lightboxFrameWidth: '2px',
    lightboxMaxWidth: '80rem',
    lightboxRadius: '14px',
  },
  youtube: {
    consentRequired: true,
    consentText: 'Zum Laden des YouTube-Videos wird eine Verbindung zu YouTube aufgebaut.',
    consentButtonLabel: 'Video laden',
  },
} as const

const HEADING_TAG_OPTIONS = [
  { label: 'Überschrift 1 (H1)', value: 'h1' },
  { label: 'Überschrift 2 (H2)', value: 'h2' },
  { label: 'Überschrift 3 (H3)', value: 'h3' },
  { label: 'Überschrift 4 (H4)', value: 'h4' },
  { label: 'Überschrift 5 (H5)', value: 'h5' },
  { label: 'Überschrift 6 (H6)', value: 'h6' },
]

type HeadingDefaults = {
  color: string
  fontSize: string
  tag: string
}

export function videoTeaserHeadingStyleFields(defaults?: HeadingDefaults): Field[] {
  return [
    {
      name: 'tag',
      type: 'select',
      label: 'Semantisches HTML-Tag',
      ...(defaults ? { defaultValue: defaults.tag } : {}),
      options: HEADING_TAG_OPTIONS,
    },
    {
      name: 'color',
      type: 'text',
      label: 'Farbe (Hex)',
      ...(defaults ? { defaultValue: defaults.color } : {}),
    },
    {
      name: 'fontSize',
      type: 'text',
      label: 'Schriftgröße',
      ...(defaults ? { defaultValue: defaults.fontSize } : {}),
      admin: { description: 'CSS-Wert, z. B. 2rem oder clamp(1.8rem, 4.5vw, 4.4rem).' },
    },
  ]
}

export function videoTeaserDesignFields(
  defaults?: (typeof VIDEO_TEASER_DEFAULTS)['design'],
): Field[] {
  const defaultValue = <T extends keyof (typeof VIDEO_TEASER_DEFAULTS)['design']>(name: T) =>
    defaults ? { defaultValue: defaults[name] } : {}

  return [
    { name: 'overlayColor', type: 'text', label: 'Overlay-Farbe', ...defaultValue('overlayColor') },
    {
      name: 'playButtonBackgroundColor',
      type: 'text',
      label: 'Hintergrundfarbe Play-Button',
      ...defaultValue('playButtonBackgroundColor'),
    },
    {
      name: 'playButtonTextColor',
      type: 'text',
      label: 'Textfarbe Play-Button',
      ...defaultValue('playButtonTextColor'),
    },
    {
      name: 'playButtonRadius',
      type: 'text',
      label: 'Radius Play-Button',
      ...defaultValue('playButtonRadius'),
    },
    {
      name: 'lightboxBackdropColor',
      type: 'text',
      label: 'Hintergrundfarbe Lightbox',
      ...defaultValue('lightboxBackdropColor'),
    },
    {
      name: 'lightboxFrameColor',
      type: 'text',
      label: 'Rahmenfarbe Lightbox',
      ...defaultValue('lightboxFrameColor'),
    },
    {
      name: 'lightboxFrameWidth',
      type: 'text',
      label: 'Rahmenstärke Lightbox',
      ...defaultValue('lightboxFrameWidth'),
    },
    {
      name: 'lightboxMaxWidth',
      type: 'text',
      label: 'Maximale Breite Lightbox',
      ...defaultValue('lightboxMaxWidth'),
      admin: { description: 'CSS-Wert, z. B. 80rem oder 90vw.' },
    },
    {
      name: 'lightboxRadius',
      type: 'text',
      label: 'Radius Lightbox',
      ...defaultValue('lightboxRadius'),
    },
  ]
}

export function videoTeaserYouTubeFields(
  defaults?: (typeof VIDEO_TEASER_DEFAULTS)['youtube'],
): Field[] {
  return [
    {
      name: 'consentRequired',
      type: 'checkbox',
      label: 'Einwilligung vor dem Laden einholen',
      ...(defaults ? { defaultValue: defaults.consentRequired } : {}),
    },
    {
      name: 'consentText',
      type: 'textarea',
      label: 'Hinweistext',
      ...(defaults ? { defaultValue: defaults.consentText } : {}),
    },
    {
      name: 'consentButtonLabel',
      type: 'text',
      label: 'Button-Beschriftung',
      ...(defaults ? { defaultValue: defaults.consentButtonLabel } : {}),
    },
  ]
}
