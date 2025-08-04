"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LogOut, Plus, BarChart3, Calendar, Target, Flame, Zap, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { getUser, removeUser, getActivities, getLogsForDate, getTodayString, calculateStreak } from "@/lib/storage"
import QuickLogDialog from "@/components/quick-log-dialog"
import Link from "next/link"

interface Activity {
  id: string
  name: string
  emoji: string
  category: string
  target: number
  unit: string
  color: string
  createdAt: string
}

interface ActivityWithProgress extends Activity {
  progress: number
  completed: boolean
  streak: number
  todayValue: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [activities, setActivities] = useState<ActivityWithProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [quickLogOpen, setQuickLogOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const userData = getUser()
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(userData)
    loadActivities()
    setLoading(false)
  }, [router])

  const loadActivities = () => {
    const allActivities = getActivities()
    const todayLogs = getLogsForDate(getTodayString())

    const activitiesWithProgress = allActivities.map((activity) => {
      const todayLog = todayLogs.find((log) => log.activityId === activity.id)
      const todayValue = todayLog ? todayLog.value : 0
      const progress = todayValue > 0 ? (todayValue / activity.target) * 100 : 0
      const completed = progress >= 100
      const streak = calculateStreak(activity.id)

      return {
        ...activity,
        progress: Math.min(progress, 100),
        completed,
        streak,
        todayValue,
      }
    })

    setActivities(activitiesWithProgress)
  }

  const handleLogout = () => {
    removeUser()
    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    })
    router.push("/")
  }

  const handleQuickLog = (activity: Activity) => {
    setSelectedActivity(activity)
    setQuickLogOpen(true)
  }

  const handleQuickLogSuccess = () => {
    loadActivities()
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  const getCompletionRate = () => {
    if (activities.length === 0) return 0
    const completed = activities.filter((a) => a.completed).length
    return Math.round((completed / activities.length) * 100)
  }

  const getTotalStreak = () => {
    return activities.reduce((total, activity) => total + activity.streak, 0)
  }

  const getMotivationalMessage = () => {
    const completionRate = getCompletionRate()
    if (completionRate === 100) return "Perfect day! You're crushing it! 🔥"
    if (completionRate >= 75) return "Almost there! Keep pushing! 💪"
    if (completionRate >= 50) return "Great progress! You're doing well! ⭐"
    if (completionRate >= 25) return "Good start! Keep building momentum! 🚀"
    return "Every journey starts with a single step! 🌟"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">TrackFlow</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="font-semibold">
                {getGreeting()}, {user?.name}!
              </p>
              <p className="text-sm text-muted-foreground">{getMotivationalMessage()}</p>
            </div>
            <ThemeToggle />
            <Link href="/settings">
              <Button variant="ghost" size="icon" title="Settings">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Activities</p>
                  <p className="text-2xl font-bold">{activities.length}</p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                  <p className="text-2xl font-bold">{activities.filter((a) => a.completed).length}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold">{getCompletionRate()}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Streaks</p>
                  <p className="text-2xl font-bold">{getTotalStreak()}</p>
                </div>
                <Flame className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/activities/new">
            <Card className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.02] border-dashed border-2">
              <CardContent className="p-8 text-center">
                <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Add New Activity</h3>
                <p className="text-muted-foreground">Create a new activity to track</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/log">
            <Card className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]">
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Log Progress</h3>
                <p className="text-muted-foreground">Record your daily activities</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/analytics">
            <Card className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]">
              <CardContent className="p-8 text-center">
                <BarChart3 className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">View Analytics</h3>
                <p className="text-muted-foreground">Analyze your progress</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Today's Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Activities
            </CardTitle>
            <CardDescription>Track your progress for today - click any activity for quick logging</CardDescription>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No activities yet</h3>
                <p className="text-muted-foreground mb-4">Create your first activity to start tracking</p>
                <Link href="/activities/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Activity
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    onClick={() => handleQuickLog(activity)}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-all cursor-pointer hover:scale-[1.01] group"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: activity.color + "20" }}
                      >
                        {activity.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{activity.name}</h4>
                          <Zap className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Target: {activity.target} {activity.unit}
                          {activity.todayValue > 0 && (
                            <span className="ml-2 text-primary font-medium">
                              • Today: {activity.todayValue} {activity.unit}
                            </span>
                          )}
                        </p>
                        <div className="mt-2">
                          <Progress value={activity.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">{activity.progress.toFixed(0)}% complete</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {activity.streak > 0 && (
                        <div className="flex items-center space-x-1 text-orange-600">
                          <Flame className="w-4 h-4" />
                          <span className="text-sm font-medium">{activity.streak}</span>
                        </div>
                      )}
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          activity.completed
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {activity.completed ? "Completed" : "In Progress"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <QuickLogDialog
        activity={selectedActivity}
        isOpen={quickLogOpen}
        onClose={() => setQuickLogOpen(false)}
        onSuccess={handleQuickLogSuccess}
      />
    </div>
  )
}
