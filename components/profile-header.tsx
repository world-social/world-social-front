"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Profile } from "@/hooks/use-profile"
import { DailyTokens } from "@/components/daily-bonus-countdown"
import { Coins } from "lucide-react"

interface ProfileHeaderProps {
  profile: Profile | null
  onWithdrawTokens: (amount: number) => Promise<void>
  onTokensCollected?: (amount: number) => void
}

export function ProfileHeader({ profile, onWithdrawTokens, onTokensCollected }: ProfileHeaderProps) {
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("")

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
      const amount = parseFloat(withdrawAmount)
      if (isNaN(amount) || amount <= 0 || amount > (profile.tokenBalance || 0)) {
        throw new Error("Please enter a valid amount within the available balance")
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
          <div className="text-2xl font-bold">
            {typeof profile.tokenBalance === 'number' 
              ? profile.tokenBalance.toLocaleString(undefined, { 
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2 
                })
              : '0'
            }
          </div>
          <div className="text-sm text-muted-foreground">Tokens</div>
        </div>
        
        <div className="flex flex-col gap-2 w-full">
          <DailyTokens onClaim={onTokensCollected} />
          {profile.isInfluencer && (
            <Dialog open={isWithdrawing} onOpenChange={setIsWithdrawing}>
              <DialogTrigger asChild>
                <Button disabled={!profile.tokenBalance || profile.tokenBalance <= 0}>
                  Withdraw Tokens
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Withdraw Tokens</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount (Available: {profile.tokenBalance?.toLocaleString()})</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = parseFloat(value);
                        if (!isNaN(numValue) && numValue >= 0 && numValue <= (profile.tokenBalance || 0)) {
                          setWithdrawAmount(value);
                        }
                      }}
                      min={0}
                      max={profile.tokenBalance}
                      step={0.01}
                      placeholder="Enter amount to withdraw"
                    />
                  </div>
                  <Button 
                    onClick={handleWithdraw}
                    disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > (profile.tokenBalance || 0)}
                  >
                    Withdraw
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  )
}

