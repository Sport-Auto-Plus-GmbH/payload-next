import { describe, expect, it } from 'vitest'

import { resolvePageLivePreviewUrl } from '@/utilities/resolvePageLivePreviewUrl'

describe('resolvePageLivePreviewUrl', () => {
  it('resolves the "home" slug to the site root', () => {
    expect(resolvePageLivePreviewUrl('http://localhost:3001', 'home')).toBe(
      'http://localhost:3001/',
    )
  })

  it('resolves any other slug to a matching path', () => {
    expect(resolvePageLivePreviewUrl('http://localhost:3001', 'about')).toBe(
      'http://localhost:3001/about',
    )
  })

  it('falls back to the site root when the slug is not set yet (new document)', () => {
    expect(resolvePageLivePreviewUrl('http://localhost:3001', undefined)).toBe(
      'http://localhost:3001/',
    )
  })
})
