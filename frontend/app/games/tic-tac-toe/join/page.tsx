"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Grid, Users, Trophy, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function TicTacToeJoinPage() {
  const { toast } = useToast()
  const [isRanked, setIsRanked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleFindMatch = async () => {
    setIsLoading(true)

    try {
      toast({
        title: "Finding Match...",
        description: "Searching for an opponent in your skill range.",
      })

      // Simulate finding a match - replace with actual API call
      setTimeout(() => {
        toast({
          title: "Match Found!",
          description: "Connecting to game...",
        })
        setIsLoading(false)
      }, 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to find match",
        variant: "destructive",
      })
      setIsLoading(false)
    }
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
          <h1 className="text-3xl font-bold text-white ml-4">Football Category Grid</h1>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Find a Match</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="p-6 rounded-full bg-blue-100">
                  <Grid className="h-12 w-12 text-blue-500" />
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-medium mb-2">Football Category Grid</h3>
                <p className="text-muted-foreground mb-6">
                  Test your knowledge of football players and their connections!
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="ranked-mode" className="text-base font-medium">
                      Ranked Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">Play competitive matches that affect your rank</p>
                  </div>
                  <Switch id="ranked-mode" checked={isRanked} onCheckedChange={setIsRanked} />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  How to Play:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Grid className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Each row and column represents a football category (club, country, or trophy)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>Find players who match both categories (e.g., a French player who played for Barcelona)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Trophy className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Answer questions correctly to mark cells and complete the grid</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleFindMatch} className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Finding Match...
                </>
              ) : (
                "Find Match"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
