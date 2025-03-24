import type { Video, VideoFeed } from "@/types/video"
import { apiRequest, uploadFile } from "./api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

interface BackendVideo {
  id: string
  videoUrl: string
  thumbnailUrl: string
  userId: string
  description: string
  duration: number
  createdAt: string
  user: {
    id: string
    username: string
    avatar: string
  }
}

function transformBackendVideo(video: BackendVideo): Video {
  // Use the URLs directly from the backend as they are already absolute
  const videoUrl = video.videoUrl;
  const thumbnailUrl = video.thumbnailUrl;

  return {
    id: video.id,
    title: video.description.split('\n')[0], // Use first line of description as title
    description: video.description,
    url: videoUrl,
    videoUrl,
    thumbnailUrl,
    userId: video.userId,
    username: video.user.username,
    userAvatar: video.user.avatar || undefined,
    likes: 0,
    views: 0,
    comments: 0,
    shares: 0,
    tags: [],
    duration: video.duration,
    createdAt: video.createdAt,
    updatedAt: video.createdAt // Use createdAt as updatedAt since it's not provided
  }
}

// Sample videos for development
const sampleVideos: Video[] = [
  {
    id: "video-1",
    title: "Christmas Tree Decorating",
    description: "Getting ready for the holidays! #christmas #family #decorations",
    url: "https://assets.mixkit.co/videos/preview/mixkit-young-mother-with-her-little-daughter-decorating-a-christmas-tree-39745-large.mp4",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-mother-with-her-little-daughter-decorating-a-christmas-tree-39745-large.mp4",
    thumbnailUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-mother-with-her-little-daughter-decorating-a-christmas-tree-39745-large.mp4",
    userId: "user-1",
    username: "holiday_vibes",
    userAvatar: "/placeholder.svg?height=40&width=40&text=HV",
    likes: 1245,
    views: 5000,
    comments: 43,
    shares: 12,
    tags: ["christmas", "family", "decorations"],
    duration: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "video-2",
    title: "Dancing Under Lights",
    description: "Friday night vibes 🕺 #dance #music #weekend",
    url: "https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-32809-large.mp4",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-32809-large.mp4",
    thumbnailUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-32809-large.mp4",
    userId: "user-2",
    username: "dance_master",
    userAvatar: "/placeholder.svg?height=40&width=40&text=DM",
    likes: 2341,
    views: 8000,
    comments: 121,
    shares: 45,
    tags: ["dance", "music", "weekend"],
    duration: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "video-3",
    title: "Spring Flowers",
    description: "Spring is finally here! 🌼 #nature #spring #flowers",
    url: "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4",
    thumbnailUrl: "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4",
    userId: "user-3",
    username: "nature_lover",
    userAvatar: "/placeholder.svg?height=40&width=40&text=NL",
    likes: 876,
    views: 3000,
    comments: 32,
    shares: 5,
    tags: ["nature", "spring", "flowers"],
    duration: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "video-4",
    title: "Ocean Waves",
    description: "The calming sound of waves 🌊 #ocean #waves #relax",
    url: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
    thumbnailUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
    userId: "user-4",
    username: "ocean_explorer",
    userAvatar: "/placeholder.svg?height=40&width=40&text=OE",
    likes: 1543,
    views: 6000,
    comments: 76,
    shares: 23,
    tags: ["ocean", "waves", "relax"],
    duration: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "video-5",
    title: "Forest Run",
    description: "Morning run in the forest 🏃‍♀️ #fitness #running #nature",
    url: "https://assets.mixkit.co/videos/preview/mixkit-woman-running-through-forest-32807-large.mp4",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-running-through-forest-32807-large.mp4",
    thumbnailUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-running-through-forest-32807-large.mp4",
    userId: "user-5",
    username: "fitness_guru",
    userAvatar: "/placeholder.svg?height=40&width=40&text=FG",
    likes: 932,
    views: 4000,
    comments: 45,
    shares: 12,
    tags: ["fitness", "running", "nature"],
    duration: 14,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
]

// Simulate fetching videos from an API
export async function fetchVideos(cursor?: string, limit = 5): Promise<VideoFeed> {
  try {
    const response = await apiRequest<{ videos: BackendVideo[]; nextCursor?: string }>(
      `/content/feed?limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`
    );

    if (response.status === 'error') {
      // If we get a rate limit error, use sample videos
      if (response.error?.includes('Rate limit exceeded')) {
        console.warn('Using sample videos due to rate limiting');
        return {
          videos: sampleVideos.slice(0, limit),
          hasMore: false,
          nextCursor: undefined,
        };
      }
      throw new Error(response.error || 'Failed to fetch videos');
    }

    const videos = response.data?.videos.map(transformBackendVideo) || [];
    const nextCursor = response.data?.nextCursor;

    return {
      videos,
      hasMore: !!nextCursor,
      nextCursor,
    };
  } catch (error) {
    console.error('Error fetching videos:', error);
    // Use sample videos as fallback
    return {
      videos: sampleVideos.slice(0, limit),
      hasMore: false,
      nextCursor: undefined,
    };
  }
}

// For production, you would implement functions to:
// 1. Upload videos to a storage service
// 2. Process videos (compression, thumbnails, etc.)
// 3. Store video metadata in a database

export async function uploadVideo(
  file: File,
  title: string,
  description: string
): Promise<{ videoId: string }> {
  if (!(file instanceof File)) {
    throw new Error('Invalid file type. Expected a File object.');
  }

  const response = await uploadFile(
    file,
    '/content/upload',
    {
      title,
      description,
    }
  );

  if (response.status === 'error') {
    throw new Error(response.error || 'Failed to upload video');
  }

  return {
    videoId: response.data?.video.id || '',
  };
}

export async function getVideoStream(videoId: string): Promise<string> {
  return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/content/${videoId}/stream`;
}

