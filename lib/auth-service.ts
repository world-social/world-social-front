import { apiRequest } from './api';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  if (response.status === 'success' && response.data) {
    // Store the token
    localStorage.setItem('auth_token', response.data.token);
    return response.data;
  }

  throw new Error(response.error || 'Login failed');
}

export async function logout(): Promise<void> {
  localStorage.removeItem('auth_token');
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('auth_token');
}

// For development, let's create a mock user
export async function mockLogin(): Promise<LoginResponse> {
  const mockResponse: LoginResponse = {
    token: 'mock-jwt-token',
    user: {
      id: '1',
      username: 'testuser',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=testuser',
    },
  };

  localStorage.setItem('auth_token', mockResponse.token);
  return mockResponse;
} 