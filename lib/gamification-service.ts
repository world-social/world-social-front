import { apiRequest } from './api'
import type { Achievement, UserAchievement, Mission, UserMission, GamificationStats } from '@/types/gamification'

export async function fetchUserAchievements(): Promise<UserAchievement[]> {
  const response = await apiRequest<UserAchievement[]>('/gamification/achievements')
  return response.data || []
}

export async function checkAchievementProgress(): Promise<UserAchievement[]> {
  const response = await apiRequest<UserAchievement[]>('/gamification/achievements/progress')
  return response.data || []
}

export async function fetchUserMissions(): Promise<UserMission[]> {
  const response = await apiRequest<UserMission[]>('/gamification/missions')
  return response.data || []
}

export async function updateMissionProgress(missionId: string, progress: number): Promise<UserMission> {
  const response = await apiRequest<UserMission>(`/gamification/missions/${missionId}/progress`, {
    method: 'POST',
    body: JSON.stringify({ progress }),
  })
  if (!response.data) throw new Error('Failed to update mission progress')
  return response.data
}

export async function claimMissionReward(missionId: string): Promise<UserMission> {
  const response = await apiRequest<UserMission>(`/gamification/missions/${missionId}/claim`, {
    method: 'POST',
  })
  if (!response.data) throw new Error('Failed to claim mission reward')
  return response.data
}

export async function updateStreak(): Promise<{ streak: number; reward: number }> {
  const response = await apiRequest<{ streak: number; reward: number }>('/gamification/streak', {
    method: 'POST',
  })
  if (!response.data) throw new Error('Failed to update streak')
  return response.data
}

export async function fetchGamificationStats(): Promise<GamificationStats> {
  const response = await apiRequest<GamificationStats>('/gamification/stats')
  if (!response.data) throw new Error('Failed to fetch gamification stats')
  return response.data
} 