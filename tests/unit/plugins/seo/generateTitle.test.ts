import { describe, expect, it } from 'vitest'

import { generateTitle } from '@/plugins/seo/generateTitle'
import type { Page } from '@/payload-types'

describe('generateTitle', () => {
  it("suggests the page's own title", () => {
    const result = generateTitle({
      doc: { title: 'Startseite' } as Page,
    } as Parameters<typeof generateTitle>[0])

    expect(result).toBe('Startseite')
  })

  it('falls back to an empty string when the page has no title yet', () => {
    const result = generateTitle({
      doc: { title: '' } as Page,
    } as Parameters<typeof generateTitle>[0])

    expect(result).toBe('')
  })
})
