"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, BarChart3, TrendingUp, Activity, Flame } from "lucide-react"
import Link from "next/link"
import { getActivities, getLogs, calculateStreak } from "@/lib/storage"

interface ActivityType {
  id: string
  name: string
  category: string
  target: number
  unit: string
  color: string
  emoji: string
}

interface LogEntry {
  id: string
  activityId: string
  value: number
  date: string
  createdAt: string
}

export default function AnalyticsPage() {
  const [activities, setActivities] = useState<ActivityType[]>([])
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [selectedActivity, setSelectedActivity] = useState("all")
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    try {
      const allActivities = getActivities()
      const allLogs = getLogs()
      setActivities(allActivities)
      setLogs(allLogs)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getCalendarData = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear)
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay()
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const dayLogs = logs.filter((log) => {
        const logDate = log.date
        return logDate === dateString && (selectedActivity === "all" || log.activityId === selectedActivity)
      })

      days.push({
        day,
        date: dateString,
        logs: dayLogs,
        hasActivity: dayLogs.length > 0,
      })
    }

    return days
  }

  const getMonthlyStats = () => {
    const monthLogs = logs.filter((log) => {
      const logDate = new Date(log.date)
      return (
        logDate.getMonth() === selectedMonth &&
        logDate.getFullYear() === selectedYear &&
        (selectedActivity === "all" || log.activityId === selectedActivity)
      )
    })

    const totalDays = getDaysInMonth(selectedMonth, selectedYear)
    const activeDays = new Set(monthLogs.map((log) => log.date)).size
    const completionRate = Math.round((activeDays / totalDays) * 100)
    const totalLogs = monthLogs.length

    return {
      activeDays,
      totalDays,
      completionRate,
      totalLogs,
    }
  }

  const getActivityStats = () => {
    return activities.map((activity) => {
      const activityLogs = logs.filter((log) => log.activityId === activity.id)
      const streak = calculateStreak(activity.id)
      const totalLogged = activityLogs.reduce((sum, log) => sum + log.value, 0)
      const averageDaily = activityLogs.length > 0 ? totalLogged / activityLogs.length : 0

      return {
        ...activity,
        streak,
        totalLogged,
        averageDaily: Math.round(averageDaily * 100) / 100,
        totalDays: activityLogs.length,
      }
    })
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const calendarData = getCalendarData()
  const monthlyStats = getMonthlyStats()
  const activityStats = getActivityStats()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">Analytics</h1>
            <p className="text-sm text-muted-foreground">Track your progress and insights</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Select value={selectedActivity} onValueChange={setSelectedActivity}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select activity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              {activities.map((activity) => (
                <SelectItem key={activity.id} value={activity.id}>
                  <div className="flex items-center space-x-2">
                    <span>{activity.emoji}</span>
                    <span>{activity.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(Number.parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {monthNames.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number.parseInt(value))}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2024, 2025, 2026].map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Days</p>
                  <p className="text-2xl font-bold">{monthlyStats.activeDays}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold">{monthlyStats.completionRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Logs</p>
                  <p className="text-2xl font-bold">{monthlyStats.totalLogs}</p>
                </div>
                <Activity className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Best Streak</p>
                  <p className="text-2xl font-bold">{Math.max(...activityStats.map((a) => a.streak), 0)}</p>
                </div>
                <Flame className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>
                {monthNames[selectedMonth]} {selectedYear}
              </CardTitle>
              <CardDescription>Your activity calendar for the selected month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {dayNames.map((day) => (
                  <div key={day} className="text-center text-muted-foreground text-sm font-medium p-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {calendarData.map((day, index) => (
                  <div
                    key={index}
                    className={`aspect-square p-2 rounded-lg border text-center text-sm ${
                      day === null
                        ? "border-transparent"
                        : day.hasActivity
                          ? "bg-primary/10 border-primary/30 text-primary font-medium"
                          : "bg-muted/50 border-border text-muted-foreground"
                    }`}
                  >
                    {day && (
                      <div>
                        <div className="font-medium">{day.day}</div>
                        {day.logs.length > 0 && <div className="text-xs mt-1">{day.logs.length}</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Statistics</CardTitle>
              <CardDescription>Performance overview for all your activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityStats.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                        style={{ backgroundColor: activity.color + "20" }}
                      >
                        {activity.emoji}
                      </div>
                      <div>
                        <h4 className="font-medium">{activity.name}</h4>
                        <p className="text-sm text-muted-foreground">{activity.totalDays} days logged</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        <Flame className="w-4 h-4 text-orange-600" />
                        <span className="font-medium">{activity.streak}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Avg: {activity.averageDaily} {activity.unit}
                      </p>
                    </div>
                  </div>
                ))}
                {activityStats.length === 0 && (
                  <div className="text-center py-8">
                    <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No activity data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
