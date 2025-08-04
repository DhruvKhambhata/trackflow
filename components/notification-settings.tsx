"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Bell, Mail, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function NotificationSettings() {
  const [pushEnabled, setPushEnabled] = useState(false)
  const [emailEnabled, setEmailEnabled] = useState(false)
  const [reminderTime, setReminderTime] = useState("20:00")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem("notification-settings")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setPushEnabled(settings.pushEnabled || false)
      setEmailEnabled(settings.emailEnabled || false)
      setReminderTime(settings.reminderTime || "20:00")
      setEmail(settings.email || "")
    }

    // Check current notification permission
    if ("Notification" in window) {
      setPushEnabled(Notification.permission === "granted")
    }
  }, [])

  const handlePushToggle = async (enabled: boolean) => {
    if (enabled) {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission()
        if (permission === "granted") {
          setPushEnabled(true)
          // Subscribe to push notifications
          await subscribeToPushNotifications()
          toast({
            title: "Push notifications enabled",
            description: "You'll receive daily reminders on this device.",
          })
        } else {
          toast({
            title: "Permission denied",
            description: "Please enable notifications in your browser settings.",
            variant: "destructive",
          })
        }
      }
    } else {
      setPushEnabled(false)
      // Unsubscribe from push notifications
      await unsubscribeFromPushNotifications()
      toast({
        title: "Push notifications disabled",
        description: "You won't receive push notifications anymore.",
      })
    }
    saveSettings()
  }

  const handleEmailToggle = async (enabled: boolean) => {
    if (enabled && !email) {
      toast({
        title: "Email required",
        description: "Please enter your email address first.",
        variant: "destructive",
      })
      return
    }

    setEmailEnabled(enabled)

    if (enabled) {
      await subscribeToEmailNotifications()
      toast({
        title: "Email notifications enabled",
        description: "You'll receive daily reminders via email.",
      })
    } else {
      await unsubscribeFromEmailNotifications()
      toast({
        title: "Email notifications disabled",
        description: "You won't receive email reminders anymore.",
      })
    }
    saveSettings()
  }

  const subscribeToPushNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""),
      })

      const token = localStorage.getItem("token")
      await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subscription,
          reminderTime,
        }),
      })
    } catch (error) {
      console.error("Error subscribing to push notifications:", error)
    }
  }

  const unsubscribeFromPushNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()
      }

      const token = localStorage.getItem("token")
      await fetch("/api/notifications/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (error) {
      console.error("Error unsubscribing from push notifications:", error)
    }
  }

  const subscribeToEmailNotifications = async () => {
    try {
      const token = localStorage.getItem("token")
      await fetch("/api/notifications/email/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          reminderTime,
        }),
      })
    } catch (error) {
      console.error("Error subscribing to email notifications:", error)
    }
  }

  const unsubscribeFromEmailNotifications = async () => {
    try {
      const token = localStorage.getItem("token")
      await fetch("/api/notifications/email/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (error) {
      console.error("Error unsubscribing from email notifications:", error)
    }
  }

  const saveSettings = () => {
    const settings = {
      pushEnabled,
      emailEnabled,
      reminderTime,
      email,
    }
    localStorage.setItem("notification-settings", JSON.stringify(settings))
  }

  const testNotification = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("TrackFlow Reminder", {
        body: "Don't forget to log your daily activities!",
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-72x72.png",
        tag: "daily-reminder",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Push Notifications */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-purple-400" />
            <CardTitle className="text-white">Push Notifications</CardTitle>
          </div>
          <CardDescription className="text-gray-400">Receive daily reminders directly on your device</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications" className="text-white">
              Enable push notifications
            </Label>
            <Switch id="push-notifications" checked={pushEnabled} onCheckedChange={handlePushToggle} />
          </div>
          {pushEnabled && (
            <Button
              variant="outline"
              onClick={testNotification}
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              Test Notification
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Email Notifications */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-cyan-400" />
            <CardTitle className="text-white">Email Notifications</CardTitle>
          </div>
          <CardDescription className="text-gray-400">Get daily reminders sent to your email address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications" className="text-white">
              Enable email notifications
            </Label>
            <Switch id="email-notifications" checked={emailEnabled} onCheckedChange={handleEmailToggle} />
          </div>
        </CardContent>
      </Card>

      {/* Reminder Time */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-green-400" />
            <CardTitle className="text-white">Reminder Time</CardTitle>
          </div>
          <CardDescription className="text-gray-400">Choose when you want to receive daily reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reminder-time" className="text-white">
              Daily reminder time
            </Label>
            <Input
              id="reminder-time"
              type="time"
              value={reminderTime}
              onChange={(e) => {
                setReminderTime(e.target.value)
                saveSettings()
              }}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
