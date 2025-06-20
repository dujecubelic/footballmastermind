"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Brain, Play, Trophy, Clock, Target, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { TriviaApi, type TriviaQuestion, type QuestionResult } from "@/lib/api/trivia-api"
import { GameStatsApi } from "@/lib/api/game-stats-api"
import { XPCalculator, type XPBreakdown } from "@/lib/utils/xp-calculator"
import { useAuth } from "@/lib/auth/auth-context"

type GameState = "setup" | "loading" | "playing" | "results"

const PREDEFINED_CATEGORIES = [
  "Premier League",
  "Champions League",
  "World Cup",
  "2000s Football",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Football Legends",
  "Custom",
]

export default function TriviaTrainingPage() {
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  const [gameState, setGameState] = useState<GameState>("setup")
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [customCategory, setCustomCategory] = useState("")
  const [questions, setQuestions] = useState<TriviaQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [results, setResults] = useState<QuestionResult[]>([])
  const [questionStartTime, setQuestionStartTime] = useState<number>(0)
  const [sessionStartTime, setSessionStartTime] = useState<number>(0)
  const [showResult, setShowResult] = useState(false)
  const [lastResult, setLastResult] = useState<QuestionResult | null>(null)
  const [xpBreakdown, setXpBreakdown] = useState<XPBreakdown | null>(null)
  const [submittingStats, setSubmittingStats] = useState(false)

  const handleStartTraining = async () => {
    const category = selectedCategory === "Custom" ? customCategory : selectedCategory

    if (!category.trim()) {
      toast({
        title: "Error",
        description: "Please select or enter a category",
        variant: "destructive",
      })
      return
    }

    setGameState("loading")

    try {
      const response = await TriviaApi.generateQuestions(category, difficulty)
      setQuestions(response.questions)
      setCurrentQuestionIndex(0)
      setResults([])
      setSessionStartTime(Date.now())
      setQuestionStartTime(Date.now())
      setGameState("playing")

      toast({
        title: "Questions Generated!",
        description: `Ready to start ${category} trivia`,
      })
    } catch (error) {
      console.error("Failed to generate questions:", error)
      toast({
        title: "Error",
        description: "Failed to generate questions. Please try again.",
        variant: "destructive",
      })
      setGameState("setup")
    }
  }

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return

    const currentQuestion = questions[currentQuestionIndex]
    const timeSpent = Date.now() - questionStartTime
    const isCorrect = TriviaApi.checkAnswer(userAnswer, currentQuestion.correctAnswer)

    const result: QuestionResult = {
      questionId: currentQuestion.id,
      userAnswer: userAnswer.trim(),
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timeSpent,
    }

    setResults([...results, result])
    setLastResult(result)
    setShowResult(true)

    // Show result for 2 seconds, then move to next question
    setTimeout(() => {
      setShowResult(false)
      setUserAnswer("")

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setQuestionStartTime(Date.now())
      } else {
        // Game finished
        handleGameComplete([...results, result])
      }
    }, 2000)
  }

  const handleGameComplete = async (finalResults: QuestionResult[]) => {
    const correctCount = finalResults.filter((r) => r.isCorrect).length
    const totalQuestions = questions.length
    const averageTime = finalResults.reduce((sum, r) => sum + r.timeSpent, 0) / finalResults.length
    const accuracy = (correctCount / totalQuestions) * 100

    // Calculate XP breakdown
    const xpCalc = XPCalculator.calculateXP({
      correctAnswers: correctCount,
      totalAnswers: totalQuestions,
      averageTimeMs: averageTime,
      difficulty,
      gameMode: "training",
    })

    setXpBreakdown(xpCalc)

    // Submit stats to backend if user is authenticated
    if (isAuthenticated) {
      setSubmittingStats(true)
      try {
        const category = selectedCategory === "Custom" ? customCategory : selectedCategory
        const sessionDuration = Date.now() - sessionStartTime

        await GameStatsApi.submitGameStats({
          gameMode: "training",
          gameType: "trivia",
          difficulty,
          category,
          correctAnswers: correctCount,
          totalAnswers: totalQuestions,
          averageTimeMs: Math.round(averageTime),
          accuracy,
          xpEarned: xpCalc.totalXP,
          sessionDurationMs: sessionDuration,
        })

        toast({
          title: "Stats Saved!",
          description: `Earned ${xpCalc.totalXP} XP`,
        })
      } catch (error) {
        console.error("Failed to submit stats:", error)
        toast({
          title: "Warning",
          description: "Game completed but stats couldn't be saved",
          variant: "destructive",
        })
      } finally {
        setSubmittingStats(false)
      }
    }

    setGameState("results")
  }

  const handlePlayAgain = () => {
    setGameState("setup")
    setCurrentQuestionIndex(0)
    setResults([])
    setQuestions([])
    setUserAnswer("")
    setShowResult(false)
    setLastResult(null)
    setXpBreakdown(null)
  }

  const getAverageTime = () => {
    if (results.length === 0) return 0
    const totalTime = results.reduce((sum, result) => sum + result.timeSpent, 0)
    return Math.round((totalTime / results.length / 1000) * 10) / 10 // Round to 1 decimal place
  }

  const getCorrectCount = () => {
    return results.filter((result) => result.isCorrect).length
  }

  if (gameState === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-950 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/games">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Games
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-white ml-4">Trivia Training</h1>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Setup Your Training</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="p-6 rounded-full bg-green-100">
                    <Brain className="h-12 w-12 text-green-600" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category" className="text-base font-medium">
                      Category
                    </Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger id="category" className="mt-1">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {(isAuthenticated
                          ? PREDEFINED_CATEGORIES
                          : PREDEFINED_CATEGORIES.filter((cat) => cat !== "Custom")
                        ).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {!isAuthenticated && (
                    <p className="text-sm text-muted-foreground mt-1">
                      <strong>Sign in</strong> to unlock custom categories and save your progress!
                    </p>
                  )}

                  {selectedCategory === "Custom" && (
                    <div>
                      <Label htmlFor="custom-category" className="text-base font-medium">
                        Custom Category
                      </Label>
                      <Input
                        id="custom-category"
                        placeholder="Enter your custom category (e.g., 'Italian Football', 'Messi Career')"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="difficulty" className="text-base font-medium">
                      Difficulty Level
                    </Label>
                    <Select
                      value={difficulty}
                      onValueChange={(value) => setDifficulty(value as "easy" | "medium" | "hard")}
                    >
                      <SelectTrigger id="difficulty" className="mt-1">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy (1.0x XP)</SelectItem>
                        <SelectItem value="medium">Medium (1.5x XP)</SelectItem>
                        <SelectItem value="hard">Hard (2.0x XP)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">
                      {difficulty === "easy"
                        ? "Basic questions for beginners"
                        : difficulty === "medium"
                          ? "Moderate challenge for regular fans"
                          : "Advanced questions for football experts"}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      XP Rewards:
                    </h4>
                    <ul className="text-sm space-y-1">
                      <li>• Base: 10 XP per correct answer</li>
                      <li>• Speed bonus: Up to +50% for quick answers</li>
                      <li>• Accuracy bonus: Up to +50% for high accuracy</li>
                      <li>
                        • Difficulty multiplier:{" "}
                        {difficulty === "easy" ? "1.0x" : difficulty === "medium" ? "1.5x" : "2.0x"}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleStartTraining}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!selectedCategory || (selectedCategory === "Custom" && !customCategory.trim())}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Training
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  if (gameState === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-950 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/games">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Games
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-white ml-4">Trivia Training</h1>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <h3 className="text-xl font-medium mb-2">Generating Questions...</h3>
                <p className="text-muted-foreground">
                  Creating personalized trivia questions for{" "}
                  {selectedCategory === "Custom" ? customCategory : selectedCategory}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (gameState === "playing") {
    const currentQuestion = questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-950 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/games">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Games
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-white ml-4">Trivia Training</h1>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {selectedCategory === "Custom" ? customCategory : selectedCategory} • {difficulty}
                  </p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {getCorrectCount()}/{results.length} correct
                </Badge>
              </div>
              <Progress value={progress} className="mt-4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-medium mb-4">{currentQuestion.question}</h3>
                </div>

                {!showResult && (
                  <div className="space-y-4">
                    <Input
                      placeholder="Type your answer here..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSubmitAnswer()}
                      className="text-lg p-4"
                      autoFocus
                    />
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={!userAnswer.trim()}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Submit Answer
                    </Button>
                  </div>
                )}

                {showResult && lastResult && (
                  <Alert variant={lastResult.isCorrect ? "default" : "destructive"}>
                    <Trophy className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium">{lastResult.isCorrect ? "Correct!" : "Incorrect"}</p>
                        <p>
                          <strong>Your answer:</strong> {lastResult.userAnswer}
                        </p>
                        <p>
                          <strong>Correct answer:</strong> {lastResult.correctAnswer}
                        </p>
                        <p>
                          <strong>Time:</strong> {(lastResult.timeSpent / 1000).toFixed(1)}s
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (gameState === "results") {
    const correctCount = getCorrectCount()
    const totalQuestions = questions.length
    const averageTime = getAverageTime()
    const accuracy = Math.round((correctCount / totalQuestions) * 100)

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-950 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/games">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Games
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-white ml-4">Trivia Training</h1>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Training Complete!</CardTitle>
              {submittingStats && <p className="text-center text-muted-foreground">Saving your progress...</p>}
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="p-6 rounded-full bg-green-100">
                    <Trophy className="h-12 w-12 text-green-600" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">
                      {correctCount}/{totalQuestions}
                    </p>
                    <p className="text-sm text-muted-foreground">Questions Correct</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <Trophy className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{accuracy}%</p>
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-orange-600">{averageTime}s</p>
                    <p className="text-sm text-muted-foreground">Average Time</p>
                  </div>
                </div>

                {xpBreakdown && (
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-lg flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        XP Breakdown
                      </h4>
                      <Badge className="bg-yellow-500 text-white text-lg px-3 py-1">+{xpBreakdown.totalXP} XP</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>{xpBreakdown.breakdown.base}</span>
                        <span className="font-medium">+{xpBreakdown.baseXP} XP</span>
                      </div>
                      {xpBreakdown.difficultyMultiplier > 1 && (
                        <div className="flex justify-between">
                          <span>{xpBreakdown.breakdown.difficulty}</span>
                          <span className="font-medium text-purple-600">+{xpBreakdown.speedBonus} XP</span>
                        </div>
                      )}
                      {xpBreakdown.speedBonus > 0 && (
                        <div className="flex justify-between">
                          <span>{xpBreakdown.breakdown.speed}</span>
                          <span className="font-medium text-blue-600">+{xpBreakdown.speedBonus} XP</span>
                        </div>
                      )}
                      {xpBreakdown.accuracyBonus > 0 && (
                        <div className="flex justify-between">
                          <span>{xpBreakdown.breakdown.accuracy}</span>
                          <span className="font-medium text-green-600">+{xpBreakdown.accuracyBonus} XP</span>
                        </div>
                      )}
                      {xpBreakdown.winBonus > 0 && (
                        <div className="flex justify-between">
                          <span>{xpBreakdown.breakdown.win}</span>
                          <span className="font-medium text-yellow-600">+{xpBreakdown.winBonus} XP</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Question Breakdown:</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {results.map((result, index) => (
                      <div key={result.questionId} className="flex justify-between items-center p-2 bg-white rounded">
                        <span className="text-sm">Q{index + 1}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant={result.isCorrect ? "default" : "destructive"}>
                            {result.isCorrect ? "✓" : "✗"}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{(result.timeSpent / 1000).toFixed(1)}s</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {!isAuthenticated && (
                  <Alert>
                    <Zap className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Create an account</strong> to save your progress and track your XP gains!
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button onClick={handlePlayAgain} className="flex-1 bg-green-600 hover:bg-green-700">
                Play Again
              </Button>
              <Link href="/games" className="flex-1">
                <Button variant="outline" className="w-full">
                  Back to Games
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return null
}
