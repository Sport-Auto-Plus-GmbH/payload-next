import { describe, expect, it } from 'vitest'

import { requireUploadFile } from '@/collections/Media/hooks/requireUploadFile'

type HookArgs = Parameters<typeof requireUploadFile>[0]

function buildArgs(
  sourceType: 'upload' | 'youtube',
  hasFile: boolean,
  operation: HookArgs['operation'] = 'create',
  originalSourceType?: 'upload' | 'youtube',
): HookArgs {
  return {
    data: { sourceType },
    operation,
    originalDoc: originalSourceType ? { sourceType: originalSourceType } : undefined,
    req: { file: hasFile ? { name: 'video.mp4' } : undefined },
  } as HookArgs
}

describe('requireUploadFile', () => {
  it('rejects an upload medium that has no file', () => {
    expect(() => requireUploadFile(buildArgs('upload', false))).toThrow()
  })

  it('allows a YouTube medium without a binary file', () => {
    expect(requireUploadFile(buildArgs('youtube', false))).toEqual({ sourceType: 'youtube' })
  })

  it('allows a regular upload with a file', () => {
    expect(requireUploadFile(buildArgs('upload', true))).toEqual({ sourceType: 'upload' })
  })

  it('rejects switching a YouTube medium to an upload without adding a file', () => {
    expect(() => requireUploadFile(buildArgs('upload', false, 'update', 'youtube'))).toThrow()
  })

  it('allows an existing upload to be updated without replacing its file', () => {
    expect(requireUploadFile(buildArgs('upload', false, 'update', 'upload'))).toEqual({
      sourceType: 'upload',
    })
  })
})
