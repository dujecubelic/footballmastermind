class ApiClient {
  private baseURL: string

  constructor() {
    // Use relative URLs since frontend and backend are on same domain
    this.baseURL = ""
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseURL}/api${endpoint}`

    console.log(`Making request to: ${url}`)
    console.log("Request options:", options)

    const config: RequestInit = {
      credentials: "include", // Important for session cookies
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      console.log(`Response status: ${response.status}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Request failed: ${response.status} - ${errorText}`)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("Response data:", data)
      return data
    } catch (error) {
      console.error("Request error:", error)
      throw error
    }
  }

  async get(endpoint: string): Promise<any> {
    return this.request(endpoint, { method: "GET" })
  }

  async post(endpoint: string, data?: any): Promise<any> {
    return this.request(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put(endpoint: string, data?: any): Promise<any> {
    return this.request(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete(endpoint: string): Promise<any> {
    return this.request(endpoint, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient()
