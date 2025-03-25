"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Coins, Upload, Gift } from "lucide-react"
import { FeedVideo } from "@/components/feed-video"
import { TokenCounter } from "@/components/token-counter"
import { ProfileHeader } from "@/components/profile-header"
import { MissionsPanel } from "@/components/missions-panel"
import { LeaderboardPanel } from "@/components/leaderboard-panel"
import { AchievementsPanel } from "@/components/achievements-panel"
import { DailyBonusButton } from "@/components/daily-bonus-button"
import { UploadVideoDialog } from "@/components/upload-video-dialog"
import { fetchVideos } from "@/lib/video-service"
import { updateMissionProgress, updateAchievementProgress } from "@/lib/mission-service"
import { mockLogin, isAuthenticated } from "@/lib/auth-service"
import { useProfile } from "@/hooks/use-profile"
import type { Video } from "@/types/video"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [tokens, setTokens] = useState(0)
  const [activeTab, setActiveTab] = useState("feed")
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined)
  const [showMissions, setShowMissions] = useState(false)
  const [isAuthValidated, setAuthValidated] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement | null>(null)
  const { profile, refreshProfile, withdrawTokens } = useProfile()
  const router = useRouter()

  // Handle authentication
  const handleAuth = async () => {
    if (!isAuthenticated()) {
      try {
        // await mockLogin()
        // setAuthValidated(true)
        router.push('/signup')
      } catch (error) {
        console.error('Failed to login:', error)
      }
    } else {
      setAuthValidated(true)
      // fetchUserProfile()
      // .then((data) => {
      //   setProfile(data);
      // })
      // .catch((err) => {
      //   console.error('Error fetching profile:', err);
      //   router.push('/register');
      // })
      // .finally(() => setLoading(false));
    }
  }

  useEffect(() => {
    handleAuth()
  }, [router])
  
  // Function to add tokens based on watch time
  const addTokensForWatchTime = useCallback(async (seconds: number) => {
    // 0.1 tokens per 3 seconds of watch time
    const tokensToAdd = (seconds / 3) * 0.1
    setTokens((prev) => prev + tokensToAdd)

    // Update mission progress for watching videos
    try {
      await updateMissionProgress("mission-1", 0.1) // Increment watch progress
      await updateAchievementProgress("achievement-1", 0.1) // Increment achievement progress
      await updateAchievementProgress("achievement-2", 0.1) // Increment achievement progress
    } catch (error) {
      console.error("Error updating mission progress:", error)
    }
  }, [])

  // Function to handle mission rewards
  const handleMissionReward = useCallback((reward: number) => {
    setTokens((prev) => prev + reward)
    // Update achievement for collecting tokens
    updateAchievementProgress("achievement-4", reward)
  }, [])

  // Initial load of videos
  useEffect(() => {
    const loadInitialVideos = async () => {
      if (!isAuthValidated) return
      
      setLoading(true)
      try {
        const feed = await fetchVideos()
        setVideos(feed.videos)
        setHasMore(feed.hasMore)
        setNextCursor(feed.nextCursor)
      } catch (error) {
        console.error("Error loading videos:", error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialVideos()
  }, [isAuthValidated])

  // Load more videos when user scrolls to the bottom
  const loadMoreVideos = useCallback(async () => {
    if (loading || !hasMore || !isAuthValidated) return

    setLoading(true)

    try {
      const feed = await fetchVideos(nextCursor)
      setVideos((prev) => [...prev, ...feed.videos])
      setHasMore(feed.hasMore)
      setNextCursor(feed.nextCursor)
    } catch (error) {
      console.error("Error loading more videos:", error)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, nextCursor, isAuthValidated])

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !loading && hasMore && isAuthValidated) {
          loadMoreVideos()
        }
      },
      { threshold: 0.1 },
    )

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loadMoreVideos, loading, hasMore, isAuthValidated])

  const refreshFeed = useCallback(async () => {
    setNextCursor(undefined)
    setHasMore(true)
    setVideos([])
    await loadMoreVideos()
  }, [loadMoreVideos])

  if (!isAuthValidated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to WorldSocial</h1>
          <p className="text-muted-foreground mb-4">Please wait while we log you in...</p>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">WorldSocial</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setShowMissions(!showMissions)} className="relative">
              <Gift className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </Button>
            <TokenCounter value={tokens} />
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Missions Panel (Slide Down) */}
      {showMissions && (
        <div className="p-4 border-b mt-[65px]">
          <MissionsPanel onClaimReward={handleMissionReward} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 pt-[65px]">
        <Tabs defaultValue="feed" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 sticky top-[65px] z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="ranking">Ranking</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="h-[calc(100vh-8rem)]">
            <div className="px-4">
              {videos.length === 0 && !loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">No videos found</p>
                  <Button onClick={() => loadMoreVideos()}>Refresh Feed</Button>
                </div>
              ) : (
                videos.map((video, index) => (
                  <FeedVideo key={video.id} video={video} onWatchTime={addTokensForWatchTime} index={index} />
                ))
              )}

              {/* Loading indicator */}
              {hasMore && (
                <div ref={loadingRef} className="py-4 flex justify-center items-center">
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-3 h-3 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-3 h-3 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Scroll for more videos</span>
                  )}
                </div>
              )}

              {/* End of content message */}
              {!hasMore && videos.length > 0 && (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">You've reached the end of the feed!</p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => {
                      setNextCursor(undefined)
                      setHasMore(true)
                      setVideos([])
                      loadMoreVideos()
                    }}
                  >
                    Refresh Feed
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="discover">
            <div className="p-4">
              <h3 className="text-lg font-medium mb-4">Tags em Alta</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {["trending", "viral", "dance", "music", "nature", "fitness", "food", "travel", "gaming"].map((tag) => (
                  <Badge key={tag} variant="secondary" className="py-1.5 px-3">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <h3 className="text-lg font-medium mb-4">Criadores Populares</h3>
              <div className="grid grid-cols-3 gap-4">
                {["creator1", "nature_lover", "dance_master", "fitness_guru", "food_lover", "travel_bug"].map(
                  (creator) => (
                    <div key={creator} className="flex flex-col items-center">
                      <Avatar className="h-16 w-16 mb-2">
                        <AvatarImage src={`/placeholder.svg?height=64&width=64&text=${creator[0]}`} alt={creator} />
                        <AvatarFallback>{creator[0]}</AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium">@{creator}</p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ranking">
            <div className="p-4 space-y-6">
              <LeaderboardPanel />

              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-2">Sua posição atual: 6º lugar</p>
                <p className="text-sm">Assista mais vídeos e complete missões para subir no ranking!</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            {profile ? (
              <>
                <ProfileHeader 
                  profile={profile} 
                  onWithdrawTokens={withdrawTokens}
                />
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Your Videos</h3>
                    <UploadVideoDialog 
                      onUploadComplete={refreshProfile} 
                      onFeedRefresh={refreshFeed}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {profile.videos?.map((video) => (
                      <div key={video.id} className="aspect-square bg-muted rounded-md overflow-hidden relative">
                        <video
                          src={video.url}
                          className="w-full h-full object-cover"
                          controls
                        />
                        <div className="absolute bottom-1 right-1 bg-background/80 rounded-full p-1 text-xs">
                          {Math.floor(video.duration / 60)}:
                          {Math.floor(video.duration % 60)
                            .toString()
                            .padStart(2, "0")}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-6">
                    <AchievementsPanel onClaimReward={handleMissionReward} />

                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4">Token History</h3>
                      <Card className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Rewards from watching videos</span>
                            <span className="text-sm font-medium">+{(tokens * 0.7).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Engagement bonus</span>
                            <span className="text-sm font-medium">+{(tokens * 0.1).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Completed missions</span>
                            <span className="text-sm font-medium">+{(tokens * 0.15).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Daily bonus</span>
                            <span className="text-sm font-medium">+{(tokens * 0.05).toFixed(2)}</span>
                          </div>
                          <div className="h-px bg-border my-2"></div>
                          <div className="flex justify-between items-center font-medium">
                            <span>Total</span>
                            <span>{tokens.toFixed(2)}</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p>Profile not found</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Daily Bonus Button */}
      <DailyBonusButton onCollect={(amount) => setTokens(prev => prev + amount)} />
    </div>
  )
}

