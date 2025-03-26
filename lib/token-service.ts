import { apiRequest } from './api';

export interface TokenTransaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
  videoId?: string;
}

export interface GamificationStats {
  user: {
    id: string;
    username: string;
    avatar: string;
    tokenBalance: number;
    streak: number;
    lastStreakDate: string;
    totalWatchTime: number;
  };
  stats: {
    videos: number;
    likes: number;
    comments: number;
    completedAchievements: number;
    completedMissions: number;
  };
  transactions: TokenTransaction[];
}

export async function getTokenBalance(): Promise<number> {
  try {
    const response = await apiRequest<{ status: string; data: GamificationStats }>('/gamification/stats');
    return response.data?.data.user.tokenBalance || 0;
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return 0;
  }
}

export async function getTransactionHistory(limit = 50): Promise<TokenTransaction[]> {
  try {
    const response = await apiRequest<{ status: string; data: GamificationStats }>('/gamification/stats');
    return response.data?.data.transactions || [];
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return [];
  }
}

interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
}

interface WatchTimeResponse {
  reward: number;
}

interface EngagementResponse {
  reward: number;
}

export async function rewardWatchTime(videoId: string, seconds: number): Promise<number> {
  try {
    // Calculate reward: 0.1 tokens per 5 seconds watched
    const reward = Math.round((seconds / 5) * 0.1 * 100) / 100;

    console.log('Rewarding watch time:', {
      videoId,
      seconds,
      calculatedReward: reward
    });

    const response = await apiRequest<ApiResponse<WatchTimeResponse>>(`/content/${videoId}/watch-time`, {
      method: 'POST',
      body: JSON.stringify({ 
        seconds,
        reward,
        timestamp: Date.now() 
      }),
    });

    console.log('Watch time response:', response);

    if (response.status === 'error' || !response.data) {
      throw new Error('Failed to reward watch time');
    }

    const actualReward = Math.round(((response as any).data?.reward ?? 0) * 100) / 100;
    
    console.log('Watch time reward details:', {
      seconds,
      expectedReward: reward,
      actualReward,
      responseData: response.data
    });
    
    if (actualReward > 0) {
      await apiRequest('/gamification/stats', { method: 'GET', cache: 'no-store' });
    }
    
    return actualReward;
  } catch (error) {
    console.error('Error rewarding watch time:', error);
    return 0;
  }
}

export async function rewardEngagement(videoId: string, type: 'LIKE' | 'COMMENT' | 'SHARE'): Promise<number> {
  try {
    const response = await apiRequest<ApiResponse<EngagementResponse>>(`/content/${videoId}/${type.toLowerCase()}`, {
      method: 'POST',
    });

    console.log('Engagement response:', response);

    if (response.status === 'error' || !response.data) {
      throw new Error(`Failed to reward ${type.toLowerCase()}`);
    }

    // Access reward from the nested data structure
    const reward = (response as any).data?.reward ?? 0;
    
    // Log full response for debugging
    console.log('Full engagement response:', JSON.stringify(response, null, 2));
    
    // Invalidate token balance cache after receiving reward
    if (reward > 0) {
      await apiRequest('/gamification/stats', { method: 'GET', cache: 'no-store' });
    }
    
    return reward;
  } catch (error) {
    console.error('Error rewarding engagement:', error);
    return 0;
  }
}

export async function claimDailyBonus(): Promise<{ success: boolean; amount?: number; error?: string }> {
  try {
    const response = await apiRequest<{ status: string; data: { reward: number } }>('/tokens/daily-bonus', {
      method: 'POST',
    });
    return {
      success: true,
      amount: response.data?.data.reward || 0
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to claim daily bonus'
    };
  }
}

export async function checkDailyBonus(): Promise<{ canCollect: boolean; nextCollectionTime?: Date }> {
  try {
    const response = await apiRequest<{ status: string; data: { canCollect: boolean; nextCollectionTime?: string } }>('/tokens/daily-bonus/status');
    return {
      canCollect: response.data?.data.canCollect || false,
      nextCollectionTime: response.data?.data.nextCollectionTime ? new Date(response.data.data.nextCollectionTime) : undefined
    };
  } catch (error) {
    console.error('Error checking daily bonus:', error);
    return { canCollect: false };
  }
} 