"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins } from "lucide-react"
import { apiRequest } from "@/lib/api"
import { toast } from "sonner"

interface ClaimStatus {
  canClaim: boolean
  nextClaimTime: number | null
}

interface ClaimResponse {
  transaction: {
    id: string
    amount: number
  }
  nextClaimTime: number
}

interface ApiResponse<T> {
  status: 'success' | 'error'
  data: T
  error?: string
}

interface DailyClaimProps {
  onClaim?: (amount: number) => void
}

export function DailyClaim({ onClaim }: DailyClaimProps) {
  const [status, setStatus] = useState<ClaimStatus>({
    canClaim: false,
    nextClaimTime: null
  })
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState<string>("")

  // Check claim status
  const checkClaimStatus = async () => {
    try {
      const response = await apiRequest<ApiResponse<ClaimStatus>>('/tokens/daily/status')
      
      if (response.status === 'error') {
        throw new Error(response.error || 'Failed to check claim status')
      }
      
      if (!response.data) {
        throw new Error('Invalid response format')
      }
      
      setStatus(response.data)
      updateTimeLeft(response.data.nextClaimTime)
    } catch (error) {
      console.error('Error checking claim status:', error)
      toast.error('Unable to check claim status. Please try again later.')
    }
  }

  // Update time left
  const updateTimeLeft = (nextClaimTime: number | null) => {
    if (!nextClaimTime) {
      setTimeLeft("")
      checkClaimStatus()
      return
    }

    const now = Date.now()
    const diff = nextClaimTime - now

    if (diff <= 0) {
      setTimeLeft("")
      checkClaimStatus()
      return
    }

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
  }

  // Handle claim
  const handleClaim = async () => {
    if (!status.canClaim || loading) return

    setLoading(true)
    try {
      const response = await apiRequest<ApiResponse<ClaimResponse>>('/tokens/daily', {
        method: 'POST'
      })

      if (response.status === 'error') {
        throw new Error(response.error || 'Failed to claim tokens')
      }

      if (!response.data) {
        throw new Error('Invalid response format')
      }

      const amount = response.data.transaction.amount
      toast.success(`Successfully claimed ${amount} tokens!`)
      
      // Update status with new next claim time
      setStatus({
        canClaim: false,
        nextClaimTime: response.data.nextClaimTime
      })

      // Notify parent component
      onClaim?.(amount)
    } catch (error) {
      console.error('Error claiming tokens:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to claim tokens')
    } finally {
      setLoading(false)
    }
  }

  // Initialize and update countdown
  useEffect(() => {
    checkClaimStatus()
    const interval = setInterval(() => {
      updateTimeLeft(status.nextClaimTime)
    }, 1000)

    return () => clearInterval(interval)
  }, [status.nextClaimTime])

  return (
    <Card className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-primary/10 to-primary/5">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 rounded-full bg-primary/10">
          <Coins className="h-8 w-8 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Daily Tokens</h3>
          <p className="text-sm text-muted-foreground">
            Claim your daily tokens to earn more
          </p>
        </div>

        {status.canClaim ? (
          <Button 
            size="lg" 
            className="w-full bg-primary hover:bg-primary/90"
            onClick={handleClaim}
            disabled={loading}
          >
            {loading ? (
              "Claiming..."
            ) : (
              <>
                <Coins className="mr-2 h-5 w-5" />
                Claim Tokens
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