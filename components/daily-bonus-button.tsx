"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Coins } from "lucide-react"
import { apiRequest } from "@/lib/api"
import { toast } from "sonner"
import { useWST } from "@/hooks/use-WST"

interface ClaimStatus {
  canClaim: boolean
  nextClaimTime: number | null
  signature: string
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

interface ApiResponseWrapper<T> {
  status: 'success' | 'error'
  data: {
    data: T
  }
  error?: string
}

interface ClaimButtonProps {
  className?: string
  onClaim?: (amount: number) => void
}

export function ClaimButton({ className, onClaim }: ClaimButtonProps) {
  const { sendTransaction, isConfirming, isConfirmed } = useWST();

  const [status, setStatus] = useState<ClaimStatus>({ canClaim: false, nextClaimTime: null, signature: "" })
  const [timeLeft, setTimeLeft] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // Function to format time remaining
  const formatTimeLeft = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

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

      // Reset retry count on successful request
      setRetryCount(0)
    } catch (error) {
      console.error('Error checking claim status:', error)
      
      // Increment retry count
      setRetryCount(prev => prev + 1)
      
      // If we've tried less than 3 times, try again in 5 seconds
      if (retryCount < 3) {
        setTimeout(checkClaimStatus, 5000)
      } else {
        toast.error('Unable to check claim status. Please try again later.')
      }
    }
  }

  // Update countdown timer
  useEffect(() => {
    const updateTimer = () => {
      if (status.nextClaimTime) {
        const now = Date.now()
        const diff = status.nextClaimTime - now

        if (diff <= 0) {
          setTimeLeft("")
          checkClaimStatus() // Refresh status when timer reaches 0
        } else {
          setTimeLeft(formatTimeLeft(diff))
        }
      }
    }

    // Initial check
    updateTimer()

    // Update every second
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [status.nextClaimTime])

  // Initial status check
  useEffect(() => {
    checkClaimStatus()
  }, [])

  const handleClaim = async () => {
    if (!status.canClaim || loading) return

    setLoading(true)
    try {
      
      //call contract here

      const response = await apiRequest<ApiResponse<ClaimResponse>>('/tokens/daily-bonus', {
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
        nextClaimTime: response.data.nextClaimTime,
        signature: response.data.signature
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

  // Show countdown if we can't claim and have a timer
  if (!status.canClaim && status.nextClaimTime) {
    return (
      <div className={`text-center ${className}`}>
        <p className="text-sm text-muted-foreground mb-2">Next claim available in</p>
        <p className="text-lg font-medium">{timeLeft}</p>
      </div>
    )
  }

  return (
    <Button
      onClick={handleClaim}
      disabled={!status.canClaim || loading}
      className={`${className} bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70`}
    >
      <Coins className="h-4 w-4 mr-2" />
      {loading ? "Claiming..." : "Claim Daily Tokens"}
    </Button>
  )
} 