const YOUTUBE_HOSTS = new Set(['youtube.com', 'm.youtube.com', 'youtu.be'])

export function parseYouTubeVideoId(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) {
    return null
  }

  try {
    const url = new URL(value.trim())
    const host = url.hostname.replace(/^www\./i, '').toLowerCase()
    if (!YOUTUBE_HOSTS.has(host)) {
      return null
    }

    if (host === 'youtu.be') {
      return url.pathname.split('/').filter(Boolean)[0] ?? null
    }

    if (url.pathname === '/watch') {
      return url.searchParams.get('v')
    }

    const [type, videoId] = url.pathname.split('/').filter(Boolean)
    return type === 'embed' || type === 'shorts' ? (videoId ?? null) : null
  } catch {
    return null
  }
}
