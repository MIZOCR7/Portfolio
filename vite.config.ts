import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Dev-only stand-in for the `api/token` serverless function. It mints a
 * short-lived Gemini Live token on the server, so the API key is never part of
 * the client bundle.
 */
function geminiTokenDev(key: string | undefined): Plugin {
  return {
    name: 'gemini-token-dev',
    configureServer(server) {
      server.middlewares.use('/api/token', (req, res) => {
        const json = (status: number, body: unknown) => {
          res.statusCode = status
          res.setHeader('content-type', 'application/json')
          res.setHeader('cache-control', 'no-store')
          res.end(JSON.stringify(body))
        }

        if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' })
        if (!key) return json(503, { error: 'missing_key' })

        const now = Date.now()
        fetch('https://generativelanguage.googleapis.com/v1beta/auth_tokens', {
          method: 'POST',
          headers: { 'x-goog-api-key': key, 'content-type': 'application/json' },
          body: JSON.stringify({
            uses: 1,
            expireTime: new Date(now + 30 * 60 * 1000).toISOString(),
            newSessionExpireTime: new Date(now + 60 * 1000).toISOString(),
          }),
        })
          .then(async response => {
            const text = await response.text()
            if (!response.ok) return json(502, { error: 'upstream', detail: text.slice(0, 300) })
            const data = JSON.parse(text) as { name?: string }
            if (!data.name) return json(502, { error: 'no_token' })
            return json(200, { token: data.name })
          })
          .catch(err => json(500, { error: 'request_failed', detail: String(err).slice(0, 200) }))
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const key = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY

  return {
    plugins: [react(), geminiTokenDev(key)],
    server: {
      port: 3000,
      open: false,
    },
    build: {
      target: 'es2020',
      cssCodeSplit: false,
    },
  }
})
