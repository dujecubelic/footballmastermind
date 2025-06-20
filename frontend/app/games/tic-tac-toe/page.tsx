"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Grid, X, Circle, RefreshCw, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

type CellValue = "X" | "O" | null
type GameBoard = CellValue[][]
type CategoryType = "clubs" | "countries" | "trophies"

interface Category {
  name: string
  type: CategoryType
  items: string[]
}

export default function FootballTicTacToe() {
  const [gameState, setGameState] = useState<"rules" | "playing" | "results">("rules")
  const [board, setBoard] = useState<GameBoard>(
    Array(3)
      .fill(null)
      .map(() => Array(3).fill(null)),
  )
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")
  const [winner, setWinner] = useState<"X" | "O" | "draw" | null>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<{ row: number; col: number } | null>(null)
  const [answeredCells, setAnsweredCells] = useState<Set<string>>(new Set())

  // Categories for the game
  const categories: Category[] = [
    {
      name: "Football Clubs",
      type: "clubs",
      items: [
        "Manchester United",
        "Barcelona",
        "Bayern Munich",
        "Real Madrid",
        "Liverpool",
        "AC Milan",
        "PSG",
        "Juventus",
        "Ajax",
      ],
    },
    {
      name: "National Teams",
      type: "countries",
      items: ["Brazil", "Germany", "Argentina", "France", "Italy", "Spain", "England", "Netherlands", "Portugal"],
    },
    {
      name: "Football Trophies",
      type: "trophies",
      items: [
        "Champions League",
        "World Cup",
        "Premier League",
        "La Liga",
        "Bundesliga",
        "Serie A",
        "Copa America",
        "Euros",
        "FA Cup",
      ],
    },
  ]

  const handleStartGame = () => {
    setGameState("playing")
    resetGame()
  }

  const resetGame = () => {
    setBoard(
      Array(3)
        .fill(null)
        .map(() => Array(3).fill(null)),
    )
    setCurrentPlayer("X")
    setWinner(null)
    setSelectedQuestion(null)
    setAnsweredCells(new Set())
  }

  const checkWinner = (board: GameBoard): "X" | "O" | "draw" | null => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
        return board[i][0]
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (board[0][i] && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
        return board[0][i]
      }
    }

    // Check diagonals
    if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
      return board[0][0]
    }
    if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
      return board[0][2]
    }

    // Check for draw
    const isBoardFull = board.every((row) => row.every((cell) => cell !== null))
    if (isBoardFull) return "draw"

    return null
  }

  const handleCellClick = (row: number, col: number) => {
    // If cell is already filled or game is over, do nothing
    if (board[row][col] !== null || winner !== null || answeredCells.has(`${row}-${col}`)) return

    setSelectedQuestion({ row, col })
  }

  const handleAnswerQuestion = (correct: boolean) => {
    if (!selectedQuestion) return

    const { row, col } = selectedQuestion

    if (correct) {
      // Update the board with the current player's mark
      const newBoard = [...board]
      newBoard[row][col] = currentPlayer
      setBoard(newBoard)

      // Check if there's a winner
      const gameWinner = checkWinner(newBoard)
      if (gameWinner) {
        setWinner(gameWinner)
        setGameState("results")
      } else {
        // Switch player
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
      }
    }

    // Mark this cell as answered regardless of correctness
    const newAnsweredCells = new Set(answeredCells)
    newAnsweredCells.add(`${row}-${col}`)
    setAnsweredCells(newAnsweredCells)

    // Clear selected question
    setSelectedQuestion(null)
  }

  const getCategoryForCell = (row: number, col: number): Category => {
    // Rows represent categories
    return categories[row]
  }

  const getItemForCell = (row: number, col: number): string => {
    // Get the specific item from the category
    return categories[row].items[col]
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
          <h1 className="text-3xl font-bold text-white ml-4">Football Tic Tac Toe</h1>
        </div>

        {gameState === "rules" && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">How To Play</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="p-6 rounded-full bg-blue-100">
                    <Grid className="h-12 w-12 text-blue-500" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-center">Football Tic Tac Toe</h3>
                  <p className="text-center text-muted-foreground">
                    A strategic game that combines football knowledge with the classic game of Tic Tac Toe.
                  </p>

                  <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                    <h4 className="font-medium">Game Rules:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="bg-green-100 text-green-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          1
                        </span>
                        <span>
                          The board is a 3×3 grid where each row represents a football category (Clubs, Countries,
                          Trophies)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-green-100 text-green-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          2
                        </span>
                        <span>
                          To place your mark (X or O), you must correctly answer a question about the item in that cell
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-green-100 text-green-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          3
                        </span>
                        <span>If you answer incorrectly, you lose your turn but the cell remains available</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-green-100 text-green-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          4
                        </span>
                        <span>
                          Get three of your marks in a row (horizontally, vertically, or diagonally) to win the game
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <h4 className="font-medium mb-2">Clubs</h4>
                      <p className="text-sm text-muted-foreground">Man Utd, Barcelona, Bayern...</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg text-center">
                      <h4 className="font-medium mb-2">Countries</h4>
                      <p className="text-sm text-muted-foreground">Brazil, Germany, France...</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <h4 className="font-medium mb-2">Trophies</h4>
                      <p className="text-sm text-muted-foreground">World Cup, Champions League...</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleStartGame} className="w-full bg-green-600 hover:bg-green-700">
                Start Game
              </Button>
            </CardFooter>
          </Card>
        )}

        {gameState === "playing" && (
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-full ${
                        currentPlayer === "X" ? "bg-blue-100 ring-2 ring-blue-500" : "bg-gray-100"
                      }`}
                    >
                      <X className={`h-6 w-6 ${currentPlayer === "X" ? "text-blue-500" : "text-gray-400"}`} />
                    </div>
                    <span className={`font-medium ${currentPlayer === "X" ? "text-blue-600" : "text-gray-500"}`}>
                      Player X
                    </span>
                  </div>

                  <Button variant="outline" size="sm" onClick={resetGame} className="gap-1">
                    <RefreshCw className="h-4 w-4" />
                    Reset
                  </Button>

                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${currentPlayer === "O" ? "text-red-600" : "text-gray-500"}`}>
                      Player O
                    </span>
                    <div
                      className={`p-2 rounded-full ${
                        currentPlayer === "O" ? "bg-red-100 ring-2 ring-red-500" : "bg-gray-100"
                      }`}
                    >
                      <Circle className={`h-6 w-6 ${currentPlayer === "O" ? "text-red-500" : "text-gray-400"}`} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-green-100 p-2 rounded-lg text-center">
                    <span className="text-sm font-medium text-green-800">Football Clubs</span>
                  </div>
                  <div className="bg-yellow-100 p-2 rounded-lg text-center">
                    <span className="text-sm font-medium text-yellow-800">National Teams</span>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-lg text-center">
                    <span className="text-sm font-medium text-blue-800">Football Trophies</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`aspect-square flex items-center justify-center border rounded-lg text-lg font-bold cursor-pointer ${
                          answeredCells.has(`${rowIndex}-${colIndex}`) && !cell
                            ? "bg-gray-100 cursor-not-allowed"
                            : "hover:bg-gray-50"
                        } ${
                          rowIndex === 0
                            ? "bg-green-50 border-green-200"
                            : rowIndex === 1
                              ? "bg-yellow-50 border-yellow-200"
                              : "bg-blue-50 border-blue-200"
                        }`}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                      >
                        {cell ? (
                          cell === "X" ? (
                            <X className="h-8 w-8 text-blue-500" />
                          ) : (
                            <Circle className="h-8 w-8 text-red-500" />
                          )
                        ) : (
                          <span className="text-xs text-gray-500">{getItemForCell(rowIndex, colIndex)}</span>
                        )}
                      </div>
                    )),
                  )}
                </div>
              </CardContent>
            </Card>

            {selectedQuestion && (
              <Dialog open={selectedQuestion !== null} onOpenChange={() => setSelectedQuestion(null)}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Football Question</DialogTitle>
                    <DialogDescription>Answer correctly to place your mark in this cell</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          className={
                            selectedQuestion.row === 0
                              ? "bg-green-500"
                              : selectedQuestion.row === 1
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                          }
                        >
                          {getCategoryForCell(selectedQuestion.row, selectedQuestion.col).name}
                        </Badge>
                        <span className="font-medium">
                          {getItemForCell(selectedQuestion.row, selectedQuestion.col)}
                        </span>
                      </div>
                      <p className="text-lg font-medium">
                        {selectedQuestion.row === 0
                          ? `In which year was ${getItemForCell(selectedQuestion.row, selectedQuestion.col)} founded?`
                          : selectedQuestion.row === 1
                            ? `Which player is the all-time top scorer for ${getItemForCell(
                                selectedQuestion.row,
                                selectedQuestion.col,
                              )}?`
                            : `Which team has won the ${getItemForCell(
                                selectedQuestion.row,
                                selectedQuestion.col,
                              )} the most times?`}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        className="p-4 h-auto text-left justify-start"
                        onClick={() => handleAnswerQuestion(false)}
                      >
                        {selectedQuestion.row === 0
                          ? "1902"
                          : selectedQuestion.row === 1
                            ? "Diego Maradona"
                            : "AC Milan"}
                      </Button>
                      <Button
                        variant="outline"
                        className="p-4 h-auto text-left justify-start"
                        onClick={() => handleAnswerQuestion(true)}
                      >
                        {selectedQuestion.row === 0
                          ? "1899"
                          : selectedQuestion.row === 1
                            ? "Lionel Messi"
                            : "Real Madrid"}
                      </Button>
                      <Button
                        variant="outline"
                        className="p-4 h-auto text-left justify-start"
                        onClick={() => handleAnswerQuestion(false)}
                      >
                        {selectedQuestion.row === 0
                          ? "1880"
                          : selectedQuestion.row === 1
                            ? "Cristiano Ronaldo"
                            : "Liverpool"}
                      </Button>
                      <Button
                        variant="outline"
                        className="p-4 h-auto text-left justify-start"
                        onClick={() => handleAnswerQuestion(false)}
                      >
                        {selectedQuestion.row === 0 ? "1905" : selectedQuestion.row === 1 ? "Pelé" : "Bayern Munich"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}

        {gameState === "results" && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {winner === "draw" ? "It's a Draw!" : `Player ${winner} Wins!`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div
                    className={`p-6 rounded-full ${
                      winner === "X" ? "bg-blue-100" : winner === "O" ? "bg-red-100" : "bg-yellow-100"
                    }`}
                  >
                    {winner === "X" ? (
                      <X className="h-12 w-12 text-blue-500" />
                    ) : winner === "O" ? (
                      <Circle className="h-12 w-12 text-red-500" />
                    ) : (
                      <Trophy className="h-12 w-12 text-yellow-500" />
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-lg font-medium">
                    {winner === "draw"
                      ? "Both players demonstrated excellent football knowledge!"
                      : `Player ${winner} demonstrated superior football knowledge!`}
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <p className="font-medium">XP Earned: 150</p>
                  {winner !== "draw" && <p className="text-sm text-green-600">+25 Rank Points</p>}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button onClick={handleStartGame} className="flex-1 bg-green-600 hover:bg-green-700">
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
