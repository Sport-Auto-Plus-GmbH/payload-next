import { describe, expect, it } from 'vitest'

import { parseYouTubeVideoId } from '@/collections/Media/utilities/parseYouTubeVideoId'

describe('parseYouTubeVideoId', () => {
  it.each([
    ['https://www.youtube.com/watch?v=video-id', 'video-id'],
    ['https://youtu.be/video-id', 'video-id'],
    ['https://www.youtube.com/shorts/video-id', 'video-id'],
    ['https://www.youtube.com/embed/video-id', 'video-id'],
  ])('extracts the id from %s', (url, expected) => {
    expect(parseYouTubeVideoId(url)).toBe(expected)
  })

  it('rejects links from other hosts and malformed URLs', () => {
    expect(parseYouTubeVideoId('https://example.com/watch?v=video-id')).toBeNull()
    expect(parseYouTubeVideoId('not-a-url')).toBeNull()
  })
})
