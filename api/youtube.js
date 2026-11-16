import { getYouTubeStatus, searchYouTube, YouTubeError } from '../server/youtube.js'

const WINDOW_MS = 60_000
const LIMIT = 30
const buckets = new Map()

function rateLimited(ip) {
  const now = Date.now()
  const bucket = buckets.get(ip)
  if (!bucket || now - bucket.start > WINDOW_MS) {
    buckets.set(ip, { start: now, count: 1 })
    return false
  }
  bucket.count += 1
  return bucket.count > LIMIT
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  const url = new URL(req.url || '/', 'https://portfolio.local')
  const query = url.searchParams.get('q') || ''
  if (!query.trim()) return res.status(200).json(getYouTubeStatus())

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  if (rateLimited(ip)) {
    res.setHeader('Cache-Control', 'no-store')
    return res.status(429).json({
      error: 'rate_limited',
      message: 'Too many YouTube searches in a minute. Give it a moment.',
    })
  }

  try {
    const items = await searchYouTube(query, url.searchParams.get('limit'))
    return res.status(200).json({ items, ...getYouTubeStatus() })
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store')
    return res.status(error.status || 500).json({
      error: error.code || 'youtube_error',
      message: error.message || 'YouTube search failed.',
    })
  }
}

export { YouTubeError }
