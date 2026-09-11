import type { CollectionBeforeValidateHook } from 'payload'

import type { Media } from '@/payload-types'

import { parseYouTubeVideoId } from '../utilities/parseYouTubeVideoId'

export const populateYouTubeMetadata: CollectionBeforeValidateHook<Media> = ({ data }) => {
  if (data?.sourceType !== 'youtube') {
    return data
  }

  const videoId = parseYouTubeVideoId(data.youtubeUrl)
  if (!videoId) {
    return data
  }

  return {
    ...data,
    filename: videoId,
    mimeType: 'video/youtube',
  }
}
