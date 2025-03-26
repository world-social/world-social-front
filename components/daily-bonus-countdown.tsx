"use client"

import { useEffect, useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins } from "lucide-react"
import { apiRequest } from "@/lib/api"
import { toast } from "sonner"
import { useDebounce } from "@/hooks/use-debounce"

interface User {
  id: string;
  username: string;
  avatar: string;
  tokenBalance: string;
  streak: number;
  lastStreakDate: string | null;
  totalWatchTime: number;
}

interface Stats {
  videos: number;
  likes: number;
  comments: number;
  completedAchievements: number;
  completedMissions: number;
}

interface ApiResponseData {
  user: User;
  stats: Stats;
}

interface DailyTokenStatusResponse {
  status: 'success' | 'error';
  data: {
    canClaim: boolean;
    nextClaimTime: number | null;
  };
  error?: string;
}

interface DailyTokensProps {
  onClaim?: (amount: number) => void
  tokenBalance?: number
}

export function DailyTokens({ onClaim, tokenBalance = 0 }: DailyTokensProps) {
  const [canClaim, setCanClaim] = useState(false)
  const [timeLeft, setTimeLeft] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nextClaimTime, setNextClaimTime] = useState<string | null>(null)

  const checkClaimStatus = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiRequest<DailyTokenStatusResponse>("/tokens/daily/status", {
        method: "GET",
      })

      console.log('Daily bonus status response:', response)

      if (!response?.data) {
        console.error('Response data structure:', response)
        throw new Error('Invalid response format - missing data')
      }

      const claimStatus = response.data as { canClaim: boolean; nextClaimTime: number | null }
      console.log('Claim status:', claimStatus)

      setCanClaim(claimStatus.canClaim)
      if (claimStatus.nextClaimTime) {
        setNextClaimTime(new Date(claimStatus.nextClaimTime).toISOString())
      } else {
        setNextClaimTime(null)
      }

      setIsLoading(false)
    } catch (err) {
      console.error("Error checking claim status:", err)
      setError("Failed to check claim status")
      setCanClaim(false)
      setTimeLeft("")
      setIsLoading(false)
    }
  }, [])

  // Initial check when component mounts
  useEffect(() => {
    checkClaimStatus()
  }, [checkClaimStatus])

  // Remove the debounced check since we don't need to check every 5 seconds
  // const debouncedCheckClaim = useDebounce(checkClaimStatus, 5000)

  useEffect(() => {
    console.log('Countdown effect running with:', { canClaim, nextClaimTime, timeLeft })
    
    const updateCountdown = () => {
      if (!canClaim && nextClaimTime) {
        const nextClaim = new Date(nextClaimTime)
        const now = new Date()
        const diff = nextClaim.getTime() - now.getTime()
        
        console.log('Calculating time difference:', { nextClaim, now, diff })
        
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)
          const newTimeLeft = `${hours}h ${minutes}m ${seconds}s`
          console.log('Setting new time left:', newTimeLeft)
          setTimeLeft(newTimeLeft)
        } else {
          console.log('Time difference is <= 0, enabling claim')
          setCanClaim(true)
          setTimeLeft("")
        }
      }
    }

    // Update immediately and then every second
    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [canClaim, nextClaimTime])

  const handleClaim = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiRequest<ApiResponse>("/tokens/daily", {
        method: "POST",
      })

      if (response.status === 'error') {
        throw new Error(response.error || 'Failed to claim daily bonus')
      }

      setCanClaim(false)
      // Wait a bit before checking status again
      setTimeout(checkClaimStatus, 2000)
    } catch (err) {
      console.error("Error claiming daily bonus:", err)
      setError("Failed to claim daily bonus")
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <div className="text-sm text-destructive">
        {error}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Checking status...
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-primary/10 to-primary/5">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 rounded-full bg-primary/10">
          <Coins className="h-8 w-8 text-primary" />
        </div>
        
        <div className="space-y-2">
          <div className="text-2xl font-bold text-primary">{(tokenBalance || 0).toFixed(2)}</div>
          <p className="text-sm text-muted-foreground">Total Tokens</p>
        </div>

        {canClaim ? (
          <Button 
            size="lg" 
            className="w-full bg-primary hover:bg-primary/90"
            onClick={handleClaim}
            disabled={isLoading}
          >
            {isLoading ? (
              "Claiming..."
            ) : (
              <>
                <Coins className="mr-2 h-5 w-5" />
                Claim Daily Bonus
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-2">
            <div className="text-2xl font-mono font-bold text-primary">
              {timeLeft}
            </div>
            <p className="text-sm text-muted-foreground">
              Next claim available in
            </p>
          </div>
        )}
      </div>
    </Card>
  )
} 