"use client"

import { useState, useEffect } from "react"

interface Activity {
  _id: string
  name: string
  category: string
  target: number
  unit: string
  color: string
}

interface Log {
  _id: string
  activityId: string
  value: number
  date: string
  activity: Activity
}

interface ActivityStats {
  totalActivities: number
  completedToday: number
  currentStreak: number
  completionRate: number
  weeklyProgress: number[]
  monthlyProgress: { [key: string]: number }
}

export function useActivityStats() {
  const [stats, setStats] = useState<ActivityStats>({
    totalActivities: 0,
    completedToday: 0,
    currentStreak: 0,
    completionRate: 0,
    weeklyProgress: [],
    monthlyProgress: {},
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      // Fetch activities
      const activitiesResponse = await fetch("/api/activities", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const activities = await activitiesResponse.json()

      // Fetch logs
      const logsResponse = await fetch("/api/logs", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const logs = await logsResponse.json()

      // Calculate stats
      const today = new Date().toISOString().split("T")[0]
      const todayLogs = logs.filter((log: Log) => log.date.split("T")[0] === today)

      const completionRate = activities.length > 0 ? (todayLogs.length / activities.length) * 100 : 0

      // Calculate streak (simplified)
      const streak = calculateStreak(logs)

      // Calculate weekly progress
      const weeklyProgress = calculateWeeklyProgress(logs)

      // Calculate monthly progress
      const monthlyProgress = calculateMonthlyProgress(logs)

      setStats({
        totalActivities: activities.length,
        completedToday: todayLogs.length,
        currentStreak: streak,
        completionRate: Math.round(completionRate),
        weeklyProgress,
        monthlyProgress,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStreak = (logs: Log[]): number => {
    // Simplified streak calculation
    const dates = [...new Set(logs.map((log) => log.date.split("T")[0]))].sort().reverse()
    let streak = 0
    const today = new Date()

    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i])
      const expectedDate = new Date(today)
      expectedDate.setDate(today.getDate() - i)

      if (date.toDateString() === expectedDate.toDateString()) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const calculateWeeklyProgress = (logs: Log[]): number[] => {
    const week = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateString = date.toISOString().split("T")[0]
      const dayLogs = logs.filter((log: Log) => log.date.split("T")[0] === dateString)
      week.push(dayLogs.length)
    }

    return week
  }

  const calculateMonthlyProgress = (logs: Log[]): { [key: string]: number } => {
    const monthly: { [key: string]: number } = {}
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    for (let day = 1; day <= today.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day)
      const dateString = date.toISOString().split("T")[0]
      const dayLogs = logs.filter((log: Log) => log.date.split("T")[0] === dateString)
      monthly[dateString] = dayLogs.length
    }

    return monthly
  }

  return { stats, isLoading, refetch: fetchStats }
}
