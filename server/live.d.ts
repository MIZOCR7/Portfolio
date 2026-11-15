export declare const DEFAULT_LIVE_MODEL: string
export declare const DEFAULT_LIVE_VOICE: string
export declare const LIVE_MODEL: string
export declare const LIVE_VOICE: string
export declare function getLiveStatus(): { configured: boolean; model: string; voice: string }
export declare function createLiveToken(): Promise<{
  token: string
  model: string
  voice: string
  expiresAt: string
}>
