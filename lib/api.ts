const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api`;

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: string;
}

export async function getAuthToken(): Promise<string | null> {
  // In a real app, you would get this from your auth provider
  // For now, we'll use localStorage
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retries = 3
): Promise<ApiResponse<T>> {
  try {
    const token = await getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle rate limiting
    if (response.status === 429) {
      if (retries > 0) {
        // Wait for 1 second before retrying
        await delay(1000);
        return apiRequest(endpoint, options, retries - 1);
      }
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function uploadFile(
  endpoint: string,
  file: File,
  additionalData: Record<string, string> = {}
): Promise<ApiResponse<any>> {
  try {
    const token = await getAuthToken();
    const formData = new FormData();
    formData.append('video', file);

    // Add additional data to the form
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    // Handle rate limiting
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }

    return data;
  } catch (error) {
    console.error('Upload error:', error);
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
} 