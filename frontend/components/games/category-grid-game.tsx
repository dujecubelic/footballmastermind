"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Check, HelpCircle, Trophy, X } from "lucide-react"
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
  type FootballPlayer,
  findPlayersByClubAndCountry,
  findPlayersByClubAndTrophy,
  findPlayersByCountryAndTrophy,
  generatePlayerQuestion,
  getUniqueClubs,
  getUniqueCountries,
  getUniqueTrophies,
} from "@/lib/game/football-players-data"

type CategoryType = "clubs" | "countries" | "trophies"
type CellStatus = "empty" | "correct" | "incorrect" | null

interface CategoryGridGameProps {
  difficulty?: "easy" | "medium" | "hard"
  onGameComplete?: (result: GameResult) => void
}

export interface GameResult {
  completed: boolean
  score: number
  correctAnswers: number
  totalAnswers: number
}

interface GridCell {
  rowCategory: CategoryType
  rowValue: string
  colCategory: CategoryType
  colValue: string
  status: CellStatus
  players: FootballPlayer[]
}

export function CategoryGridGame({ difficulty = "medium", onGameComplete }: CategoryGridGameProps) {
  const { toast } = useToast()
  const [grid, setGrid] = useState<GridCell[][]>([])
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<{
    question: string
    options: { id: string; text: string }[]
    correctAnswerId: string
    player: FootballPlayer
  } | null>(null)
  const [showQuestion, setShowQuestion] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<{ correct: boolean }[]>([])
  const [showHelp, setShowHelp] = useState(false)
  const [rowCategories, setRowCategories] = useState<{ type: CategoryType; value: string }[]>([])
  const [colCategories, setColCategories] = useState<{ type: CategoryType; value: string }[]>([])

  // Initialize the game grid
  useEffect(() => {
    initializeGrid()
  }, [])

  const initializeGrid = () => {
    // Define row and column categories
    const rowCategoryTypes: CategoryType[] = ["clubs", "countries", "trophies"]
    const colCategoryTypes: CategoryType[] = ["clubs", "countries", "trophies"]

    // Shuffle the category types to make it more interesting
    const shuffledRowTypes = [...rowCategoryTypes].sort(() => 0.5 - Math.random())
    const shuffledColTypes = [...colCategoryTypes].sort(() => 0.5 - Math.random())

    // Get unique values for each category
    const clubs = getUniqueClubs()
    const countries = getUniqueCountries()
    const trophies = getUniqueTrophies()

    // Select 3 random values for each category
    const selectedClubs = clubs.sort(() => 0.5 - Math.random()).slice(0, 3)
    const selectedCountries = countries.sort(() => 0.5 - Math.random()).slice(0, 3)
    const selectedTrophies = trophies.sort(() => 0.5 - Math.random()).slice(0, 3)

    // Create row categories
    const newRowCategories = [
      {
        type: shuffledRowTypes[0],
        value:
          shuffledRowTypes[0] === "clubs"
            ? selectedClubs[0]
            : shuffledRowTypes[0] === "countries"
              ? selectedCountries[0]
              : selectedTrophies[0],
      },
      {
        type: shuffledRowTypes[1],
        value:
          shuffledRowTypes[1] === "clubs"
            ? selectedClubs[1]
            : shuffledRowTypes[1] === "countries"
              ? selectedCountries[1]
              : selectedTrophies[1],
      },
      {
        type: shuffledRowTypes[2],
        value:
          shuffledRowTypes[2] === "clubs"
            ? selectedClubs[2]
            : shuffledRowTypes[2] === "countries"
              ? selectedCountries[2]
              : selectedTrophies[2],
      },
    ]

    // Create column categories
    const newColCategories = [
      {
        type: shuffledColTypes[0],
        value:
          shuffledColTypes[0] === "clubs"
            ? selectedClubs[0]
            : shuffledColTypes[0] === "countries"
              ? selectedCountries[0]
              : selectedTrophies[0],
      },
      {
        type: shuffledColTypes[1],
        value:
          shuffledColTypes[1] === "clubs"
            ? selectedClubs[1]
            : shuffledColTypes[1] === "countries"
              ? selectedCountries[1]
              : selectedTrophies[1],
      },
      {
        type: shuffledColTypes[2],
        value:
          shuffledColTypes[2] === "clubs"
            ? selectedClubs[2]
            : shuffledColTypes[2] === "countries"
              ? selectedCountries[2]
              : selectedTrophies[2],
      },
    ]

    setRowCategories(newRowCategories)
    setColCategories(newColCategories)

    // Create the grid
    const newGrid: GridCell[][] = []

    for (let i = 0; i < 3; i++) {
      const row: GridCell[] = []

      for (let j = 0; j < 3; j++) {
        // Find players that match both categories
        let matchingPlayers: FootballPlayer[] = []

        if (newRowCategories[i].type === "clubs" && newColCategories[j].type === "countries") {
          matchingPlayers = findPlayersByClubAndCountry(newRowCategories[i].value, newColCategories[j].value)
        } else if (newRowCategories[i].type === "countries" && newColCategories[j].type === "clubs") {
          matchingPlayers = findPlayersByClubAndCountry(newColCategories[j].value, newRowCategories[i].value)
        } else if (newRowCategories[i].type === "clubs" && newColCategories[j].type === "trophies") {
          matchingPlayers = findPlayersByClubAndTrophy(newRowCategories[i].value, newColCategories[j].value)
        } else if (newRowCategories[i].type === "trophies" && newColCategories[j].type === "clubs") {
          matchingPlayers = findPlayersByClubAndTrophy(newColCategories[j].value, newRowCategories[i].value)
        } else if (newRowCategories[i].type === "countries" && newColCategories[j].type === "trophies") {
          matchingPlayers = findPlayersByCountryAndTrophy(newRowCategories[i].value, newColCategories[j].value)
        } else if (newRowCategories[i].type === "trophies" && newColCategories[j].type === "countries") {
          matchingPlayers = findPlayersByCountryAndTrophy(newColCategories[j].value, newRowCategories[i].value)
        }

        row.push({
          rowCategory: newRowCategories[i].type,
          rowValue: newRowCategories[i].value,
          colCategory: newColCategories[j].type,
          colValue: newColCategories[j].value,
          status: "empty",
          players: matchingPlayers,
        })
      }

      newGrid.push(row)
    }

    setGrid(newGrid)
    setScore(0)
    setAnswers([])
    setGameOver(false)
  }

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    // Ignore if cell is already answered or game is over
    if (grid[rowIndex][colIndex].status !== "empty" || gameOver) {
      return
    }

    // Set the selected cell
    setSelectedCell({ row: rowIndex, col: colIndex })

    const cell = grid[rowIndex][colIndex]

    // Check if there are matching players
    if (cell.players.length === 0) {
      // No matching players, mark as incorrect
      const newGrid = [...grid]
      newGrid[rowIndex][colIndex].status = "incorrect"
      setGrid(newGrid)

      toast({
        title: "No matching players",
        description: `There are no players who match both ${cell.rowValue} and ${cell.colValue}.`,
        variant: "destructive",
      })

      return
    }

    // Select a random player from the matching players
    const randomPlayer = cell.players[Math.floor(Math.random() * cell.players.length)]

    // Generate a question about this player
    const question = generatePlayerQuestion(randomPlayer)

    setCurrentQuestion({
      ...question,
      player: randomPlayer,
    })

    // Reset answer state
    setSelectedAnswer(null)
    setShowResult(false)
    setIsCorrect(false)

    // Show the question dialog
    setShowQuestion(true)
  }

  const handleAnswerSelect = (answerId: string) => {
    if (!currentQuestion || !selectedCell) return

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
      // Update the grid
      const newGrid = [...grid]
      newGrid[selectedCell.row][selectedCell.col].status = correct ? "correct" : "incorrect"
      setGrid(newGrid)

      // Check if all cells have been answered
      const allAnswered = newGrid.every((row) => row.every((cell) => cell.status !== "empty"))

      if (allAnswered) {
        handleGameComplete()
      }

      setShowQuestion(false)
    }, 2000)
  }

  const handleGameComplete = () => {
    setGameOver(true)

    // Calculate stats
    const correctAnswers = answers.filter((a) => a.correct).length
    const totalAnswers = answers.length

    // Call the onGameComplete callback if provided
    if (onGameComplete) {
      onGameComplete({
        completed: true,
        score,
        correctAnswers,
        totalAnswers,
      })
    }

    // Show toast notification
    toast({
      title: "Game Complete!",
      description: `You answered ${correctAnswers} out of ${totalAnswers} questions correctly.`,
    })
  }

  const getCategoryColor = (category: CategoryType): string => {
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

  const getCategoryName = (category: CategoryType): string => {
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

  const getCategoryIcon = (category: CategoryType) => {
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

  const getCellStatusColor = (status: CellStatus): string => {
    switch (status) {
      case "correct":
        return "bg-green-50 border-green-300"
      case "incorrect":
        return "bg-red-50 border-red-300"
      default:
        return "bg-white"
    }
  }

  const getCellStatusIcon = (status: CellStatus) => {
    switch (status) {
      case "correct":
        return <Check className="h-6 w-6 text-green-500" />
      case "incorrect":
        return <X className="h-6 w-6 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-purple-100 text-purple-800 px-3 py-1">
            Training Mode
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
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          {/* Grid */}
          <div className="grid grid-cols-4 gap-2">
            {/* Top-left empty cell */}
            <div className="aspect-square"></div>

            {/* Column headers */}
            {colCategories.map((category, colIndex) => (
              <div
                key={`col-${colIndex}`}
                className={`aspect-square flex flex-col items-center justify-center p-2 rounded-lg ${getCategoryColor(category.type)}`}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {getCategoryIcon(category.type)}
                    <span className="text-xs font-medium">{getCategoryName(category.type)}</span>
                  </div>
                  <p className="text-sm font-bold truncate max-w-full" title={category.value}>
                    {category.value}
                  </p>
                </div>
              </div>
            ))}

            {/* Grid rows */}
            {grid.map((row, rowIndex) => (
              <React.Fragment key={`row-${rowIndex}`}>
                {/* Row header */}
                <div
                  className={`aspect-square flex flex-col items-center justify-center p-2 rounded-lg ${getCategoryColor(rowCategories[rowIndex].type)}`}
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {getCategoryIcon(rowCategories[rowIndex].type)}
                      <span className="text-xs font-medium">{getCategoryName(rowCategories[rowIndex].type)}</span>
                    </div>
                    <p className="text-sm font-bold truncate max-w-full" title={rowCategories[rowIndex].value}>
                      {rowCategories[rowIndex].value}
                    </p>
                  </div>
                </div>

                {/* Row cells */}
                {row.map((cell, colIndex) => (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={`aspect-square flex flex-col items-center justify-center border rounded-lg p-2 cursor-pointer ${
                      cell.status !== "empty" ? "cursor-not-allowed" : "hover:bg-gray-50"
                    } ${getCellStatusColor(cell.status)}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {cell.status !== "empty" ? (
                      <div className="flex flex-col items-center justify-center text-center">
                        {getCellStatusIcon(cell.status)}
                        {cell.status === "correct" && cell.players.length > 0 && (
                          <p className="text-xs font-medium mt-1">{cell.players[0].name}</p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Find a player</p>
                      </div>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>

          {gameOver && (
            <div className="mt-4">
              <Alert>
                <Trophy className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Game Complete! You answered {answers.filter((a) => a.correct).length} out of {answers.length}{" "}
                  questions correctly.
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
            <DialogDescription>Answer correctly to mark this cell</DialogDescription>
          </DialogHeader>

          {currentQuestion && selectedCell && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getCategoryColor(grid[selectedCell.row][selectedCell.col].rowCategory)}>
                    {grid[selectedCell.row][selectedCell.col].rowValue}
                  </Badge>
                  <span className="text-gray-500">+</span>
                  <Badge className={getCategoryColor(grid[selectedCell.row][selectedCell.col].colCategory)}>
                    {grid[selectedCell.row][selectedCell.col].colValue}
                  </Badge>
                </div>
                <p className="text-sm font-medium mb-2">Player: {currentQuestion.player.name}</p>
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
                    ? "Correct! This cell will be marked."
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
            <DialogTitle>How to Play Football Category Grid</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p>
              This game tests your knowledge of football players and their connections to clubs, countries, and
              trophies.
            </p>

            <div className="space-y-2">
              <h4 className="font-medium">Game Rules:</h4>
              <ul className="space-y-2 list-disc pl-5">
                <li>Each row and column represents a specific football category (club, country, or trophy).</li>
                <li>Your goal is to find players who match both the row and column categories.</li>
                <li>
                  For example, if a cell is at the intersection of "Barcelona" and "France", you need to name a French
                  player who played for Barcelona.
                </li>
                <li>Answer questions correctly to mark cells and complete the grid.</li>
                <li>
                  Some combinations might not have matching players - these will be marked as incorrect automatically.
                </li>
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
