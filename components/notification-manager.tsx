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
          console.log("SW registered successfully:", registration)

          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  toast({
                    title: "App updated!",
                    description: "A new version is available. Refresh to update.",
                  })
                }
              })
            }
          })
        })
        .catch((registrationError) => {
          console.log("SW registration failed:", registrationError)
        })
    }

    // Request notification permission after user interaction
    const requestNotificationPermission = async () => {
      if ("Notification" in window && Notification.permission === "default") {
        // Don't auto-request, let user enable in settings
        console.log("Notification permission is default, user can enable in settings")
      }
    }

    // Check if app was launched from home screen
    if (window.matchMedia("(display-mode: standalone)").matches) {
      console.log("App is running in standalone mode")
      toast({
        title: "Welcome to TrackFlow!",
        description: "App installed successfully. Start tracking your activities!",
      })
    }

    requestNotificationPermission()
  }, [toast])

  return null
}
