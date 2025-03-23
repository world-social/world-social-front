export interface Video {
  id: string
  videoUrl: string
  thumbnailUrl: string
  username: string
  userAvatar: string
  description: string
  likes: number
  comments: number
  shares: number
  tags: string[]
  duration: number
}

export interface VideoFeed {
  videos: Video[]
  hasMore: boolean
  nextCursor?: string
}

