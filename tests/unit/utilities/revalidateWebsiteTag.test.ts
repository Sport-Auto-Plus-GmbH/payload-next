import { afterEach, describe, expect, it, vi } from 'vitest'

import { revalidateWebsiteTag } from '@/utilities/revalidateWebsiteTag'

function buildReq() {
  return {
    payload: {
      logger: { warn: vi.fn(), error: vi.fn() },
    },
  } as unknown as Parameters<typeof revalidateWebsiteTag>[1]
}

describe('revalidateWebsiteTag', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('POSTs the tag with the shared secret header', async () => {
    vi.stubEnv('FRONTEND_URL', 'http://localhost:3001')
    vi.stubEnv('REVALIDATE_SECRET', 'shh')
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    await revalidateWebsiteTag('page:home', buildReq())

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/api/revalidate',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'x-revalidate-secret': 'shh' }),
        body: JSON.stringify({ tag: 'page:home' }),
      }),
    )
  })

  it('logs and does nothing when REVALIDATE_SECRET is not configured', async () => {
    vi.stubEnv('REVALIDATE_SECRET', '')
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const req = buildReq()

    await revalidateWebsiteTag('page:home', req)

    expect(fetchMock).not.toHaveBeenCalled()
    expect(req.payload.logger.warn).toHaveBeenCalled()
  })

  it('logs rather than throws when the Website responds with an error status', async () => {
    vi.stubEnv('FRONTEND_URL', 'http://localhost:3001')
    vi.stubEnv('REVALIDATE_SECRET', 'shh')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
    const req = buildReq()

    await expect(revalidateWebsiteTag('page:home', req)).resolves.toBeUndefined()
    expect(req.payload.logger.error).toHaveBeenCalled()
  })

  it('logs rather than throws when the fetch itself fails (network error)', async () => {
    vi.stubEnv('FRONTEND_URL', 'http://localhost:3001')
    vi.stubEnv('REVALIDATE_SECRET', 'shh')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const req = buildReq()

    await expect(revalidateWebsiteTag('page:home', req)).resolves.toBeUndefined()
    expect(req.payload.logger.error).toHaveBeenCalled()
  })
})
