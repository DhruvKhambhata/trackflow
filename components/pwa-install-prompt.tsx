"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, X } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("beforeinstallprompt event fired")
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Check if user has dismissed the prompt before
      const dismissed = localStorage.getItem("pwa-install-dismissed")
      if (!dismissed) {
        // Show prompt after a short delay
        setTimeout(() => setShowInstallPrompt(true), 3000)
      }
    }

    const handleAppInstalled = () => {
      console.log("PWA was installed")
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
      localStorage.removeItem("pwa-install-dismissed")
    }

    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true) {
      setIsInstalled(true)
      return
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    // Show prompt after a delay for browsers that support PWA but don't fire beforeinstallprompt immediately
    const timer = setTimeout(() => {
      if (!isInstalled && !localStorage.getItem("pwa-install-dismissed")) {
        // Check if we're on a supported browser
        const isSupported = "serviceWorker" in navigator && "PushManager" in window
        if (isSupported) {
          setShowInstallPrompt(true)
        }
      }
    }, 15000) // Show after 15 seconds

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
      clearTimeout(timer)
    }
  }, [isInstalled])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to the install prompt: ${outcome}`)

      if (outcome === "accepted") {
        setDeferredPrompt(null)
        setShowInstallPrompt(false)
      }
    } else {
      // Fallback for browsers without beforeinstallprompt
      alert(
        "To install this app:\n\n" +
          "Chrome/Edge: Click the menu (⋮) → 'Install TrackFlow'\n" +
          "Safari: Click Share → 'Add to Home Screen'\n" +
          "Firefox: Click the menu → 'Install'",
      )
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    localStorage.setItem("pwa-install-dismissed", Date.now().toString())

    // Auto-show again after 3 days instead of 7
    setTimeout(
      () => {
        localStorage.removeItem("pwa-install-dismissed")
      },
      3 * 24 * 60 * 60 * 1000,
    )
  }

  // Don't show if already installed
  if (isInstalled || !showInstallPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Card className="bg-white/95 dark:bg-gray-900/95 border-gray-200 dark:border-gray-700 backdrop-blur-md shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shadow-sm">
                <img src="/icon-192x192.png" alt="TrackFlow" className="w-full h-full object-cover" />
              </div>
              <div>
                <CardTitle className="text-gray-900 dark:text-white text-lg">Install TrackFlow</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Get the full app experience
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              • Works offline • Push notifications • Faster loading • Native app feel
            </div>
            <Button
              onClick={handleInstallClick}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Install App
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
