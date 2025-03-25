"use client"

import { useGamification } from '@/hooks/use-gamification'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Trophy } from 'lucide-react'

export function AchievementsPanel() {
  const { achievements, loading, error } = useGamification()

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
        <p>Failed to load achievements</p>
      </div>
    )
  }

  if (!achievements.length) {
    return (
      <div className="text-center text-gray-500">
        <p>No achievements available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {achievements.map((achievement) => (
        <Card key={achievement.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-medium">{achievement.achievement.title}</h3>
              <p className="text-sm text-gray-500">{achievement.achievement.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">{achievement.achievement.reward}</span>
            </div>
          </div>

          <div className="mt-4">
            <Progress
              value={(achievement.progress / achievement.achievement.target) * 100}
              className="h-2"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>{achievement.progress}</span>
              <span>{achievement.achievement.target}</span>
            </div>
          </div>

          {achievement.completed && (
            <div className="mt-4 text-center text-sm text-green-500">
              Completed!
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}

