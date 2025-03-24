import { apiRequest } from './api';

export interface TokenTransaction {
  id: string;
  amount: number;
  type: 'EARN' | 'WITHDRAW' | 'PURCHASE' | 'SALE';
  createdAt: string;
  video?: {
    id: string;
    title: string;
    thumbnailUrl: string;
  };
}

export async function getTokenBalance(): Promise<number> {
  const response = await apiRequest<{ balance: number }>('/content/tokens/balance');
  return response.data?.balance || 0;
}

export async function getTransactionHistory(limit = 10): Promise<TokenTransaction[]> {
  const response = await apiRequest<{ transactions: TokenTransaction[] }>(
    `/content/tokens/history?limit=${limit}`
  );
  return response.data?.transactions || [];
}

export async function rewardWatchTime(videoId: string, seconds: number): Promise<number> {
  const response = await apiRequest<{ reward: number }>(`/content/${videoId}/watch-time`, {
    method: 'POST',
    body: JSON.stringify({ seconds }),
  });
  return response.data?.reward || 0;
}

export async function rewardEngagement(videoId: string, type: 'LIKE' | 'COMMENT' | 'SHARE'): Promise<number> {
  const response = await apiRequest<{ reward: number }>(`/content/${videoId}/${type.toLowerCase()}`, {
    method: 'POST',
  });
  return response.data?.reward || 0;
} 