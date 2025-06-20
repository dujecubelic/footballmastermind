"use client"

import { useState, useEffect } from "react"
import { X, Circle, HelpCircle, Trophy, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { TicTacToeApi, type GameCategory, type PlayerSolution } from "@/lib/api/tictactoe-api"

type CellValue = "X" | "O" | null
type GameMode = "training"

interface FootballTicTacToeProps {
  gameMode: GameMode
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
  playerName?: string
  rowCategory: GameCategory
  colCategory: GameCategory
}

export function FootballTicTacToe({ gameMode, onGameComplete }: FootballTicTacToeProps) {
  const { toast } = useToast()
  const [grid, setGrid] = useState<GridCell[][]>([])
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [playerInput, setPlayerInput] = useState("")
  const [showPlayerDialog, setShowPlayerDialog] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState<"X" | "O" | "draw" | null>(null)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<{ correct: boolean }[]>([])
  const [showHelp, setShowHelp] = useState(false)
  const [rowCategories, setRowCategories] = useState<GameCategory[]>([])
  const [colCategories, setColCategories] = useState<GameCategory[]>([])
  const [cellSolutions, setCellSolutions] = useState<Map<string, PlayerSolution[]>>(new Map())
  const [loading, setLoading] = useState(true)
  const [validating, setValidating] = useState(false)

  // Initialize the game
  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = async () => {
    try {
      setLoading(true)

      // Get categories from backend
      const categoriesData = await TicTacToeApi.getCategories()
      setRowCategories(categoriesData.rowCategories)
      setColCategories(categoriesData.colCategories)

      // Initialize grid with categories
      const newGrid: GridCell[][] = []
      for (let i = 0; i < 3; i++) {
        const row: GridCell[] = []
        for (let j = 0; j < 3; j++) {
          row.push({
            value: null,
            rowCategory: categoriesData.rowCategories[i],
            colCategory: categoriesData.colCategories[j],
          })
        }
        newGrid.push(row)
      }
      setGrid(newGrid)

      // Pre-load solutions for all cells
      await loadAllCellSolutions(categoriesData.rowCategories, categoriesData.colCategories)
    } catch (error) {
      console.error("Failed to initialize game:", error)
      toast({
        title: "Error",
        description: "Failed to load game data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadAllCellSolutions = async (rows: GameCategory[], cols: GameCategory[]) => {
    const solutionsMap = new Map<string, PlayerSolution[]>()

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cellKey = `${rows[i].id}-${rows[i].name}-${cols[j].id}-${cols[j].name}`
        try {
          const solutionsData = await TicTacToeApi.getCellSolutions(rows[i].id, rows[i].name, cols[j].id, cols[j].name)
          solutionsMap.set(cellKey, solutionsData.solutions)
        } catch (error) {
          console.error(`Failed to load solutions for ${rows[i].name} × ${cols[j].name}:`, error)
          solutionsMap.set(cellKey, [])
        }
      }
    }

    setCellSolutions(solutionsMap)
  }

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (grid[rowIndex][colIndex].value !== null || gameOver || loading) {
      return
    }

    setSelectedCell({ row: rowIndex, col: colIndex })
    setPlayerInput("")
    setShowPlayerDialog(true)
  }

  const handleSubmitPlayer = async () => {
    if (!selectedCell || !playerInput.trim()) return

    setValidating(true)

    try {
      const cell = grid[selectedCell.row][selectedCell.col]
      const result = await TicTacToeApi.validateAnswer(
        cell.rowCategory.id,
        cell.rowCategory.name,
        cell.colCategory.id,
        cell.colCategory.name,
        playerInput.trim(),
      )

      if (result.correct) {
        // Correct answer - place the mark
        const newGrid = [...grid]
        newGrid[selectedCell.row][selectedCell.col] = {
          ...cell,
          value: currentPlayer,
          playerName: playerInput.trim(),
        }
        setGrid(newGrid)

        // Record the answer
        setAnswers([...answers, { correct: true }])
        setScore(score + 1)

        toast({
          title: "Correct!",
          description: `${playerInput.trim()} is correct!`,
        })

        // Check for winner
        const gameWinner = checkWinner(newGrid)
        if (gameWinner) {
          handleGameOver(gameWinner)
        } else {
          // Switch player
          setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
        }

        setShowPlayerDialog(false)
      } else {
        // Incorrect answer
        setAnswers([...answers, { correct: false }])

        toast({
          title: "Incorrect",
          description: "That player doesn't match both categories. Try again!",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to validate answer:", error)
      toast({
        title: "Error",
        description: "Failed to validate answer",
        variant: "destructive",
      })
    } finally {
      setValidating(false)
    }
  }

  const checkWinner = (grid: GridCell[][]): "X" | "O" | "draw" | null => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (grid[i][0].value && grid[i][0].value === grid[i][1].value && grid[i][0].value === grid[i][2].value) {
        return grid[i][0].value
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (grid[0][i].value && grid[0][i].value === grid[1][i].value && grid[0][i].value === grid[2][i].value) {
        return grid[0][i].value
      }
    }

    // Check diagonals
    if (grid[0][0].value && grid[0][0].value === grid[1][1].value && grid[0][0].value === grid[2][2].value) {
      return grid[0][0].value
    }

    if (grid[0][2].value && grid[0][2].value === grid[1][1].value && grid[0][2].value === grid[2][0].value) {
      return grid[0][2].value
    }

    // Check for draw (all cells filled)
    const allFilled = grid.every((row) => row.every((cell) => cell.value !== null))
    if (allFilled) {
      return "draw"
    }

    return null
  }

  const handleGameOver = (result: "X" | "O" | "draw") => {
    setWinner(result)
    setGameOver(true)

    const correctAnswers = answers.filter((a) => a.correct).length
    const totalAnswers = answers.length

    if (onGameComplete) {
      onGameComplete({
        winner: result,
        score,
        correctAnswers,
        totalAnswers,
      })
    }

    toast({
      title: result === "draw" ? "It's a draw!" : `Player ${result} wins!`,
      description: `You answered ${correctAnswers} out of ${totalAnswers} questions correctly.`,
    })
  }

  const getCategoryDisplayName = (categoryId: string): string => {
    switch (categoryId) {
      case "club":
        return "Club"
      case "country":
        return "Country"
      case "trophy":
        return "Trophy"
      case "league":
        return "League"
      case "position":
        return "Position"
      case "year":
        return "Year"
      default:
        return "Category"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading game...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Badge variant={currentPlayer === "X" ? "default" : "outline"} className="px-3 py-1">
            <X className={`h-4 w-4 ${currentPlayer === "X" ? "text-white" : "text-gray-500"} mr-1`} />
            Player X
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
            Player O
            <Circle className={`h-4 w-4 ${currentPlayer === "O" ? "text-white" : "text-gray-500"} ml-1`} />
          </Badge>
        </div>
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          {/* Grid headers */}
          <div className="grid grid-cols-4 gap-2 mb-2">
            <div className="col-span-1"></div>
            {colCategories.map((category, colIndex) => (
              <div
                key={`header-${colIndex}`}
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 border border-gray-200"
              >
                {/* Placeholder for image */}
                <div className="w-8 h-8 bg-gray-200 rounded-full mb-2 flex items-center justify-center">
                  <span className="text-xs text-gray-500">IMG</span>
                </div>
                <div className="text-center">
                  <span className="text-xs font-medium text-gray-600">{getCategoryDisplayName(category.id)}</span>
                  <p className="text-sm font-bold truncate max-w-full" title={category.name}>
                    {category.name}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Game grid */}
          {grid.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="grid grid-cols-4 gap-2 mb-2">
              {/* Row header */}
              <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 border border-gray-200">
                {/* Placeholder for image */}
                <div className="w-8 h-8 bg-gray-200 rounded-full mb-2 flex items-center justify-center">
                  <span className="text-xs text-gray-500">IMG</span>
                </div>
                <div className="text-center">
                  <span className="text-xs font-medium text-gray-600">
                    {getCategoryDisplayName(rowCategories[rowIndex]?.id)}
                  </span>
                  <p className="text-sm font-bold truncate max-w-full" title={rowCategories[rowIndex]?.name}>
                    {rowCategories[rowIndex]?.name}
                  </p>
                </div>
              </div>

              {/* Row cells */}
              {row.map((cell, colIndex) => (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={`aspect-square flex flex-col items-center justify-center border rounded-lg p-2 cursor-pointer ${
                    cell.value ? "cursor-not-allowed" : "hover:bg-gray-50"
                  } bg-white border-gray-200`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell.value ? (
                    <div className="text-center">
                      {cell.value === "X" ? (
                        <X className="h-8 w-8 text-blue-500 mx-auto" />
                      ) : (
                        <Circle className="h-8 w-8 text-red-500 mx-auto" />
                      )}
                      {cell.playerName && (
                        <p className="text-xs mt-1 font-medium truncate max-w-full" title={cell.playerName}>
                          {cell.playerName}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Click to play</p>
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
                <AlertDescription>{winner === "draw" ? "It's a draw!" : `Player ${winner} wins!`}</AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Player Input Dialog */}
      <Dialog open={showPlayerDialog} onOpenChange={setShowPlayerDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Name a Football Player</DialogTitle>
            <DialogDescription>Enter a player who matches both categories for this cell</DialogDescription>
          </DialogHeader>

          {selectedCell && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-2 px-2 py-1 bg-white rounded border">
                    <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-500">•</span>
                    </div>
                    <span className="text-sm font-medium">{rowCategories[selectedCell.row]?.name}</span>
                  </div>
                  <span className="text-gray-500">×</span>
                  <div className="flex items-center gap-2 px-2 py-1 bg-white rounded border">
                    <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-500">•</span>
                    </div>
                    <span className="text-sm font-medium">{colCategories[selectedCell.col]?.name}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Name a player who {getPlayerPrompt(rowCategories[selectedCell.row], colCategories[selectedCell.col])}
                </p>
              </div>

              <div className="space-y-2">
                <Input
                  placeholder="Enter player name..."
                  value={playerInput}
                  onChange={(e) => setPlayerInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSubmitPlayer()}
                  disabled={validating}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button onClick={handleSubmitPlayer} disabled={!playerInput.trim() || validating} className="w-full">
              {validating ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Checking...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-1" />
                  Submit
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How to Play Football Tic-Tac-Toe</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p>Football Tic-Tac-Toe combines the classic game with football knowledge.</p>

            <div className="space-y-2">
              <h4 className="font-medium">Game Rules:</h4>
              <ul className="space-y-2 list-disc pl-5">
                <li>Each cell represents the intersection of two football categories.</li>
                <li>To place your mark (X or O), name a player who fits both categories.</li>
                <li>For example, for "Barcelona × Bayern", name a player who played for both clubs.</li>
                <li>If correct, your mark and the player name appear in the cell.</li>
                <li>If incorrect, you lose your turn.</li>
                <li>Get three marks in a row (horizontally, vertically, or diagonally) to win!</li>
              </ul>
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

// Helper function to generate a prompt based on the categories
function getPlayerPrompt(rowCategory: GameCategory, colCategory: GameCategory): string {
  if (rowCategory.id === "club" && colCategory.id === "club") {
    return `played for both ${rowCategory.name} and ${colCategory.name}`
  } else if (rowCategory.id === "country" && colCategory.id === "club") {
    return `is from ${rowCategory.name} and played for ${colCategory.name}`
  } else if (rowCategory.id === "club" && colCategory.id === "country") {
    return `played for ${rowCategory.name} and is from ${colCategory.name}`
  } else if (rowCategory.id === "country" && colCategory.id === "trophy") {
    return `is from ${rowCategory.name} and won the ${colCategory.name}`
  } else if (rowCategory.id === "trophy" && colCategory.id === "country") {
    return `won the ${rowCategory.name} and is from ${colCategory.name}`
  } else if (rowCategory.id === "club" && colCategory.id === "trophy") {
    return `played for ${rowCategory.name} and won the ${colCategory.name}`
  } else if (rowCategory.id === "trophy" && colCategory.id === "club") {
    return `won the ${rowCategory.name} and played for ${colCategory.name}`
  } else {
    return `matches both ${rowCategory.name} and ${colCategory.name}`
  }
}
