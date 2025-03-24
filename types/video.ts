export interface Video {
  id: string
  title: string
  description: string
  url: string
  videoUrl: string
  thumbnailUrl: string
  userId: string
  username: string
  userAvatar: string | undefined
  likes: number
  views: number
  duration: number
  tags: string[]
  comments: number
  shares: number
  createdAt: string
  updatedAt: string
}

export interface VideoFeed {
  videos: Video[]
  hasMore: boolean
  nextCursor?: string
}

