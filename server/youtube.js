/* YouTube search without shipping a key to the browser.
   When YOUTUBE_API_KEY is present we use the official Data API. Otherwise we
   query YouTube's public web search response and keep the same small shape.
   Playback always happens in the official embedded player. */

const CACHE_TTL = 5 * 60 * 1000
const CACHE_MAX = 60
const cache = new Map()

export class YouTubeError extends Error {
  constructor(message, status = 502, code = 'youtube_error') {
    super(message)
    this.status = status
    this.code = code
  }
}

export function getYouTubeStatus() {
  return {
    configured: Boolean(process.env.YOUTUBE_API_KEY),
    source: 'youtube',
  }
}

function cleanQuery(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, 120) : ''
}

function thumbnailFor(id) {
  return `https://i.ytimg.com/vi/${encodeURIComponent(id)}/mqdefault.jpg`
}

function fromOfficial(items, limit) {
  return (items || []).slice(0, limit).map(item => {
    const snippet = item.snippet || {}
    return {
      id: item.id?.videoId,
      title: snippet.title || 'Untitled video',
      author: snippet.channelTitle || 'YouTube',
      duration: '',
      thumbnail: snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || '',
      views: '',
      published: snippet.publishedAt ? snippet.publishedAt.slice(0, 10) : '',
      source: 'youtube',
    }
  }).filter(item => item.id)
}

function fromPublicSearch(root, limit) {
  const out = []
  const seen = new Set()

  const walk = node => {
    if (!node || typeof node !== 'object' || out.length >= limit) return
    if (node.videoRenderer) {
      const video = node.videoRenderer
      const id = video.videoId
      if (id && !seen.has(id)) {
        seen.add(id)
        const title = (video.title?.runs || []).map(run => run.text || '').join('')
        const author = video.ownerText?.runs?.[0]?.text || video.longBylineText?.runs?.[0]?.text || 'YouTube'
        const thumb = video.thumbnail?.thumbnails?.at(-1)?.url || thumbnailFor(id)
        out.push({
          id,
          title: title || 'Untitled video',
          author,
          duration: video.lengthText?.simpleText || '',
          thumbnail: thumb,
          views: video.shortViewCountText?.simpleText || video.viewCountText?.simpleText || '',
          published: video.publishedTimeText?.simpleText || '',
          source: 'youtube',
        })
      }
      return
    }
    for (const value of Object.values(node)) walk(value)
  }

  walk(root)
  return out
}

async function publicSearch(query, limit) {
  let res
  try {
    res = await fetch('https://www.youtube.com/youtubei/v1/search?prettyPrint=false', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-YouTube-Client-Name': '1',
        'X-YouTube-Client-Version': '2.20240101.00.00',
      },
      body: JSON.stringify({
        context: {
          client: {
            clientName: 'WEB',
            clientVersion: '2.20240101.00.00',
            hl: 'en',
            gl: 'US',
          },
        },
        query,
      }),
      signal: AbortSignal.timeout(15000),
    })
  } catch {
    throw new YouTubeError('YouTube search could not be reached. Try again in a moment.', 502, 'youtube_unreachable')
  }

  if (!res.ok) {
    throw new YouTubeError('YouTube search is not responding right now. Try again in a moment.', 502, 'youtube_upstream')
  }

  let data
  try {
    data = await res.json()
  } catch {
    throw new YouTubeError('YouTube returned an unreadable response.', 502, 'youtube_bad_response')
  }

  return fromPublicSearch(data, limit)
}

async function officialSearch(query, limit) {
  const key = process.env.YOUTUBE_API_KEY
  const url = new URL('https://www.googleapis.com/youtube/v3/search')
  url.searchParams.set('part', 'snippet')
  url.searchParams.set('type', 'video')
  url.searchParams.set('videoEmbeddable', 'true')
  url.searchParams.set('maxResults', String(limit))
  url.searchParams.set('q', query)
  url.searchParams.set('key', key)

  let res
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(15000) })
  } catch {
    throw new YouTubeError('YouTube search could not be reached.', 502, 'youtube_unreachable')
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    console.error('YouTube Data API error', res.status, detail.slice(0, 240))
    throw new YouTubeError('YouTube search is unavailable right now.', 502, 'youtube_upstream')
  }
  const data = await res.json()
  return fromOfficial(data.items, limit)
}

export async function searchYouTube(value, limit = 18) {
  const query = cleanQuery(value)
  if (!query) throw new YouTubeError('Type something to search YouTube.', 400, 'empty_query')
  const max = Math.max(1, Math.min(24, Number(limit) || 18))
  const cacheKey = `${query.toLowerCase()}|${max}`
  const hit = cache.get(cacheKey)
  if (hit && Date.now() - hit.at < CACHE_TTL) return hit.items

  let items
  if (process.env.YOUTUBE_API_KEY) {
    try {
      items = await officialSearch(query, max)
    } catch {
      items = await publicSearch(query, max)
    }
  } else {
    items = await publicSearch(query, max)
  }

  if (!items.length) {
    throw new YouTubeError('No videos matched that search. Try something broader.', 404, 'no_results')
  }

  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value)
  cache.set(cacheKey, { at: Date.now(), items })
  return items
}
