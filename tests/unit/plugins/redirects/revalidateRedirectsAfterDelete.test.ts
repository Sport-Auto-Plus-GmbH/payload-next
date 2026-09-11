import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/utilities/revalidateWebsiteTag', () => ({ revalidateWebsiteTag: vi.fn() }))

import { revalidateRedirectsAfterDelete } from '@/plugins/redirects/revalidateRedirectsAfterDelete'
import { revalidateWebsiteTag } from '@/utilities/revalidateWebsiteTag'
import type { Redirect } from '@/payload-types'

describe('revalidateRedirectsAfterDelete', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('revalidates the "redirects" tag', async () => {
    await revalidateRedirectsAfterDelete({
      doc: { from: '/old' } as Redirect,
      req: {},
    } as Parameters<typeof revalidateRedirectsAfterDelete>[0])

    expect(revalidateWebsiteTag).toHaveBeenCalledWith('redirects', expect.anything())
    expect(revalidateWebsiteTag).toHaveBeenCalledTimes(1)
  })
})
