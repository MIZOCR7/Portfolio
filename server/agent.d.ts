export declare const DEFAULT_MODEL: string
export declare const MODEL: string
export declare class AgentError extends Error {
  status: number
  code: string
  constructor(message: string, status?: number, code?: string)
}
export declare function getAgentStatus(): { configured: boolean; model: string }
export declare function askGemini(args: {
  message?: string
  history?: Array<{ role: 'user' | 'model'; text: string }>
}): Promise<string>
