"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Leaderboard } from "@/types/mission"
import { fetchLeaderboard } from "@/lib/mission-service"
import { Trophy, Medal, Coins } from "lucide-react"

export function LeaderboardPanel() {
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true)
      try {
        const data = await fetchLeaderboard()
        setLeaderboard(data)
      } catch (error) {
        console.error("Error loading leaderboard:", error)
      } finally {
        setLoading(false)
      }
    }

    loadLeaderboard()
  }, [])

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <Trophy className="h-3 w-3 mr-1" />
            1º
          </Badge>
        )
      case 2:
        return (
          <Badge className="bg-gray-400 hover:bg-gray-500">
            <Medal className="h-3 w-3 mr-1" />
            2º
          </Badge>
        )
      case 3:
        return (
          <Badge className="bg-amber-700 hover:bg-amber-800">
            <Medal className="h-3 w-3 mr-1" />
            3º
          </Badge>
        )
      default:
        return <Badge variant="outline">{rank}º</Badge>
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-primary" />
          Ranking Semanal
        </CardTitle>
        <CardDescription>Os usuários mais ativos da semana</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboard.map((user) => (
            <div
              key={user.id}
              className={`flex items-center p-3 rounded-lg ${user.username === "YourUsername" ? "bg-primary/10" : ""}`}
            >
              <div className="mr-3">{getRankBadge(user.rank)}</div>

              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback>{user.username[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className={`font-medium ${user.username === "YourUsername" ? "text-primary" : ""}`}>
                  {user.username}
                </p>
              </div>

              <div className="flex items-center">
                <Coins className="h-4 w-4 mr-1 text-primary" />
                <span className="font-medium">{user.score.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

