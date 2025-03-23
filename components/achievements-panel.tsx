"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Achievement } from "@/types/mission"
import { fetchAchievements } from "@/lib/mission-service"
import { Award, Play, Heart, Upload, Coins, Gift, Lock, Check } from "lucide-react"

interface AchievementsPanelProps {
  onClaimReward: (reward: number) => void
}

export function AchievementsPanel({ onClaimReward }: AchievementsPanelProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAchievements = async () => {
      setLoading(true)
      try {
        const data = await fetchAchievements()
        setAchievements(data)
      } catch (error) {
        console.error("Error loading achievements:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAchievements()
  }, [])

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "play":
        return <Play className="h-5 w-5" />
      case "heart":
        return <Heart className="h-5 w-5" />
      case "upload":
        return <Upload className="h-5 w-5" />
      case "coins":
        return <Coins className="h-5 w-5" />
      default:
        return <Gift className="h-5 w-5" />
    }
  }

  const handleClaimReward = (achievement: Achievement) => {
    onClaimReward(achievement.reward)

    // Update local state to mark achievement as claimed
    setAchievements((prev) =>
      prev.map((a) => (a.id === achievement.id ? { ...a, unlocked: true, progress: a.target } : a)),
    )
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
          <Award className="mr-2 h-5 w-5 text-primary" />
          Conquistas
        </CardTitle>
        <CardDescription>Desbloqueie conquistas para ganhar recompensas especiais</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="border rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${achievement.unlocked ? "bg-primary/20" : "bg-muted"}`}>
                  {achievement.unlocked ? (
                    getIconComponent(achievement.icon)
                  ) : (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>

                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progresso</span>
                      <span>
                        {achievement.progress} / {achievement.target}
                      </span>
                    </div>
                    <Progress value={(achievement.progress / achievement.target) * 100} className="h-2" />
                  </div>
                </div>

                {achievement.unlocked && (
                  <div className="bg-green-500/10 p-1 rounded-full">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center">
                  <Coins className="h-4 w-4 mr-1 text-primary" />
                  <span className="font-medium">{achievement.reward} tokens</span>
                </div>

                <Button size="sm" disabled={!achievement.unlocked} onClick={() => handleClaimReward(achievement)}>
                  {achievement.unlocked ? "Coletar Recompensa" : "Bloqueado"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

