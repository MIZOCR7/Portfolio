import { createLiveToken, getLiveStatus } from '../server/live.js'

/* Live voice sessions are more expensive than a text answer, so this endpoint
   is deliberately tighter than /api/chat. Each token can start one session. */
const WINDOW_MS = 60_000
const LIMIT = 4
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
  res.setHeader('Cache-Control', 'no-store, max-age=0')
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  if (req.method === 'GET') {
    return res.status(200).json(getLiveStatus())
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  if (rateLimited(ip)) {
    return res.status(429).json({
      error: 'rate_limited',
      message: 'Too many live calls started in a minute. Give it a moment.',
    })
  }

  try {
    const session = await createLiveToken()
    return res.status(200).json(session)
  } catch (error) {
    const status = error.status || 500
    return res.status(status).json({
      error: error.code || 'live_error',
      message: error.message || 'The live voice session could not start.',
    })
  }
}
