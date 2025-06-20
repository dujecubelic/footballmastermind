"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Zap, Clock, User, Users, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function TriviaBattle() {
  const [gameState, setGameState] = useState<"lobby" | "playing" | "results">("lobby")
  const [timeLeft, setTimeLeft] = useState(10)
  const [playerScore, setPlayerScore] = useState(0)
  const [opponentScore, setOpponentScore] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  // Simulate countdown when in playing state
  useEffect(() => {
    if (gameState !== "playing" || timeLeft <= 0) return

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
      if (timeLeft === 1) {
        // Move to next question or end game
        if (currentQuestion < 5) {
          setCurrentQuestion(currentQuestion + 1)
          setTimeLeft(10)
          setSelectedAnswer(null)
        } else {
          setGameState("results")
        }
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [gameState, timeLeft, currentQuestion])

  const handleStartGame = () => {
    setGameState("playing")
    setTimeLeft(10)
    setPlayerScore(0)
    setOpponentScore(0)
    setCurrentQuestion(1)
  }

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value)
    // Simulate scoring - in a real app, this would check if answer is correct
    if (value === "a") {
      setPlayerScore(playerScore + 1)
    } else {
      // Simulate opponent sometimes getting it right
      if (Math.random() > 0.5) {
        setOpponentScore(opponentScore + 1)
      }
    }

    // Move to next question or end game
    setTimeout(() => {
      if (currentQuestion < 5) {
        setCurrentQuestion(currentQuestion + 1)
        setTimeLeft(10)
        setSelectedAnswer(null)
      } else {
        setGameState("results")
      }
    }, 1000)
  }

  const handlePlayAgain = () => {
    setGameState("lobby")
  }

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
          <h1 className="text-3xl font-bold text-white ml-4">Trivia Battle</h1>
        </div>

        {gameState === "lobby" && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Ready to Battle?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="p-6 rounded-full bg-yellow-100">
                    <Zap className="h-12 w-12 text-yellow-500" />
                  </div>
                </div>

                <div className="space-y-4 text-center">
                  <h3 className="text-xl font-medium">How to Play:</h3>
                  <ul className="space-y-2 text-left max-w-md mx-auto">
                    <li className="flex items-start gap-2">
                      <Users className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>You'll compete against another player in real-time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>Answer questions as quickly as possible - first correct answer scores</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>You have 10 seconds to answer each question</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Trophy className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>First to 5 points wins the match</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 text-center">Select Category:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <Button variant="outline" className="border-green-500 bg-white">
                      Premier League
                    </Button>
                    <Button variant="outline" className="border-green-500 bg-white">
                      World Cup
                    </Button>
                    <Button variant="outline" className="border-green-500 bg-white">
                      Champions League
                    </Button>
                    <Button variant="outline" className="border-green-500 bg-white">
                      Football Legends
                    </Button>
                    <Button variant="outline" className="border-green-500 bg-white">
                      Football History
                    </Button>
                    <Button variant="outline" className="border-green-500 bg-white">
                      Random
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleStartGame} className="w-full bg-green-600 hover:bg-green-700">
                Find Opponent
              </Button>
            </CardFooter>
          </Card>
        )}

        {gameState === "playing" && (
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="You" />
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">You</p>
                      <Badge variant="outline" className="bg-green-100">
                        {playerScore} points
                      </Badge>
                    </div>
                  </div>

                  <div className="text-center">
                    <Badge className="px-3 py-1 text-lg font-bold bg-yellow-500">VS</Badge>
                    <p className="text-sm text-muted-foreground mt-1">Question {currentQuestion}/5</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="font-medium">Opponent</p>
                      <Badge variant="outline" className="bg-red-100">
                        {opponentScore} points
                      </Badge>
                    </div>
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Opponent" />
                      <AvatarFallback>Opp</AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Time remaining</span>
                    <span>{timeLeft} seconds</span>
                  </div>
                  <Progress value={(timeLeft / 10) * 100} className="h-2" />
                </div>

                <div className="bg-white p-4 rounded-lg mb-6">
                  <h3 className="text-xl font-medium mb-4 text-center">
                    Which player has won the most Ballon d'Or awards?
                  </h3>

                  <RadioGroup value={selectedAnswer || ""} className="space-y-3">
                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                      <RadioGroupItem
                        value="a"
                        id="a"
                        onClick={() => handleAnswerSelect("a")}
                        disabled={selectedAnswer !== null}
                      />
                      <Label htmlFor="a" className="flex-1 cursor-pointer">
                        Lionel Messi
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                      <RadioGroupItem
                        value="b"
                        id="b"
                        onClick={() => handleAnswerSelect("b")}
                        disabled={selectedAnswer !== null}
                      />
                      <Label htmlFor="b" className="flex-1 cursor-pointer">
                        Cristiano Ronaldo
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                      <RadioGroupItem
                        value="c"
                        id="c"
                        onClick={() => handleAnswerSelect("c")}
                        disabled={selectedAnswer !== null}
                      />
                      <Label htmlFor="c" className="flex-1 cursor-pointer">
                        Michel Platini
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                      <RadioGroupItem
                        value="d"
                        id="d"
                        onClick={() => handleAnswerSelect("d")}
                        disabled={selectedAnswer !== null}
                      />
                      <Label htmlFor="d" className="flex-1 cursor-pointer">
                        Johan Cruyff
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {gameState === "results" && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {playerScore > opponentScore ? "Victory!" : playerScore < opponentScore ? "Defeat!" : "It's a Draw!"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div
                    className={`p-6 rounded-full ${
                      playerScore > opponentScore
                        ? "bg-green-100"
                        : playerScore < opponentScore
                          ? "bg-red-100"
                          : "bg-yellow-100"
                    }`}
                  >
                    {playerScore > opponentScore ? (
                      <Trophy className="h-12 w-12 text-yellow-500" />
                    ) : playerScore < opponentScore ? (
                      <User className="h-12 w-12 text-red-500" />
                    ) : (
                      <Users className="h-12 w-12 text-blue-500" />
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center px-12 py-6 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-lg font-medium">You</p>
                    <p className="text-3xl font-bold text-green-600">{playerScore}</p>
                  </div>

                  <div className="text-xl font-bold text-gray-400">vs</div>

                  <div className="text-center">
                    <p className="text-lg font-medium">Opponent</p>
                    <p className="text-3xl font-bold text-red-600">{opponentScore}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Match Stats:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Correct Answers</p>
                      <p className="text-xl font-bold">{playerScore}/5</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Average Time</p>
                      <p className="text-xl font-bold">3.2s</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <p className="font-medium">XP Earned: 120</p>
                  {playerScore > opponentScore && <p className="text-sm text-green-600">+20 Rank Points</p>}
                </div>
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
        )}
      </div>
    </div>
  )
}
