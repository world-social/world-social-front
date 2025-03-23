"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, Shield, Check } from "lucide-react"

interface WorldIntegrationProps {
  onVerify: () => void
  onWithdraw: (amount: number) => void
  tokenBalance: number
  isVerified: boolean
}

export function WorldIntegration({ onVerify, onWithdraw, tokenBalance, isVerified = false }: WorldIntegrationProps) {
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState(0)

  const handleWithdraw = () => {
    if (withdrawAmount <= 0 || withdrawAmount > tokenBalance) return

    onWithdraw(withdrawAmount)
    setIsWithdrawing(false)
    setWithdrawAmount(0)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Coins className="mr-2 h-5 w-5 text-primary" />
          World Token Integration
        </CardTitle>
        <CardDescription>Manage your tokens and verify your identity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Token Balance</span>
            <span className="font-bold">{tokenBalance.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Verification Status</span>
            {isVerified ? (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                <Check className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                Not Verified
              </Badge>
            )}
          </div>

          {isWithdrawing && (
            <div className="space-y-2 mt-4">
              <label className="text-sm font-medium">Withdraw Amount (Max: {tokenBalance.toFixed(2)})</label>
              <input
                type="number"
                min="0"
                max={tokenBalance}
                step="0.1"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
              />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        {!isVerified && (
          <Button className="w-full" onClick={onVerify}>
            <Shield className="mr-2 h-4 w-4" />
            Verify Identity
          </Button>
        )}

        {isWithdrawing ? (
          <div className="flex w-full gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setIsWithdrawing(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleWithdraw}
              disabled={withdrawAmount <= 0 || withdrawAmount > tokenBalance}
            >
              Confirm Withdraw
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsWithdrawing(true)}
            disabled={tokenBalance <= 0 || !isVerified}
          >
            <Coins className="mr-2 h-4 w-4" />
            Withdraw Tokens
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

