'use client'

import { useGamification } from '@/hooks/use-gamification'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Trophy, Flame, Coins, Video, Heart, MessageCircle, Clock } from 'lucide-react'

export function GamificationStats() {
  const { stats, loading, error } = useGamification()

  if (loading) {
    return (
      <Card className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-8 w-8 mx-auto" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-4">
        <div className="text-center text-red-500">
          <p>Failed to load statistics</p>
        </div>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card className="p-4">
        <div className="text-center text-gray-500">
          <p>No statistics available</p>
        </div>
      </Card>
    )
  }

  const statItems = [
    {
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      label: 'Achievements',
      value: stats.achievementsCompleted,
    },
    {
      icon: <Flame className="h-6 w-6 text-orange-500" />,
      label: 'Streak',
      value: stats.streak,
    },
    {
      icon: <Coins className="h-6 w-6 text-green-500" />,
      label: 'Tokens',
      value: stats.tokens,
    },
    {
      icon: <Video className="h-6 w-6 text-blue-500" />,
      label: 'Videos',
      value: stats.totalVideos,
    },
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      label: 'Likes',
      value: stats.totalLikes,
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-purple-500" />,
      label: 'Comments',
      value: stats.totalComments,
    },
    {
      icon: <Clock className="h-6 w-6 text-indigo-500" />,
      label: 'Watch Time',
      value: `${Math.round(stats.totalWatchTime / 60)}m`,
    },
  ]

  return (
    <Card className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            {item.icon}
            <span className="mt-2 text-sm font-medium">{item.label}</span>
            <span className="text-lg font-bold">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  )
} 