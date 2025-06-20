import { ApiClient } from "./api-client"

export interface UserStats {
  gamesPlayed: number
  gamesWon: number
  winRate: string
  highestScore: number
  questionsAnswered: number
  correctAnswers: number
  accuracy: string
  rankPoints: number
  rankTier: string
  level: number
  xp: number
  xpToNextLevel: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  completed: boolean
  progress?: number
  maxProgress?: number
  icon: string
}

export interface UserAchievements {
  achievements: Achievement[]
}

export class UserApi {
  static async getUserStats(): Promise<UserStats> {
    try {
      const stats = await ApiClient.get<UserStats>("/api/user/stats")
      return stats
    } catch (error) {
      console.error("Failed to get user stats:", error)
      throw error
    }
  }

  static async getUserAchievements(): Promise<UserAchievements> {
    try {
      const achievements = await ApiClient.get<UserAchievements>("/api/user/achievements")
      return achievements
    } catch (error) {
      console.error("Failed to get user achievements:", error)
      throw error
    }
  }
}
