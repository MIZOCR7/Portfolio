import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { askGemini, getAgentStatus } from './server/agent.js'
import { createLiveToken, getLiveStatus } from './server/live.js'
import { getYouTubeStatus, searchYouTube } from './server/youtube.js'

/* Local stand-ins for the Vercel functions so `npm run dev` can exercise the
   AI terminal and the Gemini Live call without deploying. The key stays in
   .env and never enters the bundle. */
function agentApi() {
  return {
    name: 'ziad-agent-api',
    configureServer(server: { middlewares: { use: (path: string, fn: Function) => void } }) {
      server.middlewares.use('/api/chat', async (req: any, res: any) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.setHeader('Cache-Control', 'no-store, max-age=0')

        if (req.method === 'GET') {
          res.statusCode = 200
          res.end(JSON.stringify(getAgentStatus()))
          return
        }
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'method_not_allowed' }))
          return
        }

        const chunks: Buffer[] = []
        for await (const chunk of req) chunks.push(Buffer.from(chunk))
        let body: any = {}
        try {
          body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
        } catch {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'bad_json' }))
          return
        }

        try {
          const answer = await askGemini({ message: body.message, history: body.history })
          res.statusCode = 200
          res.end(JSON.stringify({ answer }))
        } catch (error: any) {
          res.statusCode = error.status || 500
          res.end(
            JSON.stringify({
              error: error.code || 'agent_error',
              message: error.message || 'The agent could not answer right now.',
            })
          )
        }
      })

      server.middlewares.use('/api/youtube', async (req: any, res: any) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')

        if (req.method !== 'GET') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'method_not_allowed' }))
          return
        }

        const url = new URL(req.url || '/', 'http://localhost')
        const query = url.searchParams.get('q') || ''
        if (!query.trim()) {
          res.statusCode = 200
          res.end(JSON.stringify(getYouTubeStatus()))
          return
        }

        try {
          const items = await searchYouTube(query, url.searchParams.get('limit'))
          res.statusCode = 200
          res.end(JSON.stringify({ items, ...getYouTubeStatus() }))
        } catch (error: any) {
          res.statusCode = error.status || 500
          res.setHeader('Cache-Control', 'no-store')
          res.end(
            JSON.stringify({
              error: error.code || 'youtube_error',
              message: error.message || 'YouTube search failed.',
            })
          )
        }
      })

      server.middlewares.use('/api/live', async (req: any, res: any) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.setHeader('Cache-Control', 'no-store, max-age=0')

        if (req.method === 'GET') {
          res.statusCode = 200
          res.end(JSON.stringify(getLiveStatus()))
          return
        }
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'method_not_allowed' }))
          return
        }

        try {
          const session = await createLiveToken()
          res.statusCode = 200
          res.end(JSON.stringify(session))
        } catch (error: any) {
          res.statusCode = error.status || 500
          res.end(
            JSON.stringify({
              error: error.code || 'live_error',
              message: error.message || 'The live voice session could not start.',
            })
          )
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = env.GEMINI_API_KEY
  if (env.GEMINI_MODEL) process.env.GEMINI_MODEL = env.GEMINI_MODEL
  if (env.GEMINI_LIVE_MODEL) process.env.GEMINI_LIVE_MODEL = env.GEMINI_LIVE_MODEL
  if (env.GEMINI_LIVE_VOICE) process.env.GEMINI_LIVE_VOICE = env.GEMINI_LIVE_VOICE
  if (env.YOUTUBE_API_KEY) process.env.YOUTUBE_API_KEY = env.YOUTUBE_API_KEY

  return {
    base: './',
    plugins: [react(), tailwindcss(), agentApi()],
    server: {
      port: 3000,
      host: true,
    },
    build: {
      target: 'es2020',
      cssCodeSplit: false,
    },
  }
})
