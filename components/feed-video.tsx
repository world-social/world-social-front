"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, Coins, Play, Pause, Volume2, VolumeX } from "lucide-react"
import type { Video } from "@/types/video"
import { formatNumber } from "@/lib/utils"
import { rewardWatchTime, rewardEngagement } from '@/lib/token-service'

interface FeedVideoProps {
  video: Video
  onWatchTime: (seconds: number) => void
  index: number
}

export function FeedVideo({ video, onWatchTime, index }: FeedVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [watchTime, setWatchTime] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastRewardTime = useRef<number>(0)

  // Set up intersection observer to detect when video is visible
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        setIsVisible(entry.isIntersecting)

        // Auto-play/pause based on visibility
        if (videoRef.current) {
          if (entry.isIntersecting) {
            // Autoplay when visible
            videoRef.current.play().catch(() => {
              // Autoplay was prevented, show play button
              setIsPlaying(false)
            })
          } else {
            videoRef.current.pause()
            setIsPlaying(false)
          }
        }
      },
      { threshold: 0.7 }, // Video is considered visible when 70% is in viewport
    )

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current)
    }

    return () => {
      if (observerRef.current && containerRef.current) {
        observerRef.current.unobserve(containerRef.current)
      }
    }
  }, [isLoaded]) // Remove index dependency since we want all videos to autoplay

  // Track actual watch time when video is playing and visible
  useEffect(() => {
    let watchTimer: NodeJS.Timeout

    if (isPlaying && isVisible && isLoaded) {
      watchTimer = setInterval(() => {
        setWatchTime((prev) => {
          const newTime = prev + 1

          // Reward tokens every 3 seconds of actual watch time
          const shouldReward = newTime - lastRewardTime.current >= 3
          if (shouldReward) {
            // Call the token service to reward watch time
            rewardWatchTime(video.id, 3).then((reward) => {
              if (reward > 0) {
                onWatchTime(reward)
              }
            }).catch(console.error)
            lastRewardTime.current = newTime
          }

          return newTime
        })
      }, 1000)
    }

    return () => {
      if (watchTimer) clearInterval(watchTimer)
    }
  }, [isPlaying, isVisible, isLoaded, onWatchTime, video.id])

  // Handle video events
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => {
      if (isLoaded) {
        setIsPlaying(true)
      }
    }
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      setIsPlaying(false)
      // Loop the video
      if (video) {
        video.currentTime = 0
        video.play().catch((err) => console.log("Autoplay prevented:", err))
      }
    }
    const handleLoadedData = () => {
      setIsLoaded(true)
    }

    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("ended", handleEnded)
    video.addEventListener("loadeddata", handleLoadedData)

    return () => {
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("ended", handleEnded)
      video.removeEventListener("loadeddata", handleLoadedData)
    }
  }, [isLoaded])

  // Handle autoplay when video is loaded and visible
  useEffect(() => {
    const video = videoRef.current
    if (!video || !isLoaded) return

    if (isVisible) {
      video.play().catch(() => {
        // Autoplay was prevented
        setIsPlaying(false)
      })
    }
  }, [isVisible, isLoaded])

  const togglePlay = () => {
    if (videoRef.current && isLoaded) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch(() => {
          // Autoplay was prevented
          console.log("Play prevented by browser")
        })
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current && isLoaded) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleLike = async () => {
    if (isLoaded) {
      setIsLiked(!isLiked)
      if (!isLiked) {
        try {
          const reward = await rewardEngagement(video.id, 'LIKE')
          if (reward > 0) {
            onWatchTime(reward)
          }
        } catch (error) {
          console.error('Error rewarding like:', error)
        }
      }
    }
  }

  return (
    <Card className="overflow-hidden mb-4" ref={containerRef}>
      <CardContent className="p-0 relative">
        <div className="aspect-[9/16] bg-muted flex items-center justify-center cursor-pointer" onClick={togglePlay}>
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
          )}

          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster={video.thumbnailUrl}
            muted={isMuted}
            playsInline
            preload="metadata"
            autoPlay
          >
            <source src={video.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {!isPlaying && isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-background/80 p-4">
                <Play className="h-8 w-8" />
              </div>
            </div>
          )}

          <div className="absolute bottom-4 left-4 flex gap-2">
            {isPlaying && (
              <div className="bg-background/80 rounded-full p-2">
                <Pause className="h-6 w-6" />
              </div>
            )}

            <button
              className="bg-background/80 rounded-full p-2"
              onClick={(e) => {
                e.stopPropagation()
                toggleMute()
              }}
            >
              {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
            </button>
          </div>

          <div className="absolute bottom-4 right-4 bg-background/80 rounded-full px-3 py-1.5 text-xs flex items-center">
            <Coins className="h-3 w-3 mr-1" />
            <span>+0.1 per 3s watched</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4">
        <div className="flex items-center w-full">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={video.userAvatar} alt={video.username} />
            <AvatarFallback>{video.username[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">@{video.username}</p>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className={isLiked ? "text-red-500" : ""}
              onClick={(e) => {
                e.stopPropagation()
                toggleLike()
              }}
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
              <span className="sr-only">Like</span>
            </Button>
            <span className="text-xs text-muted-foreground">{formatNumber(video.likes)}</span>

            <Button variant="ghost" size="icon">
              <MessageCircle className="h-5 w-5" />
              <span className="sr-only">Comment</span>
            </Button>
            <span className="text-xs text-muted-foreground">{formatNumber(video.comments)}</span>

            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
              <span className="sr-only">Share</span>
            </Button>
            <span className="text-xs text-muted-foreground">{formatNumber(video.shares)}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{video.description}</p>
        {video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {video.tags.map((tag) => (
              <span key={tag} className="text-xs text-primary">
                #{tag}
              </span>
            ))}
          </div>
        )}
        {watchTime > 0 && <div className="mt-2 text-xs text-muted-foreground">Watched for {watchTime} seconds</div>}
      </CardFooter>
    </Card>
  )
}

