import type { GenerateTitle } from '@payloadcms/plugin-seo/types'

import type { Page } from '@/payload-types'

// Suggests the SEO tab's meta title from the page's own title when an editor clicks
// "Auto-generate" — editors can still override it manually afterward. There's no
// generic description-like field on Pages yet (content lives in per-block fields, e.g.
// heroTeaser's description), so generateDescription is intentionally not implemented —
// add it once a block-agnostic summary field exists.
export const generateTitle: GenerateTitle<Page> = ({ doc }) => doc.title || ''
