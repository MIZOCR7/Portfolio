import { AgentError, systemPrompt } from './agent.js'

/* Gemini Live is a stateful WebSocket API, so the browser connects to Google
   directly. The real key stays here: this endpoint mints a one-use ephemeral
   token that is already locked to the model, voice, audio-only output and the
   full Ziad profile. */
export const DEFAULT_LIVE_MODEL = 'gemini-3.8-live'
export const DEFAULT_LIVE_VOICE = 'Charon'
export const LIVE_MODEL = process.env.GEMINI_LIVE_MODEL || DEFAULT_LIVE_MODEL
export const LIVE_VOICE = process.env.GEMINI_LIVE_VOICE || DEFAULT_LIVE_VOICE

const SESSION_MS = 30 * 60 * 1000
const START_WINDOW_MS = 60 * 1000

function liveSetup() {
  return {
    model: `models/${LIVE_MODEL}`,
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: LIVE_VOICE },
        },
      },
    },
    systemInstruction: {
      parts: [{ text: systemPrompt('live') }],
    },
    inputAudioTranscription: {},
    outputAudioTranscription: {},
  }
}

export function getLiveStatus() {
  return {
    configured: Boolean(process.env.GEMINI_API_KEY),
    model: LIVE_MODEL,
    voice: LIVE_VOICE,
  }
}

export async function createLiveToken() {
  const key = process.env.GEMINI_API_KEY
  if (!key) {
    throw new AgentError(
      'Gemini Live is not configured on this deployment. Add GEMINI_API_KEY in Vercel and redeploy.',
      503,
      'missing_key'
    )
  }

  const now = Date.now()
  const expiresAt = new Date(now + SESSION_MS).toISOString()
  const body = {
    uses: 1,
    expireTime: expiresAt,
    newSessionExpireTime: new Date(now + START_WINDOW_MS).toISOString(),
    bidiGenerateContentSetup: liveSetup(),
  }

  let res
  try {
    res = await fetch('https://generativelanguage.googleapis.com/v1beta/auth_tokens', {
      method: 'POST',
      headers: {
        'x-goog-api-key': key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    })
  } catch {
    throw new AgentError(
      'The live voice service could not be reached. Try again in a moment.',
      502,
      'live_unreachable'
    )
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    console.error('Gemini Live token error', res.status, detail.slice(0, 300))
    if (res.status === 429) {
      throw new AgentError('The live voice service is busy right now. Try again shortly.', 429, 'rate_limited')
    }
    throw new AgentError(
      'Gemini Live could not start a session. Try again in a moment.',
      502,
      'live_token_error'
    )
  }

  const data = await res.json().catch(() => null)
  if (!data?.name) {
    throw new AgentError('Gemini Live returned no session token. Try again.', 502, 'live_token_missing')
  }

  return {
    token: data.name,
    model: LIVE_MODEL,
    voice: LIVE_VOICE,
    expiresAt,
  }
}
