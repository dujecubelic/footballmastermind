import { ApiClient } from "./api-client"

export interface GameStatsRequest {
  gameMode: "training" | "ranked" | "casual"
  gameType: "trivia" | "tic-tac-toe" | "category-grid"
  difficulty?: "easy" | "medium" | "hard"
  category?: string
  correctAnswers: number
  totalAnswers: number
  averageTimeMs: number
  accuracy: number // percentage (0-100)
  xpEarned: number
  eloChange?: number // for ranked games
  isWinner?: boolean
  sessionDurationMs: number
}

export interface GameStatsResponse {
  success: boolean
  message: string
  newStats: {
    totalXP: number
    level: number
    xpToNextLevel: number
    gamesPlayed: number
    gamesWon: number
    winRate: string
    averageAccuracy: string
    averageResponseTime: string
    rankPoints?: number
    rankTier?: string
  }
}

export interface XPBreakdownRequest {
  correctAnswers: number
  totalAnswers: number
  averageTimeMs: number
  difficulty: "easy" | "medium" | "hard"
  gameMode: "training" | "ranked" | "casual"
  isWinner?: boolean
}

export interface XPBreakdownResponse {
  baseXP: number
  difficultyBonus: number
  speedBonus: number
  accuracyBonus: number
  winBonus: number
  totalXP: number
  breakdown: {
    base: string
    difficulty: string
    speed: string
    accuracy: string
    win: string
  }
}

export class GameStatsApi {
  static async submitGameStats(stats: GameStatsRequest): Promise<GameStatsResponse> {
    try {
      const response = await ApiClient.post<GameStatsResponse>("/api/game-stats/submit", {
        body: JSON.stringify(stats),
        headers: {
          "Content-Type": "application/json",
        },
      })
      return response
    } catch (error) {
      console.error("Failed to submit game stats:", error)
      throw error
    }
  }

  static async calculateXPBreakdown(params: XPBreakdownRequest): Promise<XPBreakdownResponse> {
    try {
      const response = await ApiClient.post<XPBreakdownResponse>("/api/game-stats/calculate-xp", {
        body: JSON.stringify(params),
        headers: {
          "Content-Type": "application/json",
        },
      })
      return response
    } catch (error) {
      console.error("Failed to calculate XP breakdown:", error)
      throw error
    }
  }
}
