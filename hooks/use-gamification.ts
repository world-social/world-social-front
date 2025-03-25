import { useState, useEffect, useCallback } from 'react'
import type { UserAchievement, UserMission, GamificationStats } from '@/types/gamification'
import {
  fetchUserAchievements,
  fetchUserMissions,
  updateMissionProgress,
  claimMissionReward,
  updateStreak,
  fetchGamificationStats,
} from '@/lib/gamification-service'

export function useGamification() {
  const [achievements, setAchievements] = useState<UserAchievement[]>([])
  const [missions, setMissions] = useState<UserMission[]>([])
  const [stats, setStats] = useState<GamificationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [achievementsData, missionsData, statsData] = await Promise.all([
        fetchUserAchievements(),
        fetchUserMissions(),
        fetchGamificationStats(),
      ])
      setAchievements(achievementsData)
      setMissions(missionsData)
      setStats(statsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch gamification data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleMissionProgress = useCallback(async (missionId: string, progress: number) => {
    try {
      const updatedMission = await updateMissionProgress(missionId, progress)
      setMissions((prev) =>
        prev.map((mission) =>
          mission.id === updatedMission.id ? updatedMission : mission
        )
      )
      return updatedMission
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update mission progress')
    }
  }, [])

  const handleMissionClaim = async (missionId: string) => {
    try {
      const updatedMission = await claimMissionReward(missionId)
      setStats(prevStats => {
        if (!prevStats) return null
        return {
          ...prevStats,
          tokens: prevStats.tokens + updatedMission.mission.reward
        }
      })
      return updatedMission
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to claim mission reward')
    }
  }

  const handleStreakUpdate = async () => {
    try {
      const updatedStreak = await updateStreak()
      setStats(prevStats => {
        if (!prevStats) return null
        return {
          ...prevStats,
          streak: updatedStreak.streak,
          tokens: prevStats.tokens + updatedStreak.reward
        }
      })
    } catch (error) {
      console.error('Failed to update streak:', error)
    }
  }

  return {
    achievements,
    missions,
    stats,
    loading,
    error,
    refresh: fetchData,
    updateMissionProgress: handleMissionProgress,
    claimReward: handleMissionClaim,
    updateStreak: handleStreakUpdate,
  }
} 