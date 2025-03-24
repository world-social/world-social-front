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

  useEffect(() => {
    // Check if user has already collected today's bonus
    const checkDailyBonus = async () => {
      try {
        const response = await apiRequest<DailyBonusStatus>('/tokens/daily-bonus/status')
        if (response.status === 'success' && response.data?.hasCollected) {
          setHasCollected(true)
        }
      } catch (error) {
        console.error('Error checking daily bonus status:', error)
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
    }
  }

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