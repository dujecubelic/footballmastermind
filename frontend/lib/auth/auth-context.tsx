"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthService, type User, type AuthResponse } from "./auth-service"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<AuthResponse>
  register: (username: string, password: string) => Promise<AuthResponse>
  logout: () => Promise<void>
  isAuthenticated: boolean
  isGuest: boolean
  loginAsGuest: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false, message: "Not implemented" }),
  register: async () => ({ success: false, message: "Not implemented" }),
  logout: async () => {},
  isAuthenticated: false,
  isGuest: false,
  loginAsGuest: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [isGuest, setIsGuest] = useState<boolean>(false)

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await AuthService.getUserProfile()
        if (user) {
          setUser(user)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string): Promise<AuthResponse> => {
    const result = await AuthService.loginUser(username, password)

    if (result.success && result.user) {
      setUser(result.user)
      setIsGuest(false)
      router.push("/")
    }

    return result
  }

  const loginAsGuest = () => {
    setIsGuest(true)
    setUser(null)
    setLoading(false)
    router.push("/")
  }

  const register = async (username: string, password: string): Promise<AuthResponse> => {
    const result = await AuthService.registerUser(username, password)

    if (result.success && result.user) {
      setUser(result.user)
      setIsGuest(false)
      router.push("/")
    } else if (result.success) {
      router.push("/")
    }

    return result
  }

  const logout = async (): Promise<void> => {
    if (isGuest) {
      setIsGuest(false)
      router.push("/login")
      return
    }

    const success = await AuthService.logout()

    if (success) {
      setUser(null)
      router.push("/login")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isGuest,
        loginAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
