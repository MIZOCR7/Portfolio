const ENDPOINT = '/api/live'
const LIVE_MODEL = 'gemini-3.8-live'

export async function checkLive() {
  try {
    const res = await fetch(ENDPOINT, { headers: { Accept: 'application/json' } })
    if (!res.ok) return { configured: false, model: LIVE_MODEL, voice: null }
    const data = await res.json()
    return {
      configured: Boolean(data.configured),
      model: data.model || LIVE_MODEL,
      voice: data.voice || null,
    }
  } catch {
    return { configured: false, model: LIVE_MODEL, voice: null }
  }
}

function liveError(code, message) {
  const error = new Error(message)
  error.code = code
  return error
}

function base64FromBytes(bytes) {
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}

function bytesFromBase64(value) {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

/* Browser audio is float32 at whatever rate the device chose. The Live API
   wants 16-bit PCM at 16 kHz; output comes back as 24 kHz PCM. */
function downsampleToPcm16(input, inputRate) {
  const ratio = inputRate / 16000
  const length = Math.floor(input.length / ratio)
  if (length < 1) return new Int16Array(0)
  const out = new Int16Array(length)
  for (let i = 0; i < length; i += 1) {
    const at = i * ratio
    const i0 = Math.floor(at)
    const i1 = Math.min(i0 + 1, input.length - 1)
    const frac = at - i0
    const sample = input[i0] * (1 - frac) + input[i1] * frac
    const clamped = Math.max(-1, Math.min(1, sample))
    out[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff
  }
  return out
}

function pcm16ToFloat(input) {
  const out = new Float32Array(input.length)
  for (let i = 0; i < input.length; i += 1) out[i] = input[i] / 0x8000
  return out
}

function rms(analyser, buffer) {
  analyser.getByteTimeDomainData(buffer)
  let sum = 0
  for (let i = 0; i < buffer.length; i += 1) {
    const v = (buffer[i] - 128) / 128
    sum += v * v
  }
  return Math.min(1, Math.sqrt(sum / buffer.length) * 4.2)
}

export class LiveSession {
  constructor({ onEvent = () => {}, onLevel = () => {} } = {}) {
    this.onEvent = onEvent
    this.onLevel = onLevel
    this.ws = null
    this.stream = null
    this.ctx = null
    this.micSource = null
    this.micAnalyser = null
    this.processor = null
    this.silentGain = null
    this.outGain = null
    this.outAnalyser = null
    this.micBuffer = null
    this.outBuffer = null
    this.sources = new Set()
    this.nextStart = 0
    this.ready = false
    this.stopping = false
    this.raf = 0
    this.lastMeter = 0
    this.micLevel = 0
    this.outLevel = 0
    this.model = LIVE_MODEL
  }

  async start() {
    if (!window.isSecureContext) {
      throw liveError('insecure', 'The microphone needs HTTPS or localhost.')
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      throw liveError('mic_unavailable', 'This browser cannot access a microphone.')
    }
    if (!window.WebSocket) throw liveError('live_unavailable', 'This browser cannot open a live audio connection.')

    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) throw liveError('audio_unavailable', 'This browser cannot play live audio.')

    // Create and unlock the audio context while the click that started the
    // call is still the current gesture.
    this.ctx = new AudioCtx()
    this.ctx.resume().catch(() => {})

    // Ask for the microphone first. A permission prompt can take a while, and
    // the ephemeral token only has a short window in which to start a session.
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      })
    } catch (error) {
      this.teardown()
      if (error?.name === 'NotAllowedError' || error?.name === 'SecurityError') {
        throw liveError('mic_denied', 'Microphone access was blocked. Allow the microphone and try again.')
      }
      if (error?.name === 'NotFoundError') {
        throw liveError('mic_missing', 'No microphone was found. Plug one in and try again.')
      }
      throw liveError('mic_error', 'The microphone could not be opened. Try again.')
    }

    try {
      this.setupAudio()
    } catch {
      this.teardown()
      throw liveError('audio_error', 'The live audio engine could not start. Try again.')
    }

    let token
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        throw liveError(data?.error || 'live_token_error', data?.message || 'The live session could not start.')
      }
      if (!data?.token) throw liveError('live_token_missing', 'The live session returned no token.')
      token = data.token
      this.model = data.model || LIVE_MODEL
      this.voice = data.voice || null
    } catch (error) {
      this.teardown()
      if (error.code) throw error
      throw liveError('live_token_error', 'The live session could not start. Try again in a moment.')
    }

    try {
      this.openSocket(token)
    } catch (error) {
      this.teardown()
      throw error
    }
  }

  setupAudio() {
    const ctx = this.ctx
    this.micSource = ctx.createMediaStreamSource(this.stream)
    this.micAnalyser = ctx.createAnalyser()
    this.micAnalyser.fftSize = 1024
    this.micAnalyser.smoothingTimeConstant = 0.72
    this.micBuffer = new Uint8Array(this.micAnalyser.fftSize)
    this.micSource.connect(this.micAnalyser)

    this.processor = ctx.createScriptProcessor(4096, 1, 1)
    this.silentGain = ctx.createGain()
    this.silentGain.gain.value = 0
    this.micSource.connect(this.processor)
    this.processor.connect(this.silentGain)
    this.silentGain.connect(ctx.destination)
    this.processor.onaudioprocess = event => {
      if (!this.ready || !this.ws || this.ws.readyState !== WebSocket.OPEN) return
      if (this.ws.bufferedAmount > 512 * 1024) return
      const pcm = downsampleToPcm16(event.inputBuffer.getChannelData(0), ctx.sampleRate)
      if (!pcm.length) return
      const data = base64FromBytes(new Uint8Array(pcm.buffer))
      this.ws.send(
        JSON.stringify({
          realtimeInput: {
            audio: { mimeType: 'audio/pcm;rate=16000', data },
          },
        })
      )
    }

    this.outGain = ctx.createGain()
    this.outGain.gain.value = 1
    this.outAnalyser = ctx.createAnalyser()
    this.outAnalyser.fftSize = 1024
    this.outAnalyser.smoothingTimeConstant = 0.72
    this.outBuffer = new Uint8Array(this.outAnalyser.fftSize)
    this.outGain.connect(this.outAnalyser)
    this.outAnalyser.connect(ctx.destination)

    this.startMeter()
  }

  openSocket(token) {
    const url =
      'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.' +
      'GenerativeService.BidiGenerateContentConstrained?access_token=' +
      encodeURIComponent(token)
    const ws = new WebSocket(url)
    ws.binaryType = 'arraybuffer'
    this.ws = ws

    ws.onopen = () => {
      ws.send(JSON.stringify({ setup: { model: `models/${this.model}` } }))
    }

    ws.onmessage = async event => {
      let raw = event.data
      if (typeof raw !== 'string') {
        raw = raw instanceof ArrayBuffer ? new TextDecoder().decode(raw) : await raw.text()
      }
      let message
      try {
        message = JSON.parse(raw)
      } catch {
        return
      }
      if (message.setupComplete) {
        this.ready = true
        this.ctx?.resume().catch(() => {})
        this.onEvent({ type: 'ready', model: this.model, voice: this.voice || null })
        return
      }
      if (message.goAway) {
        this.onEvent({ type: 'ending' })
        return
      }
      if (message.serverContent) this.handleContent(message.serverContent)
    }

    ws.onerror = () => {
      /* onclose carries the usable information; do not double-report. */
    }

    ws.onclose = event => {
      this.ready = false
      if (this.stopping) return
      this.onEvent({
        type: 'closed',
        code: event.code,
        reason: event.reason || '',
      })
      this.teardown()
    }
  }

  handleContent(content) {
    if (content.interrupted) {
      this.stopPlayback()
      this.onEvent({ type: 'interrupted' })
    }

    if (content.inputTranscription?.text) {
      this.onEvent({ type: 'user', text: content.inputTranscription.text })
    }
    if (content.outputTranscription?.text) {
      this.onEvent({ type: 'assistant', text: content.outputTranscription.text })
    }

    const parts = content.modelTurn?.parts || []
    for (const part of parts) {
      if (part.inlineData?.data && String(part.inlineData.mimeType || '').startsWith('audio/')) {
        this.enqueueAudio(part.inlineData.data)
      }
    }

    if (content.turnComplete) {
      this.onEvent({ type: 'turn-complete' })
    }
  }

  enqueueAudio(base64) {
    if (!this.ctx || !this.outGain) return
    const bytes = bytesFromBase64(base64)
    const even = bytes.byteLength - (bytes.byteLength % 2)
    const pcm = new Int16Array(bytes.buffer, bytes.byteOffset, even / 2)
    const samples = pcm16ToFloat(pcm)
    if (!samples.length) return

    const buffer = this.ctx.createBuffer(1, samples.length, 24000)
    buffer.copyToChannel(samples, 0)
    const source = this.ctx.createBufferSource()
    source.buffer = buffer
    source.connect(this.outGain)
    const start = Math.max(this.ctx.currentTime + 0.04, this.nextStart)
    source.start(start)
    this.nextStart = start + buffer.duration
    this.sources.add(source)
    source.onended = () => this.sources.delete(source)
    this.onEvent({ type: 'speaking' })
  }

  stopPlayback() {
    for (const source of this.sources) {
      try {
        source.stop()
      } catch {
        /* already stopped */
      }
    }
    this.sources.clear()
    this.nextStart = 0
  }

  sendText(text) {
    const clean = typeof text === 'string' ? text.trim() : ''
    if (!clean) return false
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.ready) {
      throw liveError('live_not_ready', 'The live voice session is still connecting. Try again in a second.')
    }
    this.ws.send(JSON.stringify({ realtimeInput: { text: clean.slice(0, 2000) } }))
    return true
  }

  startMeter() {
    const tick = time => {
      this.raf = requestAnimationFrame(tick)
      if (time - this.lastMeter < 45) return
      this.lastMeter = time
      if (!this.micAnalyser || !this.outAnalyser) return
      const mic = rms(this.micAnalyser, this.micBuffer)
      const out = rms(this.outAnalyser, this.outBuffer)
      this.micLevel += (mic - this.micLevel) * 0.35
      this.outLevel += (out - this.outLevel) * 0.28
      this.onLevel({ mic: this.micLevel, output: this.outLevel })
    }
    this.raf = requestAnimationFrame(tick)
  }

  teardown() {
    this.stopping = true
    this.ready = false
    if (this.raf) cancelAnimationFrame(this.raf)
    this.raf = 0
    if (this.processor) {
      this.processor.onaudioprocess = null
      try {
        this.processor.disconnect()
      } catch {
        /* already gone */
      }
    }
    this.stream?.getTracks().forEach(track => track.stop())
    this.stream = null
    this.stopPlayback()
    if (this.ws) {
      try {
        this.ws.close()
      } catch {
        /* already closed */
      }
    }
    this.ws = null
    if (this.ctx) {
      this.ctx.close().catch(() => {})
      this.ctx = null
    }
    this.onLevel({ mic: 0, output: 0 })
  }

  stop() {
    this.teardown()
  }
}

export function createLiveSession(handlers) {
  return new LiveSession(handlers)
}
