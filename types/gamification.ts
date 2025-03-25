export interface Achievement {
  id: string
  title: string
  description: string
  reward: number
  target: number
  type: 'MISSION' | 'POST' | 'LIKE' | 'COMMENT' | 'STREAK'
  icon: string
}

export interface UserAchievement {
  id: string
  achievementId: string
  userId: string
  progress: number
  completed: boolean
  completedAt?: Date
  achievement: Achievement
}

export interface Mission {
  id: string
  title: string
  description: string
  reward: number
  type: 'DAILY' | 'WEEKLY' | 'SPECIAL'
  requirements: {
    type: string
    amount: number
  }[]
  expiresAt: Date
}

export interface UserMission {
  id: string
  missionId: string
  userId: string
  progress: number
  completed: boolean
  completedAt?: Date
  mission: Mission
}

export interface GamificationStats {
  id: string
  userId: string
  tokens: number
  streak: number
  lastStreakDate: Date
  totalVideos: number
  totalLikes: number
  totalComments: number
  totalWatchTime: number
  achievementsCompleted: number
  missionsCompleted: number
} 