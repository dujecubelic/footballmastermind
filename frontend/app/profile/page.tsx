"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { UserApi, type UserStats, type Achievement } from "@/lib/api/user-api"
import type React from "react"
import Link from "next/link"
import { ArrowLeft, Trophy, Medal, BarChart3, Award, Zap, Target, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilePage() {
  const { user, isGuest, loading: authLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Redirect guests to login
  useEffect(() => {
    if (!authLoading && (isGuest || !user)) {
      router.push("/login")
    }
  }, [authLoading, isGuest, user, router])

  // Load user stats and achievements
  useEffect(() => {
    const loadUserData = async () => {
      if (!user || isGuest) return

      try {
        setLoading(true)
        setError(null)

        const [statsData, achievementsData] = await Promise.all([UserApi.getUserStats(), UserApi.getUserAchievements()])

        setStats(statsData)
        setAchievements(achievementsData.achievements)
      } catch (error: any) {
        console.error("Failed to load user data:", error)
        setError(error.message || "Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [user, isGuest])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user || isGuest) {
    return null // Will redirect
  }

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase()
  }

  const getRankColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "bronze":
        return "bg-orange-500"
      case "silver":
        return "bg-gray-400"
      case "gold":
        return "bg-yellow-500"
      case "platinum":
        return "bg-purple-500"
      case "diamond":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case "trophy":
        return <Trophy className="h-6 w-6" />
      case "award":
        return <Award className="h-6 w-6" />
      case "medal":
        return <Medal className="h-6 w-6" />
      case "star":
        return <Star className="h-6 w-6" />
      default:
        return <Trophy className="h-6 w-6" />
    }
  }

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
          <h1 className="text-3xl font-bold text-white ml-4">Your Profile</h1>
        </div>

        {error && (
          <div className="mb-6">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                  <AvatarFallback className="text-2xl font-bold">{getInitials(user.username)}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{user.displayName || user.username}</h2>
                <p className="text-muted-foreground mb-4">@{user.username}</p>

                <div className="flex items-center gap-2 mb-6">
                  {loading ? (
                    <>
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </>
                  ) : stats ? (
                    <>
                      <Badge className={getRankColor(stats.rankTier)}>{stats.rankTier} Rank</Badge>
                      <Badge className="bg-blue-500">Level {stats.level}</Badge>
                    </>
                  ) : (
                    <>
                      <Badge className="bg-orange-500">Bronze Rank</Badge>
                      <Badge className="bg-blue-500">Level 1</Badge>
                    </>
                  )}
                </div>

                <div className="w-full mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Next Level</span>
                    {loading ? (
                      <Skeleton className="h-4 w-8" />
                    ) : stats ? (
                      <span className="text-sm font-medium">{Math.round((stats.xp / stats.xpToNextLevel) * 100)}%</span>
                    ) : (
                      <span className="text-sm font-medium">0%</span>
                    )}
                  </div>
                  {loading ? (
                    <Skeleton className="h-2 w-full" />
                  ) : stats ? (
                    <Progress value={(stats.xp / stats.xpToNextLevel) * 100} className="h-2" />
                  ) : (
                    <Progress value={0} className="h-2" />
                  )}
                </div>

                <Button className="w-full">Edit Profile</Button>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Tabs defaultValue="stats">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="stats">Statistics</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              <TabsContent value="stats">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <StatCard
                    title="Games Played"
                    value={loading ? undefined : stats?.gamesPlayed.toString() || "0"}
                    icon={<Trophy className="h-5 w-5 text-yellow-400" />}
                    loading={loading}
                  />
                  <StatCard
                    title="Win Rate"
                    value={loading ? undefined : stats?.winRate || "0%"}
                    icon={<BarChart3 className="h-5 w-5 text-green-400" />}
                    loading={loading}
                  />
                  <StatCard
                    title="Highest Score"
                    value={loading ? undefined : stats?.highestScore.toString() || "0"}
                    icon={<Award className="h-5 w-5 text-purple-400" />}
                    loading={loading}
                  />
                  <StatCard
                    title="Questions Answered"
                    value={loading ? undefined : stats?.questionsAnswered.toString() || "0"}
                    icon={<Target className="h-5 w-5 text-blue-400" />}
                    loading={loading}
                  />
                  <StatCard
                    title="Accuracy"
                    value={loading ? undefined : stats?.accuracy || "0%"}
                    icon={<Zap className="h-5 w-5 text-orange-400" />}
                    loading={loading}
                  />
                  <StatCard
                    title="Rank Points"
                    value={loading ? undefined : stats?.rankPoints.toString() || "0"}
                    icon={<Star className="h-5 w-5 text-pink-400" />}
                    loading={loading}
                  />
                </div>
              </TabsContent>

              <TabsContent value="achievements">
                <div className="space-y-4">
                  <Alert className="border-blue-200 bg-blue-50">
                    <Trophy className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Note:</strong> Achievements are currently placeholder data. The achievement system will be
                      fully implemented when connected to the backend database with proper tracking.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {loading
                      ? // Loading skeletons
                        Array.from({ length: 4 }).map((_, index) => (
                          <Card key={index} className="border-0 shadow-lg">
                            <CardContent className="p-6">
                              <div className="flex items-center gap-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="flex-1">
                                  <Skeleton className="h-5 w-32 mb-2" />
                                  <Skeleton className="h-4 w-48" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      : achievements.map((achievement) => (
                          <AchievementCard
                            key={achievement.id}
                            title={achievement.title}
                            description={achievement.description}
                            completed={achievement.completed}
                            progress={achievement.progress}
                            maxProgress={achievement.maxProgress}
                            icon={getAchievementIcon(achievement.icon)}
                          />
                        ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value?: string
  icon: React.ReactNode
  loading?: boolean
}

function StatCard({ title, value, icon, loading }: StatCardProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            {loading ? <Skeleton className="h-8 w-16 mt-1" /> : <p className="text-3xl font-bold">{value}</p>}
          </div>
          <div className="p-3 rounded-full bg-green-100">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

interface AchievementCardProps {
  title: string
  description: string
  completed: boolean
  progress?: number
  maxProgress?: number
  icon: React.ReactNode
}

function AchievementCard({ title, description, completed, progress, maxProgress, icon }: AchievementCardProps) {
  const progressPercentage = progress && maxProgress ? (progress / maxProgress) * 100 : 0

  return (
    <Card className={`border-0 shadow-lg ${completed ? "bg-green-50" : ""}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${completed ? "bg-green-100" : "bg-gray-100"}`}>
            <div className={completed ? "text-yellow-500" : "text-gray-400"}>{icon}</div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
            {!completed && progress !== undefined && maxProgress !== undefined && (
              <div className="mt-2">
                <div className="flex justify-between mb-1">
                  <span className="text-xs">
                    {progress}/{maxProgress}
                  </span>
                  <span className="text-xs">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-1" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
