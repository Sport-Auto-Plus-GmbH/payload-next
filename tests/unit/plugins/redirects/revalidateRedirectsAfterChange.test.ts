import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/utilities/revalidateWebsiteTag', () => ({ revalidateWebsiteTag: vi.fn() }))

import { revalidateRedirectsAfterChange } from '@/plugins/redirects/revalidateRedirectsAfterChange'
import { revalidateWebsiteTag } from '@/utilities/revalidateWebsiteTag'
import type { Redirect } from '@/payload-types'

describe('revalidateRedirectsAfterChange', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('revalidates the "redirects" tag', async () => {
    await revalidateRedirectsAfterChange({
      doc: { from: '/old' } as Redirect,
      req: {},
    } as Parameters<typeof revalidateRedirectsAfterChange>[0])

    expect(revalidateWebsiteTag).toHaveBeenCalledWith('redirects', expect.anything())
    expect(revalidateWebsiteTag).toHaveBeenCalledTimes(1)
  })
})
