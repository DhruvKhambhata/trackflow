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

interface ActivityLog {
  id: string
  activityId: string
  value: number
  date: string
  createdAt: string
}

interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

// Storage keys
const STORAGE_KEYS = {
  USER: "trackflow_user",
  ACTIVITIES: "trackflow_activities",
  LOGS: "trackflow_logs",
}

// User functions
export const saveUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

export const getUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.USER)
  return user ? JSON.parse(user) : null
}

export const removeUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER)
}

// Activity functions
export const saveActivity = (activity: Activity): void => {
  const activities = getActivities()
  activities.push(activity)
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities))
}

export const getActivities = (): Activity[] => {
  const activities = localStorage.getItem(STORAGE_KEYS.ACTIVITIES)
  return activities ? JSON.parse(activities) : []
}

export const deleteActivity = (activityId: string): void => {
  const activities = getActivities().filter((a) => a.id !== activityId)
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities))

  // Also delete related logs
  const logs = getLogs().filter((l) => l.activityId !== activityId)
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs))
}

// Log functions
export const saveLog = (log: ActivityLog): void => {
  const logs = getLogs()
  // Remove existing log for same activity and date
  const filteredLogs = logs.filter((l) => !(l.activityId === log.activityId && l.date === log.date))
  filteredLogs.push(log)
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(filteredLogs))
}

export const getLogs = (): ActivityLog[] => {
  const logs = localStorage.getItem(STORAGE_KEYS.LOGS)
  return logs ? JSON.parse(logs) : []
}

export const getLogsForDate = (date: string): ActivityLog[] => {
  return getLogs().filter((log) => log.date === date)
}

export const getLogsForActivity = (activityId: string): ActivityLog[] => {
  return getLogs().filter((log) => log.activityId === activityId)
}

// Utility functions
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const getTodayString = (): string => {
  return new Date().toISOString().split("T")[0]
}

export const calculateStreak = (activityId: string): number => {
  const logs = getLogsForActivity(activityId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (logs.length === 0) return 0

  let streak = 0
  const today = new Date()

  for (let i = 0; i < logs.length; i++) {
    const logDate = new Date(logs[i].date)
    const expectedDate = new Date(today)
    expectedDate.setDate(today.getDate() - i)

    if (logDate.toDateString() === expectedDate.toDateString()) {
      streak++
    } else {
      break
    }
  }

  return streak
}
