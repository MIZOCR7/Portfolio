export declare class YouTubeError extends Error {
  status: number
  code: string
  constructor(message: string, status?: number, code?: string)
}

export declare interface YouTubeVideo {
  id: string
  title: string
  author: string
  duration: string
  thumbnail: string
  views: string
  published: string
  source: 'youtube'
}

export declare function getYouTubeStatus(): { configured: boolean; source: string }
export declare function searchYouTube(value: string, limit?: number | string | null): Promise<YouTubeVideo[]>
