"use client"

import type React from "react"
import Link from "next/link"
import { Trophy, User, ClubIcon as Football, Award, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/auth/auth-context"

// Update the MainMenu component to handle guest mode more gracefully
export default function MainMenu() {
  const { user, logout, loading, isGuest, loginAsGuest } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user && !isGuest) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto text-center">
          <div className="mb-8 animate-bounce">
            <Football className="h-16 w-16 mx-auto text-white" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Football Mastermind</h1>
          <p className="text-xl text-green-100 mb-12">Test your football knowledge and climb the ranks!</p>

          <div className="space-y-4">
            <Link href="/login">
              <Button className="w-full max-w-md bg-green-600 hover:bg-green-700 text-white text-lg py-3">
                Login to Play
              </Button>
            </Link>
            <Button
              onClick={loginAsGuest}
              variant="outline"
              className="w-full max-w-md bg-white/10 hover:bg-white/20 text-white text-lg py-3"
            >
              Play as Guest
            </Button>
            <p className="text-green-100">
              New to Football Mastermind?{" "}
              <Link href="/login" className="text-white underline hover:no-underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto text-center">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-white/10">
              <User className="h-6 w-6 text-white" />
            </div>
            <span className="text-white font-medium">
              {isGuest ? "Playing as Guest" : `Welcome, ${user?.username}!`}
            </span>
          </div>
          <Button variant="ghost" onClick={logout} className="text-white hover:bg-white/10">
            <LogOut className="h-4 w-4 mr-2" />
            {isGuest ? "Exit Guest Mode" : "Logout"}
          </Button>
        </div>

        <div className="mb-8 animate-bounce">
          <Football className="h-16 w-16 mx-auto text-white" />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Football Mastermind</h1>
        <p className="text-xl text-green-100 mb-12">Test your football knowledge and climb the ranks!</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <MenuCard
            title="Games"
            description="Choose from our trivia games and test your knowledge"
            icon={<Trophy className="h-8 w-8 text-yellow-400" />}
            href="/games"
          />

          {!isGuest && (
            <MenuCard
              title="Profile"
              description="View your stats, achievements and current rank"
              icon={<User className="h-8 w-8 text-blue-400" />}
              href="/profile"
            />
          )}

          {isGuest && (
            <div className="bg-white/10 rounded-lg p-6 flex flex-col items-center text-center">
              <div className="mb-4 p-3 rounded-full bg-gray-200/20">
                <User className="h-8 w-8 text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-white">Profile</h2>
              <p className="text-green-100">Create an account to track your stats and achievements</p>
              <Link href="/login" className="mt-6 w-full">
                <Button className="w-full bg-white/20 hover:bg-white/30 text-white">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        {isGuest && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 text-yellow-300 mb-4">
              <Award className="h-5 w-5" />
              <span>Create an account to save your progress!</span>
            </div>
          </div>
        )}

        {!isGuest && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white mb-4">
              <Award className="h-5 w-5 text-yellow-400" />
              <span>Become the ultimate Football Mastermind!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface MenuCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
}

function MenuCard({ title, description, icon, href }: MenuCardProps) {
  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <Link href={href} className="block h-full">
        <CardContent className="p-6 flex flex-col items-center text-center h-full">
          <div className="mb-4 p-3 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors">{icon}</div>
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
          <Button className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white">Go to {title}</Button>
        </CardContent>
      </Link>
    </Card>
  )
}
