const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

interface ApiResponse<T = any> {
  status: "success" | "error"
  data?: T
  error?: string
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

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem("auth_token")
  const headers: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as HeadersInit),
  }

  // Only set Content-Type if it's not FormData
  if (!(options.body instanceof FormData)) {
    Object.assign(headers, { "Content-Type": "application/json" })
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (response.status === 429) {
      // Rate limit hit, wait and retry
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return apiRequest(endpoint, options)
    }

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "API request failed")
    }

    return data
  } catch (error) {
    console.error("API request error:", error)
    return {
      status: "error",
      error: error instanceof Error ? error.message : "API request failed",
    }
  }
}

export async function uploadFile(
  file: File,
  endpoint: string,
  additionalData: Record<string, any> = {}
): Promise<ApiResponse> {
  const token = localStorage.getItem("auth_token")
  const formData = new FormData()
  formData.append("video", file)

  // Append additional data
  Object.entries(additionalData).forEach(([key, value]) => {
    formData.append(key, value)
  })

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (response.status === 429) {
      // Rate limit hit, wait and retry
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return uploadFile(file, endpoint, additionalData)
    }

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "File upload failed")
    }

    return data
  } catch (error) {
    console.error("File upload error:", error)
    return {
      status: "error",
      error: error instanceof Error ? error.message : "File upload failed",
    }
  }
} 