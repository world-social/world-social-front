import type { Video, VideoFeed } from "@/types/video"

// Sample videos for development
const sampleVideos: Video[] = [
  {
    id: "video-1",
    videoUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-young-mother-with-her-little-daughter-decorating-a-christmas-tree-39745-large.mp4",
    thumbnailUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-young-mother-with-her-little-daughter-decorating-a-christmas-tree-39745-large.mp4",
    username: "holiday_vibes",
    userAvatar: "/placeholder.svg?height=40&width=40&text=HV",
    description: "Getting ready for the holidays! #christmas #family #decorations",
    likes: 1245,
    comments: 43,
    shares: 12,
    tags: ["christmas", "family", "decorations"],
    duration: 15,
  },
  {
    id: "video-2",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-32809-large.mp4",
    thumbnailUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-32809-large.mp4",
    username: "dance_master",
    userAvatar: "/placeholder.svg?height=40&width=40&text=DM",
    description: "Friday night vibes 🕺 #dance #music #weekend",
    likes: 2341,
    comments: 121,
    shares: 45,
    tags: ["dance", "music", "weekend"],
    duration: 12,
  },
  {
    id: "video-3",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4",
    thumbnailUrl: "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4",
    username: "nature_lover",
    userAvatar: "/placeholder.svg?height=40&width=40&text=NL",
    description: "Spring is finally here! 🌼 #nature #spring #flowers",
    likes: 876,
    comments: 32,
    shares: 5,
    tags: ["nature", "spring", "flowers"],
    duration: 8,
  },
  {
    id: "video-4",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
    thumbnailUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
    username: "ocean_explorer",
    userAvatar: "/placeholder.svg?height=40&width=40&text=OE",
    description: "The calming sound of waves 🌊 #ocean #waves #relax",
    likes: 1543,
    comments: 76,
    shares: 23,
    tags: ["ocean", "waves", "relax"],
    duration: 10,
  },
  {
    id: "video-5",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-running-through-forest-32807-large.mp4",
    thumbnailUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-running-through-forest-32807-large.mp4",
    username: "fitness_guru",
    userAvatar: "/placeholder.svg?height=40&width=40&text=FG",
    description: "Morning run in the forest 🏃‍♀️ #fitness #running #nature",
    likes: 932,
    comments: 45,
    shares: 12,
    tags: ["fitness", "running", "nature"],
    duration: 14,
  },
]

// Simulate fetching videos from an API
export async function fetchVideos(cursor?: string, limit = 5): Promise<VideoFeed> {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const startIndex = cursor ? Number.parseInt(cursor) : 0
      const endIndex = startIndex + limit

      // Generate more videos if needed
      while (sampleVideos.length < endIndex + 5) {
        const index = sampleVideos.length
        sampleVideos.push({
          id: `video-${index + 1}`,
          videoUrl: sampleVideos[index % 5].videoUrl, // Reuse videos for demo
          thumbnailUrl: sampleVideos[index % 5].thumbnailUrl,
          username: `user_${index + 1}`,
          userAvatar: `/placeholder.svg?height=40&width=40&text=${index + 1}`,
          description: `This is video #${index + 1} with some cool content! #trending #viral`,
          likes: Math.floor(Math.random() * 2000),
          comments: Math.floor(Math.random() * 200),
          shares: Math.floor(Math.random() * 50),
          tags: ["trending", "viral", `tag${index}`],
          duration: Math.floor(Math.random() * 20) + 5,
        })
      }

      const videos = sampleVideos.slice(startIndex, endIndex)
      const hasMore = endIndex < sampleVideos.length
      const nextCursor = hasMore ? endIndex.toString() : undefined

      resolve({
        videos,
        hasMore,
        nextCursor,
      })
    }, 800)
  })
}

// For production, you would implement functions to:
// 1. Upload videos to a storage service
// 2. Process videos (compression, thumbnails, etc.)
// 3. Store video metadata in a database

export async function uploadVideo(file: File): Promise<{ videoId: string }> {
  // This would be implemented with your chosen storage solution
  console.log("Uploading video:", file.name)

  // Simulate upload
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ videoId: `video-${Date.now()}` })
    }, 2000)
  })
}

