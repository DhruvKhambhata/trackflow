"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export default function NotificationManager() {
  const { toast } = useToast()

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration)
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError)
        })
    }

    // Request notification permission
    const requestNotificationPermission = async () => {
      if ("Notification" in window && Notification.permission === "default") {
        const permission = await Notification.requestPermission()
        if (permission === "granted") {
          toast({
            title: "Notifications enabled!",
            description: "You'll receive daily reminders to track your activities.",
          })
        }
      }
    }

    // Auto-request permission after a delay
    const timer = setTimeout(requestNotificationPermission, 5000)

    return () => clearTimeout(timer)
  }, [toast])

  return null
}
