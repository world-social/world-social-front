"use client"

import { useState, useEffect } from "react"
import { Coins } from "lucide-react"
import { cn } from "@/lib/utils"
import { useProfile } from "@/hooks/use-profile"

interface TokenCounterProps {
  value?: number
}

export function TokenCounter({ value: propValue }: TokenCounterProps) {
  const { profile } = useProfile()
  const [isAnimating, setIsAnimating] = useState(false)
  const [prevValue, setPrevValue] = useState(0)
  const [displayValue, setDisplayValue] = useState(0)

  // Use profile's token balance if no value is provided
  const value = propValue ?? profile?.tokenBalance ?? 0

  useEffect(() => {
    // Update the display value when profile changes
    if (profile?.tokenBalance !== undefined) {
      if (profile.tokenBalance > prevValue) {
        setIsAnimating(true)

        // Animate the counter increasing
        const diff = profile.tokenBalance - prevValue
        const steps = 10
        const increment = diff / steps
        let current = prevValue
        let step = 0

        const interval = setInterval(() => {
          step++
          current += increment
          setDisplayValue(current)

          if (step >= steps) {
            clearInterval(interval)
            setDisplayValue(profile.tokenBalance)
            setTimeout(() => {
              setIsAnimating(false)
            }, 300)
          }
        }, 50)

        return () => clearInterval(interval)
      }

      setPrevValue(profile.tokenBalance)
      setDisplayValue(profile.tokenBalance)
    }
  }, [profile?.tokenBalance, prevValue])

  return (
    <div className="flex items-center bg-primary/10 rounded-full px-3 py-1">
      <Coins
        className={cn(
          "h-4 w-4 mr-1 transition-all duration-300",
          isAnimating ? "text-primary scale-110" : "text-primary",
        )}
      />
      <span className={cn("font-medium transition-all duration-300", isAnimating && "text-primary scale-110")}>
        {displayValue.toFixed(2)}
      </span>
    </div>
  )
}

