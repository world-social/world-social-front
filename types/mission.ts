export interface Mission {
  id: string
  title: string
  description: string
  reward: number
  progress: number
  target: number
  type: "daily" | "weekly" | "achievement"
  completed: boolean
  icon: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  target: number
  reward: number
}

export interface Leaderboard {
  id: string
  username: string
  avatar: string
  score: number
  rank: number
}

