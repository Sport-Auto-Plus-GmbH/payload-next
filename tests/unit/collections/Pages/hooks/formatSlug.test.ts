import { describe, expect, it } from 'vitest'

import { formatSlug } from '@/collections/Pages/hooks/formatSlug'

function run(data: Record<string, unknown> | undefined) {
  return formatSlug({ data } as Parameters<typeof formatSlug>[0])
}

describe('formatSlug', () => {
  it('derives a kebab-case slug from the title when slug is empty', () => {
    const result = run({ title: 'Über Uns & Team' })
    expect(result?.slug).toBe('ber-uns-team')
  })

  it('normalizes an already-provided slug to lowercase kebab-case', () => {
    const result = run({ title: 'Anything', slug: 'Home Page!' })
    expect(result?.slug).toBe('home-page')
  })

  it('is idempotent — re-formatting an already-correct slug is a no-op', () => {
    const result = run({ title: 'Home', slug: 'home' })
    expect(result?.slug).toBe('home')
  })

  it('does nothing when data is undefined', () => {
    expect(run(undefined)).toBeUndefined()
  })
})
