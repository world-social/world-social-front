"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Coins, Upload, Gift } from "lucide-react";
import { FeedVideo } from "@/components/feed-video";
import { TokenCounter } from "@/components/token-counter";
import { ProfileHeader } from "@/components/profile-header";
import { MissionsPanel } from "@/components/missions-panel";
import { LeaderboardPanel } from "@/components/leaderboard-panel";
import { AchievementsPanel } from "@/components/achievements-panel";
import { ClaimButton } from "@/components/daily-bonus-button";
import { UploadVideoDialog } from "@/components/upload-video-dialog";
import { fetchVideos } from "@/lib/video-service";
import { updateMissionProgress, updateAchievementProgress } from "@/lib/mission-service";
import { mockLogin, isAuthenticated } from "@/lib/auth-service";
import { useProfile } from "@/hooks/use-profile";
import type { Video } from "@/types/video";
import { Login } from "@/components/auth/login";
import { SignUpForm } from "@/components/auth/signup-form";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("feed");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [showMissions, setShowMissions] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const { profile, refreshProfile, withdrawTokens } = useProfile();

  // Handle authentication
  useEffect(() => {
    const handleAuth = async () => {
      if (!isAuthenticated()) {
        try {
          await mockLogin();
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Failed to login:", error);
        }
      } else {
        setIsLoggedIn(true);
      }
    };

    handleAuth();
  }, []);

  // Function to add tokens based on watch time
  const addTokensForWatchTime = useCallback(
    async (seconds: number) => {
      try {
        const currentBalance = profile?.tokenBalance || 0;
        const reward = (seconds / 5) * 0.1;
        await updateMissionProgress("mission-1", reward);
        await updateAchievementProgress("achievement-1", reward);
        await updateAchievementProgress("achievement-2", reward);
        await refreshProfile();
      } catch (error) {
        console.error("Error updating mission progress:", error);
      }
    },
    [refreshProfile, profile?.tokenBalance]
  );

  // Function to handle mission rewards
  const handleMissionReward = useCallback(
    async (reward: number) => {
      try {
        await updateAchievementProgress("achievement-4", reward);
        await refreshProfile();
      } catch (error) {
        console.error("Error handling mission reward:", error);
      }
    },
    [refreshProfile]
  );

  // Initial load of videos
  useEffect(() => {
    const loadInitialVideos = async () => {
      if (!isLoggedIn) return;
      setLoading(true);
      try {
        const feed = await fetchVideos();
        setVideos(feed.videos);
        setHasMore(feed.hasMore);
        setNextCursor(feed.nextCursor);
      } catch (error) {
        console.error("Error loading videos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialVideos();
  }, [isLoggedIn]);

  // Load more videos when user scrolls to the bottom
  const loadMoreVideos = useCallback(async () => {
    if (loading || !hasMore || !isLoggedIn) return;
    setLoading(true);
    try {
      const feed = await fetchVideos(nextCursor);
      setVideos((prev) => [...prev, ...feed.videos]);
      setHasMore(feed.hasMore);
      setNextCursor(feed.nextCursor);
    } catch (error) {
      console.error("Error loading more videos:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, nextCursor, isLoggedIn]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading && hasMore && isLoggedIn) {
          loadMoreVideos();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreVideos, loading, hasMore, isLoggedIn]);

  const refreshFeed = useCallback(async () => {
    setNextCursor(undefined);
    setHasMore(true);
    setVideos([]);
    await loadMoreVideos();
  }, [loadMoreVideos]);

  return (
    <>
      {/* {!isLoggedIn ? (
        // Show Login if not logged in
        <div className="flex items-center justify-center min-h-screen">
          <Login 
            // onLogged={() => {
            // setIsLoggedIn(true);}} 
            />
        </div>
      ) : !isVerified ? (
        // If logged in but not verified, show the s
        <div className="flex items-center justify-center min-h-screen">
          <VerifyBlock onVerified={() => setIsVerified(true)} />
        </div>
      ) : !isRegistered ? (
        // If verified but not registered, show the SignUpForm
        <div className="flex items-center justify-center min-h-screen">
          <SignUpForm onRegistered={() => setIsRegistered(true)} />
        </div>
      ) : ( */}

        <div className="flex flex-col min-h-screen bg-background">
          {/* Header */}
          <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center justify-between h-12 px-4">
              <h1 className="text-xl font-bold">WorldSocial</h1>s
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMissions(!showMissions)}
                  className="relative"
                >
                  <Gift className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    3
                  </span>
                </Button>
                <TokenCounter />
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          {/* Missions Panel (Slide Down) */}
          {showMissions && (
            <div className="p-4 border-b mt-[88px]">
              <MissionsPanel />
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 pt-[88px]">
            <Tabs defaultValue="feed" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-4 h-10 fixed top-[48px] left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <TabsTrigger value="feed">Feed</TabsTrigger>
                <TabsTrigger value="discover">Discover</TabsTrigger>
                <TabsTrigger value="ranking">Ranking</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>

              <div className="mt-[48px]">
                <TabsContent value="feed" className="h-[calc(100vh-136px)]">
                  <div className="px-4">
                    {videos.length === 0 && !loading ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-muted-foreground mb-4">No videos found</p>
                        <Button onClick={() => loadMoreVideos()}>Refresh Feed</Button>
                      </div>
                    ) : (
                      <>
                        {videos.map((video, index) => (
                          <div key={video.id} className="relative w-full h-[calc(100vh-136px)] snap-start snap-always">
                            <FeedVideo video={video} onWatchTime={addTokensForWatchTime} index={index} />
                          </div>
                        ))}
                      </>
                    )}

                    {hasMore && (
                      <div ref={loadingRef} className="py-4 flex justify-center items-center">
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></div>
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }}></div>
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }}></div>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Scroll for more videos</span>
                        )}
                      </div>
                    )}

                    {!hasMore && videos.length > 0 && (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground">You've reached the end of the feed!</p>
                        <Button
                          variant="outline"
                          className="mt-2"
                          onClick={() => {
                            setNextCursor(undefined);
                            setHasMore(true);
                            setVideos([]);
                            loadMoreVideos();
                          }}
                        >
                          Refresh Feed
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="profile">
                  {profile ? (
                    <>
                      <ProfileHeader profile={profile} onWithdrawTokens={withdrawTokens} />
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium">Your Videos</h3>
                          <UploadVideoDialog
                            onUploadComplete={async () => {
                              await refreshProfile();
                              await refreshFeed();
                              window.location.reload();
                            }}
                            onFeedRefresh={refreshFeed}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {profile.videos?.map((video) => (
                            <div key={video.id} className="aspect-square bg-muted rounded-md overflow-hidden relative">
                              <video src={video.url} className="w-full h-full object-cover" controls />
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
                          <div className="mt-6">
                            <h3 className="text-lg font-medium mb-4">Token History</h3>
                            <Card className="p-4">
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Rewards from watching videos</span>
                                  <span className="text-sm font-medium">
                                    +{(Number(profile?.tokenBalance || 0) * 0.7).toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Engagement bonus</span>
                                  <span className="text-sm font-medium">
                                    +{(Number(profile?.tokenBalance || 0) * 0.1).toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Completed missions</span>
                                  <span className="text-sm font-medium">
                                    +{(Number(profile?.tokenBalance || 0) * 0.15).toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Daily bonus</span>
                                  <span className="text-sm font-medium">
                                    +{(Number(profile?.tokenBalance || 0) * 0.05).toFixed(2)}
                                  </span>
                                </div>
                                <div className="h-px bg-border my-2"></div>
                                <div className="flex justify-between items-center font-medium">
                                  <span>Total</span>
                                  <span>{Number(profile?.tokenBalance || 0).toFixed(2)}</span>
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
              </div>
            </Tabs>
          </main>

          {/* Footer Navigation */}
          <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <TabsList className="w-full grid grid-cols-3 h-[56px]">
              <TabsTrigger value="feed" className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
              </TabsTrigger>
              <div className="flex items-center justify-center">
                <UploadVideoDialog
                  onUploadComplete={async () => {
                    await refreshProfile();
                    await refreshFeed();
                    window.location.reload();
                  }}
                  onFeedRefresh={refreshFeed}
                >
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </Button>
                </UploadVideoDialog>
              </div>
              <TabsTrigger value="profile" className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="5" />
                  <path d="M20 21a8 8 0 1 0-16 0" />
                </svg>
              </TabsTrigger>
            </TabsList>
          </footer>
        </div>
      {/* )} */}
    </>
  );
}
