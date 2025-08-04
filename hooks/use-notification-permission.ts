"use client"

import { useState, useEffect } from "react"

export function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission>("default")

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async (): Promise<NotificationPermission> => {
    if ("Notification" in window) {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result
    }
    return "denied"
  }

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (permission === "granted") {
      return new Notification(title, {
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-72x72.png",
        ...options,
      })
    }
    return null
  }

  return {
    permission,
    requestPermission,
    showNotification,
    isSupported: "Notification" in window,
  }
}
