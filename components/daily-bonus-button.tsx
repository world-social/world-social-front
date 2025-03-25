import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Coins } from "lucide-react"
import { apiRequest } from "@/lib/api"

interface DailyBonusStatus {
  hasCollected: boolean
}

interface DailyBonusResponse {
  amount: number
}

interface DailyBonusButtonProps {
  onCollect: (amount: number) => void
}

export function DailyBonusButton({ onCollect }: DailyBonusButtonProps) {
  const [hasCollected, setHasCollected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user has already collected today's bonus
    const checkDailyBonus = async () => {
      try {
        const response = await apiRequest<DailyBonusStatus>('/tokens/daily-bonus/status')
        if (response.status === 'success') {
          setHasCollected(response.data?.hasCollected || false)
        }
      } catch (error) {
        console.error('Error checking daily bonus status:', error)
        // If we get an error checking the status, we'll show the button
        setHasCollected(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkDailyBonus()
  }, [])

  const handleCollect = async () => {
    try {
      const response = await apiRequest<DailyBonusResponse>('/tokens/daily-bonus', {
        method: 'POST'
      })
      
      if (response.status === 'success' && response.data?.amount) {
        onCollect(response.data.amount)
        setHasCollected(true)
      }
    } catch (error) {
      console.error('Error collecting daily bonus:', error)
      // If we get an error about already collecting, we'll hide the button
      if (error instanceof Error && error.message.includes("Already collected")) {
        setHasCollected(true)
      }
    }
  }

  // Don't show anything while loading
  if (isLoading) return null
  
  // Don't show the button if already collected
  if (hasCollected) return null

  return (
    <Button
      className="fixed bottom-4 right-4 z-50 shadow-lg"
      onClick={handleCollect}
    >
      <Coins className="h-4 w-4 mr-2" />
      Collect Daily Bonus
    </Button>
  )
} 