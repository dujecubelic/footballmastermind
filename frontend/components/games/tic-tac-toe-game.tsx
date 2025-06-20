"use client"

import { useState, useEffect } from "react"
import { X, Circle, HelpCircle, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {
  type FootballCategory,
  type FootballItem,
  getRandomItemsFromCategory,
  generateQuestionForItem,
} from "@/lib/game/football-data"

type CellValue = "X" | "O" | null
type GameMode = "multiplayer" | "training"

interface TicTacToeGameProps {
  gameMode: GameMode
  difficulty?: "easy" | "medium" | "hard"
  onGameComplete?: (result: GameResult) => void
}

export interface GameResult {
  winner: "X" | "O" | "draw" | null
  score: number
  correctAnswers: number
  totalAnswers: number
}

interface GridCell {
  value: CellValue
  item: FootballItem
}

interface GridRow {
  category: FootballCategory
  cells: GridCell[]
}

export function TicTacToeGame({ gameMode, difficulty = "medium", onGameComplete }: TicTacToeGameProps) {
  const { toast } = useToast()
  const [grid, setGrid] = useState<GridRow[]>([])
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<{
    question: string
    options: { id: string; text: string }[]
    correctAnswerId: string
  } | null>(null)
  const [showQuestion, setShowQuestion] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState<"X" | "O" | "draw" | null>(null)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<{ correct: boolean }[]>([])
  const [showHelp, setShowHelp] = useState(false)
  const [isComputerTurn, setIsComputerTurn] = useState(false)

  // Categories for the game
  const categories: FootballCategory[] = ["clubs", "countries", "trophies"]

  // Initialize the game grid
  useEffect(() => {
    initializeGrid()
  }, [])

  // Handle computer's turn in training mode
  useEffect(() => {
    if (gameMode === "training" && currentPlayer === "O" && !gameOver && isComputerTurn) {
      const timer = setTimeout(() => {
        makeComputerMove()
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [currentPlayer, gameOver, isComputerTurn, gameMode])

  const initializeGrid = () => {
    // Create a grid with each row representing a specific category
    const newGrid: GridRow[] = categories.map((category) => {
      // Get 3 random items from this category
      const items = getRandomItemsFromCategory(category, 3, difficulty)

      return {
        category,
        cells: items.map((item) => ({
          value: null,
          item,
        })),
      }
    })

    setGrid(newGrid)
    setCurrentPlayer("X")
    setGameOver(false)
    setWinner(null)
    setScore(0)
    setAnswers([])
  }

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    // Ignore if cell is already filled, game is over, or it's computer's turn
    if (
      grid[rowIndex].cells[colIndex].value !== null ||
      gameOver ||
      (gameMode === "training" && currentPlayer === "O")
    ) {
      return
    }

    // Set the selected cell and show a question
    setSelectedCell({ row: rowIndex, col: colIndex })

    // Generate a question for this item
    const item = grid[rowIndex].cells[colIndex].item
    const question = generateQuestionForItem(item)
    setCurrentQuestion(question)

    // Reset answer state
    setSelectedAnswer(null)
    setShowResult(false)
    setIsCorrect(false)

    // Show the question dialog
    setShowQuestion(true)
  }

  const handleAnswerSelect = (answerId: string) => {
    if (!currentQuestion) return

    setSelectedAnswer(answerId)
    const correct = answerId === currentQuestion.correctAnswerId
    setIsCorrect(correct)

    // Record the answer
    setAnswers([...answers, { correct }])

    // Show the result
    setShowResult(true)

    // Update score if correct
    if (correct) {
      setScore(score + 1)
    }

    // Close the dialog after a delay
    setTimeout(() => {
      // Update the grid if answer is correct
      if (correct && selectedCell) {
        const newGrid = [...grid]
        newGrid[selectedCell.row].cells[selectedCell.col].value = currentPlayer
        setGrid(newGrid)

        // Check for winner
        const gameWinner = checkWinner(newGrid)
        if (gameWinner) {
          handleGameOver(gameWinner)
        } else {
          // Switch player
          const nextPlayer = currentPlayer === "X" ? "O" : "X"
          setCurrentPlayer(nextPlayer)

          // Set computer's turn flag if in training mode
          if (gameMode === "training" && nextPlayer === "O") {
            setIsComputerTurn(true)
          }
        }
      }

      setShowQuestion(false)
    }, 2000)
  }

  const makeComputerMove = () => {
    // Find all empty cells
    const emptyCells: { row: number; col: number }[] = []
    grid.forEach((row, rowIndex) => {
      row.cells.forEach((cell, colIndex) => {
        if (cell.value === null) {
          emptyCells.push({ row: rowIndex, col: colIndex })
        }
      })
    })

    if (emptyCells.length === 0) return

    // Choose a random empty cell
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]

    // Update the grid
    const newGrid = [...grid]
    newGrid[randomCell.row].cells[randomCell.col].value = "O"
    setGrid(newGrid)

    // Check for winner
    const gameWinner = checkWinner(newGrid)
    if (gameWinner) {
      handleGameOver(gameWinner)
    } else {
      // Switch back to player
      setCurrentPlayer("X")
    }

    setIsComputerTurn(false)
  }

  const checkWinner = (grid: GridRow[]): "X" | "O" | "draw" | null => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (
        grid[i].cells[0].value &&
        grid[i].cells[0].value === grid[i].cells[1].value &&
        grid[i].cells[0].value === grid[i].cells[2].value
      ) {
        return grid[i].cells[0].value
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (
        grid[0].cells[i].value &&
        grid[0].cells[i].value === grid[1].cells[i].value &&
        grid[0].cells[i].value === grid[2].cells[i].value
      ) {
        return grid[0].cells[i].value
      }
    }

    // Check diagonals
    if (
      grid[0].cells[0].value &&
      grid[0].cells[0].value === grid[1].cells[1].value &&
      grid[0].cells[0].value === grid[2].cells[2].value
    ) {
      return grid[0].cells[0].value
    }

    if (
      grid[0].cells[2].value &&
      grid[0].cells[2].value === grid[1].cells[1].value &&
      grid[0].cells[2].value === grid[2].cells[0].value
    ) {
      return grid[0].cells[2].value
    }

    // Check for draw (all cells filled)
    const allFilled = grid.every((row) => row.cells.every((cell) => cell.value !== null))
    if (allFilled) {
      return "draw"
    }

    // No winner yet
    return null
  }

  const handleGameOver = (result: "X" | "O" | "draw") => {
    setWinner(result)
    setGameOver(true)

    // Calculate stats
    const correctAnswers = answers.filter((a) => a.correct).length
    const totalAnswers = answers.length

    // Call the onGameComplete callback if provided
    if (onGameComplete) {
      onGameComplete({
        winner: result,
        score,
        correctAnswers,
        totalAnswers,
      })
    }

    // Show toast notification
    toast({
      title: result === "draw" ? "It's a draw!" : result === "X" ? "You win!" : "Computer wins!",
      description: `You answered ${correctAnswers} out of ${totalAnswers} questions correctly.`,
      variant: result === "X" ? "default" : result === "O" ? "destructive" : "default",
    })
  }

  const getCategoryColor = (category: FootballCategory): string => {
    switch (category) {
      case "clubs":
        return "bg-green-100 text-green-800 border-green-200"
      case "countries":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "trophies":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryName = (category: FootballCategory): string => {
    switch (category) {
      case "clubs":
        return "Football Clubs"
      case "countries":
        return "National Teams"
      case "trophies":
        return "Football Trophies"
      default:
        return "Unknown Category"
    }
  }

  const getCategoryIcon = (category: FootballCategory) => {
    switch (category) {
      case "clubs":
        return <span className="text-green-800">⚽</span>
      case "countries":
        return <span className="text-yellow-800">🏆</span>
      case "trophies":
        return <span className="text-blue-800">🥇</span>
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Badge variant={currentPlayer === "X" ? "default" : "outline"} className="px-3 py-1">
            <X className={`h-4 w-4 ${currentPlayer === "X" ? "text-white" : "text-gray-500"} mr-1`} />
            {gameMode === "training" ? "You" : "Player X"}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowHelp(true)}>
            <HelpCircle className="h-4 w-4 mr-1" />
            How to Play
          </Button>

          <Badge variant="outline" className="bg-green-50 text-green-700">
            Score: {score}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={currentPlayer === "O" ? "destructive" : "outline"} className="px-3 py-1">
            {gameMode === "training" ? "Computer" : "Player O"}
            <Circle className={`h-4 w-4 ${currentPlayer === "O" ? "text-white" : "text-gray-500"} ml-1`} />
          </Badge>
        </div>
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          {/* Category headers */}
          <div className="grid grid-cols-4 gap-2 mb-2">
            <div className="col-span-1"></div>
            {grid.length > 0 &&
              grid[0].cells.map((_, colIndex) => (
                <div key={`header-${colIndex}`} className="text-center text-sm font-medium text-gray-500">
                  Column {colIndex + 1}
                </div>
              ))}
          </div>

          {/* Game grid */}
          {grid.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="grid grid-cols-4 gap-2 mb-2">
              {/* Row header */}
              <div className={`flex items-center justify-center p-2 rounded-lg ${getCategoryColor(row.category)}`}>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    {getCategoryIcon(row.category)}
                    <span className="text-sm font-medium">{getCategoryName(row.category)}</span>
                  </div>
                </div>
              </div>

              {/* Row cells */}
              {row.cells.map((cell, colIndex) => (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={`aspect-square flex flex-col items-center justify-center border rounded-lg p-2 cursor-pointer ${
                    cell.value ? "cursor-not-allowed" : "hover:bg-gray-50"
                  } ${getCategoryColor(row.category)}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell.value ? (
                    cell.value === "X" ? (
                      <X className="h-8 w-8 text-blue-500" />
                    ) : (
                      <Circle className="h-8 w-8 text-red-500" />
                    )
                  ) : (
                    <div className="text-center">
                      <p className="text-xs truncate max-w-full" title={cell.item.name}>
                        {cell.item.name}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}

          {gameOver && (
            <div className="mt-4">
              <Alert variant={winner === "X" ? "default" : winner === "O" ? "destructive" : "default"}>
                <Trophy className="h-4 w-4 mr-2" />
                <AlertDescription>
                  {winner === "draw"
                    ? "It's a draw!"
                    : winner === "X"
                      ? `${gameMode === "training" ? "You win" : "Player X wins"}!`
                      : `${gameMode === "training" ? "Computer wins" : "Player O wins"}!`}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Question Dialog */}
      <Dialog open={showQuestion} onOpenChange={setShowQuestion}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Football Question</DialogTitle>
            <DialogDescription>Answer correctly to place your mark in this cell</DialogDescription>
          </DialogHeader>

          {currentQuestion && selectedCell && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getCategoryColor(grid[selectedCell.row].category)}>
                    {getCategoryName(grid[selectedCell.row].category)}
                  </Badge>
                  <span className="font-medium">{grid[selectedCell.row].cells[selectedCell.col].item.name}</span>
                </div>
                <p className="text-lg font-medium">{currentQuestion.question}</p>
              </div>

              <RadioGroup value={selectedAnswer || ""} className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center space-x-2 border p-3 rounded-md ${
                      showResult && option.id === currentQuestion.correctAnswerId
                        ? "bg-green-50 border-green-500"
                        : showResult && selectedAnswer === option.id && !isCorrect
                          ? "bg-red-50 border-red-500"
                          : ""
                    }`}
                  >
                    <RadioGroupItem
                      value={option.id}
                      id={`option-${option.id}`}
                      onClick={() => handleAnswerSelect(option.id)}
                      disabled={selectedAnswer !== null}
                    />
                    <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {showResult && (
                <div
                  className={`mt-4 p-3 rounded-lg text-center ${
                    isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {isCorrect
                    ? "Correct! You can place your mark."
                    : `Incorrect. The correct answer is: ${
                        currentQuestion.options.find((o) => o.id === currentQuestion.correctAnswerId)?.text || ""
                      }`}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Help Dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How to Play Football Tic Tac Toe</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p>Football Tic Tac Toe combines the classic game of Tic Tac Toe with football trivia knowledge.</p>

            <div className="space-y-2">
              <h4 className="font-medium">Game Rules:</h4>
              <ul className="space-y-2 list-disc pl-5">
                <li>Each row represents a different football category: Clubs, Countries, and Trophies.</li>
                <li>To place your mark (X or O), you must correctly answer a question about the item in that cell.</li>
                <li>If you answer incorrectly, you lose your turn and cannot place your mark.</li>
                <li>Get three of your marks in a row (horizontally, vertically, or diagonally) to win the game.</li>
              </ul>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-green-100 p-2 rounded-lg text-center">
                <p className="text-sm font-medium text-green-800">Football Clubs</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-lg text-center">
                <p className="text-sm font-medium text-yellow-800">National Teams</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg text-center">
                <p className="text-sm font-medium text-blue-800">Football Trophies</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowHelp(false)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
