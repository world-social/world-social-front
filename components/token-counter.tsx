"use client"

import { useState, useEffect } from "react"
import { Coins } from "lucide-react"
import { cn } from "@/lib/utils"

interface TokenCounterProps {
  value: number
}

export function TokenCounter({ value }: TokenCounterProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [prevValue, setPrevValue] = useState(value)
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    if (value > prevValue) {
      setIsAnimating(true)

      // Animate the counter increasing
      const diff = value - prevValue
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
          setDisplayValue(value)
          setTimeout(() => {
            setIsAnimating(false)
          }, 300)
        }
      }, 50)

      return () => clearInterval(interval)
    }

    setPrevValue(value)
    setDisplayValue(value)
  }, [value, prevValue])

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

