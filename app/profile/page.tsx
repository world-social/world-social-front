"use client"

import { useState } from "react"
import { ProfileHeader } from "@/components/profile-header"
import { UploadVideoDialog } from "@/components/upload-video-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProfile } from "@/hooks/use-profile"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilePage() {
  const { profile, loading, error, refreshProfile, withdrawTokens } = useProfile()
  const [activeTab, setActiveTab] = useState("videos")

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-card rounded-lg">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="flex gap-4">
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <Skeleton className="h-8 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-destructive/15 text-destructive p-4 rounded-lg">
          <p>Error: {error}</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-muted p-4 rounded-lg">
          <p>Profile not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader 
        profile={profile} 
        onWithdrawTokens={withdrawTokens}
      />
      
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="likes">Likes</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>
          </Tabs>
          <UploadVideoDialog onUploadComplete={refreshProfile} />
        </div>

        <TabsContent value="videos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.videos?.map((video) => (
              <div key={video.id} className="bg-card rounded-lg overflow-hidden">
                <video
                  src={video.url}
                  className="w-full aspect-video object-cover"
                  controls
                />
                <div className="p-4">
                  <h3 className="font-semibold">{video.title}</h3>
                  <p className="text-sm text-muted-foreground">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="likes">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.likes?.map((like) => (
              <div key={like.id} className="bg-card rounded-lg overflow-hidden">
                <video
                  src={like.video.url}
                  className="w-full aspect-video object-cover"
                  controls
                />
                <div className="p-4">
                  <h3 className="font-semibold">{like.video.title}</h3>
                  <p className="text-sm text-muted-foreground">{like.video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.savedVideos?.map((saved) => (
              <div key={saved.id} className="bg-card rounded-lg overflow-hidden">
                <video
                  src={saved.video.url}
                  className="w-full aspect-video object-cover"
                  controls
                />
                <div className="p-4">
                  <h3 className="font-semibold">{saved.video.title}</h3>
                  <p className="text-sm text-muted-foreground">{saved.video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </div>
    </div>
  )
} 