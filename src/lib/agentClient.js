const ENDPOINT = '/api/chat'

export async function checkAgent() {
  try {
    const res = await fetch(ENDPOINT, { headers: { Accept: 'application/json' } })
    if (!res.ok) return { configured: false, model: null }
    const data = await res.json()
    return { configured: Boolean(data.configured), model: data.model || null }
  } catch {
    return { configured: false, model: null }
  }
}

export async function askAgent(message, history = []) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      history: history.slice(-8).map(h => ({ role: h.role, text: h.text })),
    }),
  })

  let data = null
  try {
    data = await res.json()
  } catch {
    /* non-JSON error */
  }

  if (!res.ok) {
    const error = new Error(data?.message || data?.error || `The agent returned ${res.status}.`)
    error.code = data?.error || 'agent_error'
    throw error
  }
  if (!data?.answer) throw new Error('The agent returned an empty answer.')
  return data.answer
}
