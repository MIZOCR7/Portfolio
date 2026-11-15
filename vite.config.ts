import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { askGemini, getAgentStatus } from './server/agent.js'

/* Local stand-in for the Vercel function so `npm run dev` can exercise the AI
   terminal without deploying. The key stays in .env and never enters the bundle. */
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
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = env.GEMINI_API_KEY
  if (env.GEMINI_MODEL) process.env.GEMINI_MODEL = env.GEMINI_MODEL

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
