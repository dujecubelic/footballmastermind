import { ApiClient } from "@/lib/api/api-client"

export interface User {
  id: number
  username: string
  email: string
  displayName?: string // This will be derived from username
  avatarUrl?: string
  createdAt?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  token?: string
}

export class AuthService {
  static async registerUser(username: string, password: string): Promise<AuthResponse> {
    try {
      // Create form data to match Spring's @RequestParam
      const formData = new URLSearchParams()
      formData.append("username", username)
      formData.append("password", password)

      const response = await ApiClient.post<any>("/api/auth/register", {
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include", // Explicitly include credentials for session management
      })

      return {
        success: true,
        message: response.message || "User registered successfully",
        user: response.user,
        token: response.token,
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      return {
        success: false,
        message: error.message || "Registration failed",
      }
    }
  }

  static async loginUser(username: string, password: string): Promise<AuthResponse> {
    try {
      // Create form data to match Spring's @RequestParam
      const formData = new URLSearchParams()
      formData.append("username", username)
      formData.append("password", password)

      const response = await ApiClient.post<any>("/api/auth/login", {
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include", // Explicitly include credentials for session management
      })

      return {
        success: true,
        message: response.message || "Login successful",
        user: response.user,
        token: response.token,
      }
    } catch (error: any) {
      console.error("Login error:", error)
      return {
        success: false,
        message: error.message || "Login failed",
      }
    }
  }

  static async getUserProfile(): Promise<User | null> {
    try {
      const response = await ApiClient.get<{ id: number; username: string; email: string }>("/api/auth/me", {
        credentials: "include", // Ensure session cookies are sent
      })

      // Transform the response to include displayName derived from username
      const user: User = {
        ...response,
        displayName: response.username, // Use username as displayName
      }

      return user
    } catch (error) {
      console.error("Get user profile error:", error)
      return null
    }
  }

  static async logout(): Promise<boolean> {
    try {
      await ApiClient.post("/api/auth/logout", {
        credentials: "include", // Include credentials to identify the session to logout
      })
      return true
    } catch (error) {
      console.error("Logout error:", error)
      return false
    }
  }

  // Helper method to verify token (for client-side use)
  static async verifyToken(token: string): Promise<any> {
    try {
      // This would typically be handled by the backend
      // For now, we'll just check if we can get the user profile
      const user = await this.getUserProfile()
      return user ? { userId: user.id } : null
    } catch (error) {
      return null
    }
  }

  // Helper method to get user by ID (for client-side use)
  static async getUserById(id: number): Promise<User | null> {
    try {
      const user = await ApiClient.get<User>(`/api/users/${id}`, {
        credentials: "include",
      })
      return user
    } catch (error) {
      console.error("Get user by ID error:", error)
      return null
    }
  }
}
