"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Mission } from "@/types/mission"
import { fetchMissions } from "@/lib/mission-service"
import { Play, Heart, MessageCircle, Share2, Upload, Coins, Gift } from "lucide-react"

interface MissionsPanelProps {
  onClaimReward: (reward: number) => void
}

export function MissionsPanel({ onClaimReward }: MissionsPanelProps) {
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("daily")

  useEffect(() => {
    const loadMissions = async () => {
      setLoading(true)
      try {
        const data = await fetchMissions()
        setMissions(data)
      } catch (error) {
        console.error("Error loading missions:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMissions()
  }, [])

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "play":
        return <Play className="h-5 w-5" />
      case "heart":
        return <Heart className="h-5 w-5" />
      case "message-circle":
        return <MessageCircle className="h-5 w-5" />
      case "share-2":
        return <Share2 className="h-5 w-5" />
      case "upload":
        return <Upload className="h-5 w-5" />
      default:
        return <Gift className="h-5 w-5" />
    }
  }

  const handleClaimReward = (mission: Mission) => {
    onClaimReward(mission.reward)

    // Update local state to mark mission as claimed
    setMissions((prev) => prev.map((m) => (m.id === mission.id ? { ...m, completed: true, progress: m.target } : m)))
  }

  const dailyMissions = missions.filter((m) => m.type === "daily")
  const weeklyMissions = missions.filter((m) => m.type === "weekly")

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
          <Gift className="mr-2 h-5 w-5 text-primary" />
          Missões e Recompensas
        </CardTitle>
        <CardDescription>Complete missões para ganhar tokens extras</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daily">Diárias</TabsTrigger>
            <TabsTrigger value="weekly">Semanais</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4 mt-4">
            {dailyMissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Nenhuma missão diária disponível</div>
            ) : (
              dailyMissions.map((mission) => (
                <div key={mission.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">{getIconComponent(mission.icon)}</div>
                    <div className="flex-1">
                      <h4 className="font-medium">{mission.title}</h4>
                      <p className="text-sm text-muted-foreground">{mission.description}</p>

                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progresso</span>
                          <span>
                            {mission.progress} / {mission.target}
                          </span>
                        </div>
                        <Progress value={(mission.progress / mission.target) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <Coins className="h-4 w-4 mr-1 text-primary" />
                      <span className="font-medium">{mission.reward} tokens</span>
                    </div>

                    <Button
                      size="sm"
                      disabled={mission.progress < mission.target || mission.completed}
                      onClick={() => handleClaimReward(mission)}
                    >
                      {mission.completed ? "Coletado" : "Coletar"}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4 mt-4">
            {weeklyMissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Nenhuma missão semanal disponível</div>
            ) : (
              weeklyMissions.map((mission) => (
                <div key={mission.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">{getIconComponent(mission.icon)}</div>
                    <div className="flex-1">
                      <h4 className="font-medium">{mission.title}</h4>
                      <p className="text-sm text-muted-foreground">{mission.description}</p>

                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progresso</span>
                          <span>
                            {mission.progress} / {mission.target}
                          </span>
                        </div>
                        <Progress value={(mission.progress / mission.target) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <Coins className="h-4 w-4 mr-1 text-primary" />
                      <span className="font-medium">{mission.reward} tokens</span>
                    </div>

                    <Button
                      size="sm"
                      disabled={mission.progress < mission.target || mission.completed}
                      onClick={() => handleClaimReward(mission)}
                    >
                      {mission.completed ? "Coletado" : "Coletar"}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

