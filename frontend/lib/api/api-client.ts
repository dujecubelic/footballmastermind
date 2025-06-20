const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "" // Empty string for relative URLs in production
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

interface ApiOptions {
  method?: string
  headers?: Record<string, string>
  body?: FormData | URLSearchParams | string
  credentials?: RequestCredentials
}

export class ApiClient {
  static async fetch<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const defaultHeaders: Record<string, string> = {
      Accept: "application/json",
    }

    // Don't set Content-Type for FormData as the browser will set it with the boundary
    if (!(options.body instanceof FormData) && !(options.body instanceof URLSearchParams)) {
      defaultHeaders["Content-Type"] = "application/json"
    }

    const fetchOptions: RequestInit = {
      method: options.method || "GET",
      headers: { ...defaultHeaders, ...options.headers },
      credentials: options.credentials || "include", // Always include credentials for session management
      body: options.body,
    }

    try {
      const response = await fetch(url, fetchOptions)

      // Check if response is ok first
      if (!response.ok) {
        // For error responses, try to get error details from JSON
        try {
          const errorData = await response.json()
          throw new Error(errorData.message || errorData.error || `API error: ${response.status}`)
        } catch (jsonError) {
          // If parsing JSON fails, use status text
          throw new Error(`API error: ${response.status} ${response.statusText}`)
        }
      }

      // For successful responses, check content type
      const contentType = response.headers.get("content-type")

      if (contentType && contentType.includes("application/json")) {
        return (await response.json()) as T
      } else {
        // For non-JSON responses (like plain text)
        return (await response.text()) as unknown as T
      }
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error)
      throw error
    }
  }

  static async get<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: "GET", credentials: "include" })
  }

  static async post<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: "POST", credentials: "include" })
  }

  static async put<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: "PUT", credentials: "include" })
  }

  static async delete<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: "DELETE", credentials: "include" })
  }
}
