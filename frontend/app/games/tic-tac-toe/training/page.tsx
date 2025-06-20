"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Brain, Trophy, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FootballTicTacToe, type GameResult } from "@/components/games/football-tic-tac-toe"

export default function TicTacToeTrainingPage() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameResult, setGameResult] = useState<GameResult | null>(null)
  const [key, setKey] = useState(0) // Used to force re-render of the game component

  const handleStartGame = () => {
    setGameStarted(true)
    setGameResult(null)
  }

  const handleGameComplete = (result: GameResult) => {
    setGameResult(result)
  }

  const handlePlayAgain = () => {
    setGameResult(null)
    setKey((prev) => prev + 1) // Force re-render of the game component
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
          <h1 className="text-3xl font-bold text-white ml-4">Football Tic-Tac-Toe</h1>
        </div>

        {!gameStarted ? (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Training Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="p-6 rounded-full bg-blue-100">
                    <Brain className="h-12 w-12 text-blue-600" />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-medium mb-2">Football Tic-Tac-Toe</h3>
                  <p className="text-muted-foreground mb-6">
                    Test your football knowledge by naming players who fit category intersections!
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">How to Play:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="bg-green-100 text-green-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            1
                          </span>
                          <span>Click on any cell to see the category intersection</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-green-100 text-green-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            2
                          </span>
                          <span>Type the name of a player who fits both categories</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-green-100 text-green-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            3
                          </span>
                          <span>If correct, your mark (X or O) is placed with the player name</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-green-100 text-green-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            4
                          </span>
                          <span>Get three in a row to win!</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleStartGame} className="w-full bg-green-600 hover:bg-green-700">
                Start Training
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <FootballTicTacToe key={key} gameMode="training" onGameComplete={handleGameComplete} />
              </CardContent>

              {gameResult && (
                <CardFooter className="flex flex-col gap-4 border-t pt-6">
                  <div className="w-full bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-lg">Training Results</h3>
                        <p className="text-sm text-muted-foreground">
                          {gameResult.winner === "draw" ? "Game ended in a draw!" : `Player ${gameResult.winner} wins!`}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <Badge variant="outline" className="bg-green-50 px-2 py-1">
                            <Trophy className="h-3 w-3 mr-1 text-green-600" />
                            <span className="text-green-600">{gameResult.score} points</span>
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">Score</p>
                        </div>

                        <div className="text-center">
                          <Badge variant="outline" className="bg-blue-50 px-2 py-1">
                            <span className="text-blue-600">
                              {gameResult.correctAnswers}/{gameResult.totalAnswers}
                            </span>
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">Correct</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 w-full">
                    <Button onClick={handlePlayAgain} className="flex-1">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Play Again
                    </Button>
                    <Link href="/games" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Back to Games
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
