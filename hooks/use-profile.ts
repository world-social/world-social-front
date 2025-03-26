import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiRequest } from '@/lib/api'

export interface Video {
  id: string
  title: string
  description: string
  url: string
  thumbnailUrl: string
  userId: string
  likes: number
  views: number
  duration: number
  tags: string[]
}

export interface Profile {
  id: string
  username: string
  avatar: string | null
  tokenBalance: number
  followers: number
  following: number
  isInfluencer: boolean
  videos: Video[]
  likes: Array<{
    id: string
    video: Video
  }>
  savedVideos: Array<{
    id: string
    video: Video
  }>
}

export interface UseProfileReturn {
  profile: Profile | null
  loading: boolean
  error: string | null
  refreshProfile: () => Promise<void>
  withdrawTokens: (amount: number) => Promise<void>
}

export function useProfile(): UseProfileReturn {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiRequest<Profile>('/auth/profile')
      
      if (response.status === 'success' && response.data) {
        // Only update if the token balance has changed
        if (!profile || profile.tokenBalance !== response.data.tokenBalance) {
          setProfile(response.data)
        }
      } else {
        if (response.error === 'User not found' || response.error === 'Access token required') {
          router.push('/signup')
          return
        }
        setError(response.error || 'Failed to fetch profile')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      if (error instanceof Error && 
          (error.message === 'User not found' || error.message === 'Access token required')) {
        router.push('/signup')
        return
      }
      setError(error instanceof Error ? error.message : 'Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  const withdrawTokens = async (amount: number) => {
    try {
      const response = await apiRequest('/tokens/withdraw', {
        method: 'POST',
        body: JSON.stringify({ amount })
      })

      if (response.status === 'success') {
        // Refresh profile to get updated balance
        await fetchProfile()
      } else {
        throw new Error(response.error || 'Failed to withdraw tokens')
      }
    } catch (error) {
      console.error('Error withdrawing tokens:', error)
      throw error
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  return {
    profile,
    loading,
    error,
    refreshProfile: fetchProfile,
    withdrawTokens
  }
} 