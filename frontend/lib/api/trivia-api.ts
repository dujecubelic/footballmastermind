import { ApiClient } from "./api-client"

export interface TriviaQuestion {
  id: string
  question: string
  correctAnswer: string
  category: string
  difficulty: string
}

export interface GenerateQuestionsRequest {
  category: string
  difficulty: string
}

export interface GenerateQuestionsResponse {
  questions: TriviaQuestion[]
  category: string
  difficulty: string
  sessionId: string
}

export interface QuestionResult {
  questionId: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  timeSpent: number // in milliseconds
}

export interface TriviaSession {
  sessionId: string
  category: string
  difficulty: string
  questions: TriviaQuestion[]
  results: QuestionResult[]
  startTime: number
  endTime?: number
}

export class TriviaApi {
  static async generateQuestions(category: string, difficulty: string): Promise<GenerateQuestionsResponse> {
    try {
      const request: GenerateQuestionsRequest = {
        category,
        difficulty,
      }

      const response = await ApiClient.post<GenerateQuestionsResponse>("/api/trivia/generate-questions", {
        body: JSON.stringify(request),
        headers: {
          "Content-Type": "application/json",
        },
      })
      return response
    } catch (error) {
      console.error("Failed to generate questions:", error)
      throw error
    }
  }

  // Helper function to check if an answer is correct (case-insensitive, trimmed)
  static checkAnswer(userAnswer: string, correctAnswer: string): boolean {
    const normalizeAnswer = (answer: string) => {
      return (
        answer
          .toLowerCase()
          .trim()
          // Remove accents and special characters
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
          // Additional replacements for common football names
          .replace(/ñ/g, "n")
          .replace(/ç/g, "c")
          .replace(/ß/g, "ss")
          .replace(/æ/g, "ae")
          .replace(/ø/g, "o")
          .replace(/å/g, "a")
          // Remove non-alphanumeric characters except spaces
          .replace(/[^\w\s]/g, "")
          // Replace multiple spaces with single space
          .replace(/\s+/g, " ")
          .trim()
      )
    }

    const normalizedUser = normalizeAnswer(userAnswer)
    const normalizedCorrect = normalizeAnswer(correctAnswer)

    // Exact match
    if (normalizedUser === normalizedCorrect) {
      return true
    }

    // Check if user answer contains the correct answer or vice versa
    if (normalizedUser.includes(normalizedCorrect) || normalizedCorrect.includes(normalizedUser)) {
      return true
    }

    // Split into words and check if all words from correct answer are in user answer
    const userWords = normalizedUser.split(" ").filter((word) => word.length > 0)
    const correctWords = normalizedCorrect.split(" ").filter((word) => word.length > 0)

    // If correct answer has multiple words, check if all are present in user answer
    if (correctWords.length > 1) {
      const allWordsPresent = correctWords.every((correctWord) =>
        userWords.some((userWord) => userWord.includes(correctWord) || correctWord.includes(userWord)),
      )
      if (allWordsPresent) {
        return true
      }
    }

    return false
  }
}
