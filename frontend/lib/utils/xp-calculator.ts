export interface XPCalculationParams {
  correctAnswers: number
  totalAnswers: number
  averageTimeMs: number
  difficulty: "easy" | "medium" | "hard"
  gameMode: "training" | "ranked" | "casual"
  isWinner?: boolean // for multiplayer games
}

export interface XPBreakdown {
  baseXP: number
  difficultyMultiplier: number
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

export class XPCalculator {
  // Base XP per correct answer
  private static readonly BASE_XP_PER_CORRECT = 10

  // Difficulty multipliers
  private static readonly DIFFICULTY_MULTIPLIERS = {
    easy: 1.0,
    medium: 1.5,
    hard: 2.0,
  }

  // Speed thresholds (in seconds) for bonus calculation
  private static readonly SPEED_THRESHOLDS = {
    excellent: 3, // Under 3 seconds
    good: 6, // Under 6 seconds
    average: 10, // Under 10 seconds
  }

  // Speed bonus multipliers
  private static readonly SPEED_BONUSES = {
    excellent: 0.5, // +50% bonus
    good: 0.25, // +25% bonus
    average: 0.1, // +10% bonus
    slow: 0, // No bonus
  }

  // Accuracy bonus thresholds
  private static readonly ACCURACY_BONUSES = {
    perfect: { threshold: 100, bonus: 0.5 }, // 100% = +50%
    excellent: { threshold: 90, bonus: 0.3 }, // 90%+ = +30%
    good: { threshold: 75, bonus: 0.15 }, // 75%+ = +15%
    average: { threshold: 60, bonus: 0.05 }, // 60%+ = +5%
  }

  // Win bonus for multiplayer games
  private static readonly WIN_BONUS_MULTIPLIER = 0.25 // +25% for winning

  static calculateXP(params: XPCalculationParams): XPBreakdown {
    const { correctAnswers, totalAnswers, averageTimeMs, difficulty, gameMode, isWinner = false } = params

    // Base XP calculation
    const baseXP = correctAnswers * this.BASE_XP_PER_CORRECT

    // Difficulty multiplier
    const difficultyMultiplier = this.DIFFICULTY_MULTIPLIERS[difficulty]
    const difficultyXP = baseXP * (difficultyMultiplier - 1)

    // Speed bonus calculation
    const averageTimeSeconds = averageTimeMs / 1000
    const speedBonus = this.calculateSpeedBonus(baseXP, averageTimeSeconds)

    // Accuracy bonus calculation
    const accuracy = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0
    const accuracyBonus = this.calculateAccuracyBonus(baseXP, accuracy)

    // Win bonus for multiplayer games
    const winBonus = gameMode === "ranked" && isWinner ? baseXP * this.WIN_BONUS_MULTIPLIER : 0

    // Total XP
    const totalXP = Math.round(baseXP + difficultyXP + speedBonus + accuracyBonus + winBonus)

    return {
      baseXP,
      difficultyMultiplier,
      speedBonus: Math.round(speedBonus),
      accuracyBonus: Math.round(accuracyBonus),
      winBonus: Math.round(winBonus),
      totalXP,
      breakdown: {
        base: `${correctAnswers} correct × ${this.BASE_XP_PER_CORRECT} XP = ${baseXP} XP`,
        difficulty: `${difficulty} difficulty × ${difficultyMultiplier} = +${Math.round(difficultyXP)} XP`,
        speed: this.getSpeedBonusDescription(averageTimeSeconds, Math.round(speedBonus)),
        accuracy: this.getAccuracyBonusDescription(accuracy, Math.round(accuracyBonus)),
        win: isWinner && gameMode === "ranked" ? `Victory bonus = +${Math.round(winBonus)} XP` : "",
      },
    }
  }

  private static calculateSpeedBonus(baseXP: number, averageTimeSeconds: number): number {
    if (averageTimeSeconds <= this.SPEED_THRESHOLDS.excellent) {
      return baseXP * this.SPEED_BONUSES.excellent
    } else if (averageTimeSeconds <= this.SPEED_THRESHOLDS.good) {
      return baseXP * this.SPEED_BONUSES.good
    } else if (averageTimeSeconds <= this.SPEED_THRESHOLDS.average) {
      return baseXP * this.SPEED_BONUSES.average
    }
    return 0
  }

  private static calculateAccuracyBonus(baseXP: number, accuracy: number): number {
    if (accuracy >= this.ACCURACY_BONUSES.perfect.threshold) {
      return baseXP * this.ACCURACY_BONUSES.perfect.bonus
    } else if (accuracy >= this.ACCURACY_BONUSES.excellent.threshold) {
      return baseXP * this.ACCURACY_BONUSES.excellent.bonus
    } else if (accuracy >= this.ACCURACY_BONUSES.good.threshold) {
      return baseXP * this.ACCURACY_BONUSES.good.bonus
    } else if (accuracy >= this.ACCURACY_BONUSES.average.threshold) {
      return baseXP * this.ACCURACY_BONUSES.average.bonus
    }
    return 0
  }

  private static getSpeedBonusDescription(averageTimeSeconds: number, bonus: number): string {
    if (averageTimeSeconds <= this.SPEED_THRESHOLDS.excellent) {
      return `Lightning fast (${averageTimeSeconds.toFixed(1)}s avg) = +${bonus} XP`
    } else if (averageTimeSeconds <= this.SPEED_THRESHOLDS.good) {
      return `Quick responses (${averageTimeSeconds.toFixed(1)}s avg) = +${bonus} XP`
    } else if (averageTimeSeconds <= this.SPEED_THRESHOLDS.average) {
      return `Good speed (${averageTimeSeconds.toFixed(1)}s avg) = +${bonus} XP`
    }
    return `No speed bonus (${averageTimeSeconds.toFixed(1)}s avg)`
  }

  private static getAccuracyBonusDescription(accuracy: number, bonus: number): string {
    if (accuracy >= this.ACCURACY_BONUSES.perfect.threshold) {
      return `Perfect accuracy (${accuracy.toFixed(0)}%) = +${bonus} XP`
    } else if (accuracy >= this.ACCURACY_BONUSES.excellent.threshold) {
      return `Excellent accuracy (${accuracy.toFixed(0)}%) = +${bonus} XP`
    } else if (accuracy >= this.ACCURACY_BONUSES.good.threshold) {
      return `Good accuracy (${accuracy.toFixed(0)}%) = +${bonus} XP`
    } else if (accuracy >= this.ACCURACY_BONUSES.average.threshold) {
      return `Decent accuracy (${accuracy.toFixed(0)}%) = +${bonus} XP`
    }
    return `No accuracy bonus (${accuracy.toFixed(0)}%)`
  }
}
