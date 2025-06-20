import { ApiClient } from "./api-client"

export interface GameCategory {
  id: string // category type: "club", "country", "trophy", etc.
  name: string // specific value: "Barcelona", "Brazil", "World Cup", etc.
}

export interface CategoriesResponse {
  rowCategories: GameCategory[]
  colCategories: GameCategory[]
}

export interface PlayerSolution {
  id: string
  name: string
  details?: string
  imageUrl?: string
  [key: string]: any // Additional properties
}

// Request form for cell-solutions
export interface CellSolutionsRequest {
  rowCategoryId: string
  rowCategoryName: string
  colCategoryId: string
  colCategoryName: string
}

// Response form for cell-solutions
export interface CellSolutionsResponse {
  solutions: PlayerSolution[]
  count: number
  message: string
}

// Request form for validate-answer
export interface ValidateAnswerRequest {
  rowCategoryId: string
  rowCategoryName: string
  colCategoryId: string
  colCategoryName: string
  playerName: string
}

// Response form for validate-answer - SIMPLIFIED
export interface ValidateAnswerResponse {
  correct: boolean
}

export interface GameSession {
  sessionId: string
  gameMode: string
  currentPlayer: string
  status: string
  createdAt: string
}

export class TicTacToeApi {
  static async getCategories(): Promise<CategoriesResponse> {
    try {
      const response = await ApiClient.get<CategoriesResponse>("/api/tictactoe/categories")
      return response
    } catch (error) {
      console.error("Failed to get categories:", error)
      throw error
    }
  }

  static async getCellSolutions(
    rowCategoryId: string,
    rowCategoryName: string,
    colCategoryId: string,
    colCategoryName: string,
  ): Promise<CellSolutionsResponse> {
    try {
      const request: CellSolutionsRequest = {
        rowCategoryId,
        rowCategoryName,
        colCategoryId,
        colCategoryName,
      }

      const response = await ApiClient.post<CellSolutionsResponse>("/api/tictactoe/cell-solutions", {
        body: JSON.stringify(request),
        headers: {
          "Content-Type": "application/json",
        },
      })
      return response
    } catch (error) {
      console.error("Failed to get cell solutions:", error)
      throw error
    }
  }

  static async validateAnswer(
    rowCategoryId: string,
    rowCategoryName: string,
    colCategoryId: string,
    colCategoryName: string,
    playerName: string,
  ): Promise<ValidateAnswerResponse> {
    try {
      const request: ValidateAnswerRequest = {
        rowCategoryId,
        rowCategoryName,
        colCategoryId,
        colCategoryName,
        playerName,
      }

      const response = await ApiClient.post<ValidateAnswerResponse>("/api/tictactoe/validate-answer", {
        body: JSON.stringify(request),
        headers: {
          "Content-Type": "application/json",
        },
      })
      return response
    } catch (error) {
      console.error("Failed to validate answer:", error)
      throw error
    }
  }

  static async createGameSession(gameMode: string): Promise<GameSession> {
    try {
      const formData = new URLSearchParams()
      formData.append("gameMode", gameMode)

      const response = await ApiClient.post<GameSession>("/api/tictactoe/game-session", {
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      return response
    } catch (error) {
      console.error("Failed to create game session:", error)
      throw error
    }
  }
}
