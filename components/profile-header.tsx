"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Profile } from "@/hooks/use-profile"

interface ProfileHeaderProps {
  profile: Profile | null
  onWithdrawTokens: (amount: number) => Promise<void>
}

export function ProfileHeader({ profile, onWithdrawTokens }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [editFormData, setEditFormData] = useState({
    username: "",
    avatar: ""
  })

  // Initialize edit form data when profile changes
  useEffect(() => {
    if (profile) {
      setEditFormData({
        username: profile.username,
        avatar: profile.avatar || ""
      })
    }
  }, [profile])

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveChanges = async () => {
    try {
      // TODO: Implement save changes API call
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving profile changes:", error)
    }
  }

  if (!profile) {
    return (
      <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-card rounded-lg">
        <div className="h-24 w-24 rounded-full bg-muted animate-pulse" />
        <div className="flex-1 space-y-4">
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="h-6 w-20 bg-muted rounded animate-pulse" />
            <div className="h-6 w-20 bg-muted rounded animate-pulse" />
            <div className="h-6 w-20 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="h-8 w-24 bg-muted rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  const handleWithdraw = async () => {
    try {
      const amount = parseInt(withdrawAmount)
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount")
      }
      await onWithdrawTokens(amount)
      setIsWithdrawing(false)
      setWithdrawAmount("")
    } catch (error) {
      console.error("Error withdrawing tokens:", error)
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-card rounded-lg">
      <Avatar className="h-24 w-24">
        <AvatarImage src={profile.avatar || undefined} alt={profile.username} />
        <AvatarFallback>{profile.username[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-2xl font-bold">{profile.username}</h1>
        <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
          <div>
            <span className="font-semibold">{profile.followers}</span>
            <span className="text-muted-foreground ml-1">Followers</span>
          </div>
          <div>
            <span className="font-semibold">{profile.following}</span>
            <span className="text-muted-foreground ml-1">Following</span>
          </div>
          <div>
            <span className="font-semibold">{profile.videos?.length || 0}</span>
            <span className="text-muted-foreground ml-1">Posts</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center md:items-end gap-2">
        <div className="text-center">
          <div className="text-2xl font-bold">{profile.tokenBalance}</div>
          <div className="text-sm text-muted-foreground">Tokens</div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
          {profile.isInfluencer && (
            <Dialog open={isWithdrawing} onOpenChange={setIsWithdrawing}>
              <DialogTrigger asChild>
                <Button>Withdraw Tokens</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Withdraw Tokens</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Enter amount to withdraw"
                    />
                  </div>
                  <Button onClick={handleWithdraw}>Withdraw</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={editFormData.username}
                onChange={handleEditChange}
                readOnly
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                name="avatar"
                value={editFormData.avatar}
                onChange={handleEditChange}
                placeholder="Enter avatar URL"
              />
            </div>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

