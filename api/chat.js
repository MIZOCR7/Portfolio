import { askGemini, getAgentStatus } from '../server/agent.js'

/* A light per-instance guard so a public deployment cannot be used as an
   unlimited proxy for the owner's Gemini key. */
const WINDOW_MS = 60_000
const LIMIT = 20
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
    return res.status(200).json(getAgentStatus())
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
      message: 'Too many questions in a minute. Give the agent a moment.',
    })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const answer = await askGemini({ message: body.message, history: body.history })
    return res.status(200).json({ answer })
  } catch (error) {
    const status = error.status || 500
    return res.status(status).json({
      error: error.code || 'agent_error',
      message: error.message || 'The agent could not answer right now.',
    })
  }
}
