import sharp from 'sharp'
import { describe, expect, it } from 'vitest'

import { convertToWebp } from '@/collections/Media/hooks/convertToWebp'

type HookArgs = Parameters<typeof convertToWebp>[0]

function buildArgs(file: HookArgs['req']['file'], operation: HookArgs['operation']): HookArgs {
  return {
    req: { file } as HookArgs['req'],
    args: {} as HookArgs['args'],
    operation,
  } as HookArgs
}

describe('convertToWebp', () => {
  it('converts an uploaded PNG to WebP', async () => {
    const pngBuffer = await sharp({
      create: { width: 4, height: 4, channels: 3, background: { r: 255, g: 0, b: 0 } },
    })
      .png()
      .toBuffer()

    const args = buildArgs(
      { data: pngBuffer, mimetype: 'image/png', name: 'test.png', size: pngBuffer.length },
      'create',
    )

    await convertToWebp(args)

    expect(args.req.file?.mimetype).toBe('image/webp')
    expect(args.req.file?.name).toBe('test.webp')
    expect(args.req.file?.data).not.toEqual(pngBuffer)
  })

  it('leaves an SVG untouched', async () => {
    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>')
    const args = buildArgs(
      { data: svg, mimetype: 'image/svg+xml', name: 'logo.svg', size: svg.length },
      'create',
    )

    await convertToWebp(args)

    expect(args.req.file?.mimetype).toBe('image/svg+xml')
    expect(args.req.file?.data).toEqual(svg)
  })

  it('does nothing when there is no file on the request', async () => {
    const args = buildArgs(undefined, 'create')

    await expect(convertToWebp(args)).resolves.toBe(args.args)
    expect(args.req.file).toBeUndefined()
  })

  it('skips conversion for operations other than create/update', async () => {
    const pngBuffer = await sharp({
      create: { width: 4, height: 4, channels: 3, background: { r: 0, g: 255, b: 0 } },
    })
      .png()
      .toBuffer()

    const args = buildArgs(
      { data: pngBuffer, mimetype: 'image/png', name: 'test.png', size: pngBuffer.length },
      'delete',
    )

    await convertToWebp(args)

    expect(args.req.file?.mimetype).toBe('image/png')
  })
})
