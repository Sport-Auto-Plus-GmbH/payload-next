import { describe, expect, it, vi } from 'vitest'

vi.mock('@/utilities/revalidateWebsiteTag', () => ({ revalidateWebsiteTag: vi.fn() }))

import { revalidateCorporateIdentityAfterChange } from '@/globals/CorporateIdentity/hooks/revalidateCorporateIdentityAfterChange'
import { revalidateWebsiteTag } from '@/utilities/revalidateWebsiteTag'

type HookArgs = Parameters<typeof revalidateCorporateIdentityAfterChange>[0]

describe('revalidateCorporateIdentityAfterChange', () => {
  it('invalidates the corporate-identity cache tag after saving the global', async () => {
    const args = {
      doc: { id: 1 },
      req: {},
    } as HookArgs

    await revalidateCorporateIdentityAfterChange(args)

    expect(revalidateWebsiteTag).toHaveBeenCalledWith('corporate-identity', args.req)
  })
})
