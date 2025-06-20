"use client"

import { useAuth } from "@/lib/auth/auth-context"
import type React from "react"
import Link from "next/link"
import { ArrowLeft, Zap, Grid, CheckCircle, Brain, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function GamesPage() {
  const { isAuthenticated, isGuest } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-950 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Menu
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white ml-4">Choose Your Game</h1>
        </div>

        <Tabs defaultValue="training" className="mb-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/10">
            <TabsTrigger value="training" className="text-white data-[state=active]:bg-white/20">
              <Brain className="h-4 w-4 mr-2" />
              Training
            </TabsTrigger>
            <TabsTrigger value="multiplayer" className="text-white data-[state=active]:bg-white/20">
              <Users className="h-4 w-4 mr-2" />
              Multiplayer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="training">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GameCard
                title="Football Tic-Tac-Toe"
                description="Name players who fit category intersections to win tic-tac-toe"
                icon={<Grid className="h-8 w-8 text-blue-400" />}
                features={["Category intersections", "Player knowledge", "Strategic gameplay"]}
                href="/games/tic-tac-toe/training"
                available={true}
              />

              <GameCard
                title="Trivia Training"
                description="Practice your football knowledge with challenging questions"
                icon={<Brain className="h-8 w-8 text-green-400" />}
                features={["Multiple difficulty levels", "Instant feedback", "Progress tracking"]}
                href="/games/trivia-battle/training"
                available={true}
              />
            </div>
          </TabsContent>

          <TabsContent value="multiplayer">
            {isAuthenticated ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GameCard
                  title="Trivia Battle"
                  description="Race against an opponent to answer questions first and score points"
                  icon={<Zap className="h-8 w-8 text-yellow-400" />}
                  features={["Real-time competition", "First to answer wins", "Multiple categories"]}
                  href="/games/trivia-battle/join"
                  available={true}
                  badge="Live"
                />

                <GameCard
                  title="Multiplayer Tic-Tac-Toe"
                  description="Strategic multiplayer tic-tac-toe with football knowledge"
                  icon={<Grid className="h-8 w-8 text-blue-400" />}
                  features={["Real-time multiplayer", "Strategic gameplay", "Ranked matches"]}
                  href="/games/tic-tac-toe/join"
                  available={true}
                  badge="Live"
                />

                <GameCard
                  title="Tournament Mode"
                  description="Compete in brackets against multiple players"
                  icon={<Users className="h-8 w-8 text-purple-400" />}
                  features={["Bracket tournaments", "Multiple rounds", "Championship rewards"]}
                  href="/games/tournament"
                  available={true}
                  badge="New"
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-6">
                  <Users className="h-16 w-16 mx-auto text-white/50" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Join the Competition</h3>
                <p className="text-green-100 mb-8 max-w-md mx-auto">
                  Create an account to access multiplayer games and compete against other football fans!
                </p>
                <Link href="/login">
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                    Sign Up to Play Multiplayer
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface GameCardProps {
  title: string
  description: string
  icon: React.ReactNode
  features: string[]
  href: string
  available: boolean
  badge?: string
}

function GameCard({ title, description, icon, features, href, available, badge }: GameCardProps) {
  return (
    <Card
      className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${!available ? "opacity-75" : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="p-3 rounded-full bg-green-100">{icon}</div>
          {badge && (
            <Badge
              className={`${
                badge === "Live" ? "bg-red-500" : badge === "New" ? "bg-blue-500" : "bg-orange-500"
              } text-white`}
            >
              {badge}
            </Badge>
          )}
        </div>
        <CardTitle className="text-2xl mt-4">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Link href={href} className="w-full">
          <Button
            className={`w-full ${available ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
            disabled={!available}
          >
            {available ? "Play Now" : "Coming Soon"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
