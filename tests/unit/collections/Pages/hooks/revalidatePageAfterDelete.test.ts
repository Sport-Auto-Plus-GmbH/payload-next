import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/utilities/revalidateWebsiteTag', () => ({ revalidateWebsiteTag: vi.fn() }))

import { revalidatePageAfterDelete } from '@/collections/Pages/hooks/revalidatePageAfterDelete'
import { revalidateWebsiteTag } from '@/utilities/revalidateWebsiteTag'
import type { Page } from '@/payload-types'

describe('revalidatePageAfterDelete', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('revalidates the deleted page slug', async () => {
    await revalidatePageAfterDelete({
      doc: { slug: 'home' } as Page,
      req: {},
    } as Parameters<typeof revalidatePageAfterDelete>[0])

    expect(revalidateWebsiteTag).toHaveBeenCalledWith('page:home', expect.anything())
    expect(revalidateWebsiteTag).toHaveBeenCalledTimes(1)
  })
})
