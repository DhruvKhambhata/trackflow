"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Bell, Mail, Clock, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    browserNotifications: false,
    emailReminders: false,
    dailyReminder: true,
    reminderTime: "20:00",
    email: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem("notification-settings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...settings, ...parsed })
      } catch (error) {
        console.error("Error loading notification settings:", error)
      }
    }

    // Check current notification permission
    if ("Notification" in window) {
      setSettings((prev) => ({
        ...prev,
        browserNotifications: Notification.permission === "granted",
      }))
    }
  }, [])

  const saveSettings = (newSettings: typeof settings) => {
    localStorage.setItem("notification-settings", JSON.stringify(newSettings))
    setSettings(newSettings)
  }

  const handleBrowserNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission()
        if (permission === "granted") {
          saveSettings({ ...settings, browserNotifications: true })
          toast({
            title: "Browser notifications enabled",
            description: "You'll receive notifications in your browser.",
          })
        } else {
          toast({
            title: "Permission denied",
            description: "Please enable notifications in your browser settings.",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Not supported",
          description: "Your browser doesn't support notifications.",
          variant: "destructive",
        })
      }
    } else {
      saveSettings({ ...settings, browserNotifications: false })
      toast({
        title: "Browser notifications disabled",
        description: "You won't receive browser notifications anymore.",
      })
    }
  }

  const handleEmailToggle = (enabled: boolean) => {
    if (enabled && !settings.email) {
      toast({
        title: "Email required",
        description: "Please enter your email address first.",
        variant: "destructive",
      })
      return
    }

    saveSettings({ ...settings, emailReminders: enabled })
    toast({
      title: enabled ? "Email reminders enabled" : "Email reminders disabled",
      description: enabled ? "You'll receive daily reminders via email." : "You won't receive email reminders anymore.",
    })
  }

  const testNotification = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("TrackFlow Reminder", {
        body: "Don't forget to log your daily activities! 🎯",
        icon: "/icon-192x192.png",
        tag: "daily-reminder",
      })
      toast({
        title: "Test notification sent!",
        description: "Check if you received the notification.",
      })
    } else {
      toast({
        title: "Cannot send notification",
        description: "Please enable browser notifications first.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Browser Notifications */}
      <Card className="shadow-sm border-gray-200/60 bg-white/70 backdrop-blur-sm hover:shadow-md transition-all duration-200 dark:bg-gray-800/50 dark:border-gray-700/50">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-gray-900 dark:text-white">Browser Notifications</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Receive reminders directly in your browser
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50/80 dark:bg-gray-700/30 rounded-lg">
            <Label htmlFor="browser-notifications" className="flex-1 font-medium text-gray-700 dark:text-gray-300">
              Enable browser notifications
            </Label>
            <Switch
              id="browser-notifications"
              checked={settings.browserNotifications}
              onCheckedChange={handleBrowserNotificationToggle}
            />
          </div>
          {settings.browserNotifications && (
            <Button
              variant="outline"
              onClick={testNotification}
              className="w-full bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-blue-200 text-blue-700 dark:from-blue-900/20 dark:to-cyan-900/20 dark:border-blue-700/50 dark:text-blue-300"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Test Notification
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Email Notifications */}
      <Card className="shadow-sm border-gray-200/60 bg-white/70 backdrop-blur-sm hover:shadow-md transition-all duration-200 dark:bg-gray-800/50 dark:border-gray-700/50">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-gray-900 dark:text-white">Email Reminders</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Get daily reminders sent to your email address
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={settings.email}
              onChange={(e) => saveSettings({ ...settings, email: e.target.value })}
              className="bg-white/80 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50/80 dark:bg-gray-700/30 rounded-lg">
            <Label htmlFor="email-notifications" className="flex-1 font-medium text-gray-700 dark:text-gray-300">
              Enable email reminders
            </Label>
            <Switch id="email-notifications" checked={settings.emailReminders} onCheckedChange={handleEmailToggle} />
          </div>
        </CardContent>
      </Card>

      {/* Reminder Time */}
      <Card className="shadow-sm border-gray-200/60 bg-white/70 backdrop-blur-sm hover:shadow-md transition-all duration-200 dark:bg-gray-800/50 dark:border-gray-700/50">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-gray-900 dark:text-white">Daily Reminders</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Choose when you want to receive daily reminders
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50/80 dark:bg-gray-700/30 rounded-lg">
            <Label htmlFor="daily-reminder" className="flex-1 font-medium text-gray-700 dark:text-gray-300">
              Enable daily reminders
            </Label>
            <Switch
              id="daily-reminder"
              checked={settings.dailyReminder}
              onCheckedChange={(enabled) => saveSettings({ ...settings, dailyReminder: enabled })}
            />
          </div>

          {settings.dailyReminder && (
            <div className="space-y-3 p-4 bg-purple-50/80 dark:bg-purple-900/20 rounded-lg border border-purple-200/50 dark:border-purple-700/30">
              <Label htmlFor="reminder-time" className="font-medium text-purple-700 dark:text-purple-300">
                Reminder time
              </Label>
              <Input
                id="reminder-time"
                type="time"
                value={settings.reminderTime}
                onChange={(e) => saveSettings({ ...settings, reminderTime: e.target.value })}
                className="bg-white/80 dark:bg-gray-800/50 border-purple-300 dark:border-purple-600"
              />
              <p className="text-sm text-purple-600 dark:text-purple-400">
                You'll receive a reminder at {settings.reminderTime} every day
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Status */}
      <Card className="shadow-sm border-gray-200/60 bg-white/70 backdrop-blur-sm hover:shadow-md transition-all duration-200 dark:bg-gray-800/50 dark:border-gray-700/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-gray-900 dark:text-white">Notification Status</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Current notification settings overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50/80 dark:bg-gray-700/30 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300 font-medium">Browser Notifications</span>
              <span
                className={`font-bold flex items-center ${settings.browserNotifications ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${settings.browserNotifications ? "bg-green-500" : "bg-gray-400"}`}
                ></div>
                {settings.browserNotifications ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50/80 dark:bg-gray-700/30 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300 font-medium">Email Reminders</span>
              <span
                className={`font-bold flex items-center ${settings.emailReminders ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${settings.emailReminders ? "bg-green-500" : "bg-gray-400"}`}
                ></div>
                {settings.emailReminders ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50/80 dark:bg-gray-700/30 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300 font-medium">Daily Reminders</span>
              <span
                className={`font-bold flex items-center ${settings.dailyReminder ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${settings.dailyReminder ? "bg-green-500" : "bg-gray-400"}`}
                ></div>
                {settings.dailyReminder ? settings.reminderTime : "Disabled"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
