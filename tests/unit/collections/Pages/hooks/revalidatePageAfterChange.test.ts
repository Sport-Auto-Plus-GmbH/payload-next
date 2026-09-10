import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/utilities/revalidateWebsiteTag', () => ({ revalidateWebsiteTag: vi.fn() }))

import { revalidatePageAfterChange } from '@/collections/Pages/hooks/revalidatePageAfterChange'
import { revalidateWebsiteTag } from '@/utilities/revalidateWebsiteTag'
import type { Page } from '@/payload-types'

function buildArgs(doc: Partial<Page>, previousDoc?: Partial<Page>) {
  return {
    doc,
    previousDoc,
    req: {},
  } as Parameters<typeof revalidatePageAfterChange>[0]
}

describe('revalidatePageAfterChange', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('revalidates the current slug', async () => {
    await revalidatePageAfterChange(buildArgs({ slug: 'home' }, { slug: 'home' }))

    expect(revalidateWebsiteTag).toHaveBeenCalledWith('page:home', expect.anything())
    expect(revalidateWebsiteTag).toHaveBeenCalledTimes(1)
  })

  it('also revalidates the old slug when the slug changed', async () => {
    await revalidatePageAfterChange(buildArgs({ slug: 'new-slug' }, { slug: 'old-slug' }))

    expect(revalidateWebsiteTag).toHaveBeenCalledWith('page:new-slug', expect.anything())
    expect(revalidateWebsiteTag).toHaveBeenCalledWith('page:old-slug', expect.anything())
    expect(revalidateWebsiteTag).toHaveBeenCalledTimes(2)
  })

  it('only revalidates once on create (no previousDoc)', async () => {
    await revalidatePageAfterChange(buildArgs({ slug: 'brand-new' }, undefined))

    expect(revalidateWebsiteTag).toHaveBeenCalledWith('page:brand-new', expect.anything())
    expect(revalidateWebsiteTag).toHaveBeenCalledTimes(1)
  })
})
