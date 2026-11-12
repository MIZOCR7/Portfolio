import { useCallback, useEffect, useRef, useState } from 'react'

export type LiveStatus = 'idle' | 'connecting' | 'ready' | 'error'

const MODEL = (import.meta.env.VITE_GEMINI_LIVE_MODEL as string) || 'gemini-3.8-live'

const SYSTEM = `You are Ada, the voice guide on Ziad Emad Ahmed's portfolio site.
You speak in the first person as Ziad's assistant, not as an AI model. Be warm, brief and specific.

Facts you know about Ziad:
- 17, Grade 12 at STEM High School for Boys, 6th of October City, Egypt. Admitted at 15 with 98% on the entrance exam, ranked 245 of about 40,000 candidates.
- Finalist at the Egypt Science & Engineering Fair 2026 (ISEF-affiliated) with a pest-detection system for Egyptian farms, using deep learning and drones.
- Built "Pipe Inspector", his grade 12 capstone: a six-wheeled rover that drives inside water pipes, streams video, and runs YOLO11 instance segmentation to mark corrosion and cracks. 14 V / 3 A pack, about 40 minutes of run time.
- 31st place in the ICPC Egyptian Teens online qualification, August 2026.
- Head of the IT department of the STEM Model Arab League, and AI modelling director of the October Geology Club, where he built a retrieval-augmented system over geological references.
- Volunteer STEM mentor with Resala in Sadat City; software engineer in the global Hack Club network; NASA Space Apps Challenge "Galactic Problem Solver" 2025.
- Speaks Arabic natively and English fluently. Toolkit: Python, PyTorch, YOLO11, OpenCV, C++, Arduino, React, TypeScript.

His goal: to study Computer Engineering at METU in Ankara on a Türkiye Bursları scholarship. He has never been to Ankara; the campus photographs on this site are placeholders for a place he is trying to earn.

When someone asks about a project, give one concrete detail instead of a general claim. Keep answers under four sentences unless asked to go deeper. If you do not know something, say so and point to the contact section. Reply in English unless the visitor speaks Turkish or Arabic.`

type Options = { onLevel?: (level: number) => void }

export function useLive({ onLevel }: Options = {}) {
  const [status, setStatus] = useState<LiveStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [lines, setLines] = useState<string[]>([])

  const wsRef = useRef<WebSocket | null>(null)
  const micCtxRef = useRef<AudioContext | null>(null)
  const playCtxRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const procRef = useRef<ScriptProcessorNode | null>(null)
  const nextAtRef = useRef(0)
  const onLevelRef = useRef(onLevel)

  useEffect(() => {
    onLevelRef.current = onLevel
  }, [onLevel])

  const teardown = useCallback(() => {
    try {
      wsRef.current?.close()
    } catch {
      /* ignore */
    }
    wsRef.current = null
    procRef.current?.disconnect()
    procRef.current = null
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    micCtxRef.current?.close().catch(() => undefined)
    micCtxRef.current = null
    playCtxRef.current?.close().catch(() => undefined)
    playCtxRef.current = null
    nextAtRef.current = 0
    setStatus('idle')
  }, [])

  useEffect(() => teardown, [teardown])

  const playPcm = useCallback((base64: string) => {
    const ctx = playCtxRef.current
    if (!ctx) return
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    const samples = Math.floor(bytes.length / 2)
    if (samples === 0) return

    const view = new DataView(bytes.buffer)
    const buffer = ctx.createBuffer(1, samples, 24000)
    const channel = buffer.getChannelData(0)
    let sum = 0
    for (let i = 0; i < samples; i++) {
      const v = view.getInt16(i * 2, true) / 32768
      channel[i] = v
      sum += v * v
    }
    onLevelRef.current?.(Math.min(1, Math.sqrt(sum / samples) * 5))

    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.connect(ctx.destination)
    const startAt = Math.max(ctx.currentTime + 0.03, nextAtRef.current)
    source.start(startAt)
    nextAtRef.current = startAt + buffer.duration
    source.onended = () => onLevelRef.current?.(0)
  }, [])

  const start = useCallback(async () => {
    if (status === 'connecting' || status === 'ready') return
    setError(null)
    setLines([])
    setStatus('connecting')

    try {
      const res = await fetch('/api/token', { method: 'POST' })
      const data = (await res.json()) as { token?: string; error?: string }
      if (!res.ok || !data.token) {
        throw new Error(
          data.error === 'missing_key'
            ? 'No Gemini key on the server. Add GEMINI_API_KEY to .env (or to Vercel) and reload.'
            : `Could not start a session (${data.error ?? res.status}).`
        )
      }

      const ws = new WebSocket(
        `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(data.token)}`
      )
      wsRef.current = ws

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            setup: {
              model: `models/${MODEL}`,
              generationConfig: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                  voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Aoede' } },
                },
              },
              systemInstruction: { parts: [{ text: SYSTEM }] },
            },
          })
        )
      }

      ws.onmessage = async event => {
        const raw =
          typeof event.data === 'string'
            ? event.data
            : event.data instanceof Blob
              ? await event.data.text()
              : ''
        if (!raw) return

        let msg: {
          setupComplete?: unknown
          serverContent?: {
            modelTurn?: { parts?: Array<{ text?: string; inlineData?: { data?: string } }> }
            outputTranscription?: { text?: string }
            turnComplete?: boolean
          }
        }
        try {
          msg = JSON.parse(raw)
        } catch {
          return
        }

        if (msg.setupComplete) setStatus('ready')

        const parts = msg.serverContent?.modelTurn?.parts ?? []
        for (const part of parts) {
          if (part.inlineData?.data) playPcm(part.inlineData.data)
          if (part.text) setLines(prev => [...prev.slice(-2), part.text as string])
        }
        if (msg.serverContent?.turnComplete) onLevelRef.current?.(0)
      }

      ws.onerror = () => {
        setError('The live connection dropped. Check the model name and that the key has Live API access.')
        setStatus('error')
      }

      ws.onclose = event => {
        if (event.code !== 1000 && event.code !== 1005) {
          setError(prev => prev ?? `Session closed (${event.code}${event.reason ? `: ${event.reason}` : ''}).`)
          setStatus('error')
        } else {
          setStatus('idle')
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      })
      streamRef.current = stream

      const micCtx = new AudioContext({ sampleRate: 16000 })
      micCtxRef.current = micCtx
      playCtxRef.current = new AudioContext()

      const source = micCtx.createMediaStreamSource(stream)
      const processor = micCtx.createScriptProcessor(2048, 1, 1)
      procRef.current = processor

      const silent = micCtx.createGain()
      silent.gain.value = 0

      processor.onaudioprocess = e => {
        const socket = wsRef.current
        if (!socket || socket.readyState !== WebSocket.OPEN) return
        const input = e.inputBuffer.getChannelData(0)
        const pcm = new Int16Array(input.length)
        for (let i = 0; i < input.length; i++) {
          const s = Math.max(-1, Math.min(1, input[i]))
          pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff
        }
        const bytes = new Uint8Array(pcm.buffer)
        let binary = ''
        for (let i = 0; i < bytes.length; i += 0x8000) {
          binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
        }
        socket.send(
          JSON.stringify({
            realtimeInput: {
              audio: { mimeType: 'audio/pcm;rate=16000', data: btoa(binary) },
            },
          })
        )
      }

      source.connect(processor)
      processor.connect(silent)
      silent.connect(micCtx.destination)
    } catch (err) {
      teardown()
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Could not start the session.')
    }
  }, [playPcm, status, teardown])

  return { status, error, lines, start, stop: teardown }
}
