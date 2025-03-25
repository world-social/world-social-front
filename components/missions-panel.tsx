"use client"

import { useGamification } from '@/hooks/use-gamification'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Gift } from 'lucide-react'

export function MissionsPanel() {
  const { missions, loading, error, claimReward } = useGamification()

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-2 w-full" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Failed to load missions</p>
      </div>
    )
  }

  if (!missions.length) {
    return (
      <div className="text-center text-gray-500">
        <p>No missions available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {missions.map((mission) => (
        <Card key={mission.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-medium">{mission.mission.title}</h3>
              <p className="text-sm text-gray-500">{mission.mission.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">{mission.mission.reward}</span>
            </div>
          </div>

          <div className="mt-4">
            <Progress
              value={(mission.progress / mission.mission.requirements[0].amount) * 100}
              className="h-2"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>{mission.progress}</span>
              <span>{mission.mission.requirements[0].amount}</span>
            </div>
          </div>

          {!mission.completed && (
            <Button
              className="mt-4 w-full"
              onClick={() => claimReward(mission.id)}
              disabled={mission.progress < mission.mission.requirements[0].amount}
            >
              Claim Reward
            </Button>
          )}

          {mission.completed && (
            <div className="mt-4 text-center text-sm text-green-500">
              Completed!
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}

