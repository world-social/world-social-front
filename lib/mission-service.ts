import type { Mission, Achievement, Leaderboard } from "@/types/mission"

// Sample missions for development
export const sampleMissions: Mission[] = [
  {
    id: "mission-1",
    title: "Maratonista de Vídeos",
    description: "Assista 10 vídeos hoje",
    reward: 50,
    progress: 0,
    target: 10,
    type: "daily",
    completed: false,
    icon: "play",
  },
  {
    id: "mission-2",
    title: "Engajador Social",
    description: "Dê 5 likes em vídeos",
    reward: 25,
    progress: 0,
    target: 5,
    type: "daily",
    completed: false,
    icon: "heart",
  },
  {
    id: "mission-3",
    title: "Comentarista",
    description: "Deixe 3 comentários em vídeos",
    reward: 30,
    progress: 0,
    target: 3,
    type: "daily",
    completed: false,
    icon: "message-circle",
  },
  {
    id: "mission-4",
    title: "Compartilhador",
    description: "Compartilhe 2 vídeos com amigos",
    reward: 40,
    progress: 0,
    target: 2,
    type: "daily",
    completed: false,
    icon: "share-2",
  },
  {
    id: "mission-5",
    title: "Criador de Conteúdo",
    description: "Poste 1 vídeo esta semana",
    reward: 100,
    progress: 0,
    target: 1,
    type: "weekly",
    completed: false,
    icon: "upload",
  },
]

export const sampleAchievements: Achievement[] = [
  {
    id: "achievement-1",
    title: "Iniciante",
    description: "Assista 50 vídeos no total",
    icon: "play",
    unlocked: false,
    progress: 0,
    target: 50,
    reward: 100,
  },
  {
    id: "achievement-2",
    title: "Fã de Conteúdo",
    description: "Assista 200 vídeos no total",
    icon: "play",
    unlocked: false,
    progress: 0,
    target: 200,
    reward: 250,
  },
  {
    id: "achievement-3",
    title: "Influenciador Iniciante",
    description: "Receba 100 likes nos seus vídeos",
    icon: "heart",
    unlocked: false,
    progress: 0,
    target: 100,
    reward: 150,
  },
  {
    id: "achievement-4",
    title: "Colecionador de Tokens",
    description: "Acumule 1000 tokens",
    icon: "coins",
    unlocked: false,
    progress: 0,
    target: 1000,
    reward: 200,
  },
  {
    id: "achievement-5",
    title: "Criador Prolífico",
    description: "Poste 10 vídeos",
    icon: "upload",
    unlocked: false,
    progress: 0,
    target: 10,
    reward: 300,
  },
]

export const sampleLeaderboard: Leaderboard[] = [
  {
    id: "user-1",
    username: "creator_estrela",
    avatar: "/placeholder.svg?height=40&width=40&text=CE",
    score: 12500,
    rank: 1,
  },
  {
    id: "user-2",
    username: "video_master",
    avatar: "/placeholder.svg?height=40&width=40&text=VM",
    score: 10200,
    rank: 2,
  },
  {
    id: "user-3",
    username: "token_hunter",
    avatar: "/placeholder.svg?height=40&width=40&text=TH",
    score: 9800,
    rank: 3,
  },
  {
    id: "user-4",
    username: "social_king",
    avatar: "/placeholder.svg?height=40&width=40&text=SK",
    score: 8500,
    rank: 4,
  },
  {
    id: "user-5",
    username: "content_queen",
    avatar: "/placeholder.svg?height=40&width=40&text=CQ",
    score: 7900,
    rank: 5,
  },
  {
    id: "user-6",
    username: "YourUsername",
    avatar: "/placeholder.svg?height=40&width=40&text=YU",
    score: 5400,
    rank: 6,
  },
]

// Fetch missions
export async function fetchMissions(): Promise<Mission[]> {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sampleMissions)
    }, 500)
  })
}

// Update mission progress
export async function updateMissionProgress(missionId: string, progress: number): Promise<Mission> {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const mission = sampleMissions.find((m) => m.id === missionId)
      if (mission) {
        mission.progress = Math.min(mission.target, mission.progress + progress)
        mission.completed = mission.progress >= mission.target
      }
      resolve(mission!)
    }, 300)
  })
}

// Fetch achievements
export async function fetchAchievements(): Promise<Achievement[]> {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sampleAchievements)
    }, 500)
  })
}

// Update achievement progress
export async function updateAchievementProgress(achievementId: string, progress: number): Promise<Achievement> {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const achievement = sampleAchievements.find((a) => a.id === achievementId)
      if (achievement) {
        achievement.progress = Math.min(achievement.target, achievement.progress + progress)
        achievement.unlocked = achievement.progress >= achievement.target
      }
      resolve(achievement!)
    }, 300)
  })
}

// Fetch leaderboard
export async function fetchLeaderboard(): Promise<Leaderboard[]> {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sampleLeaderboard)
    }, 500)
  })
}

