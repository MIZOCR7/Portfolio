/**
 * Mints a short-lived Gemini Live token for the browser.
 * The API key lives in the deployment's environment (GEMINI_API_KEY) and is
 * never sent to the client or committed to the repository.
 */
export default async function handler(req, res) {
  res.setHeader('cache-control', 'no-store')

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }

  const key = process.env.GEMINI_API_KEY
  if (!key) {
    res.status(503).json({ error: 'missing_key' })
    return
  }

  const now = Date.now()

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/auth_tokens', {
      method: 'POST',
      headers: { 'x-goog-api-key': key, 'content-type': 'application/json' },
      body: JSON.stringify({
        uses: 1,
        expireTime: new Date(now + 30 * 60 * 1000).toISOString(),
        newSessionExpireTime: new Date(now + 60 * 1000).toISOString(),
      }),
    })

    const text = await response.text()
    if (!response.ok) {
      res.status(502).json({ error: 'upstream', detail: text.slice(0, 300) })
      return
    }

    const data = JSON.parse(text)
    if (!data.name) {
      res.status(502).json({ error: 'no_token' })
      return
    }

    res.status(200).json({ token: data.name })
  } catch (err) {
    res.status(500).json({ error: 'request_failed', detail: String(err).slice(0, 200) })
  }
}
