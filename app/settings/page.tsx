"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Settings, User } from "lucide-react"
import Link from "next/link"
import NotificationSettings from "@/components/notification-settings"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    fetchUser()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Settings</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Info */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-purple-400" />
                <CardTitle className="text-white">Profile</CardTitle>
              </div>
              <CardDescription className="text-gray-400">Your account information</CardDescription>
            </CardHeader>
            <CardContent>
              {user && (
                <div className="space-y-2">
                  <p className="text-white">
                    <span className="text-gray-400">Name:</span> {user.name}
                  </p>
                  <p className="text-white">
                    <span className="text-gray-400">Email:</span> {user.email}
                  </p>
                  <p className="text-white">
                    <span className="text-gray-400">Member since:</span> {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <NotificationSettings />

          {/* App Info */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">App Information</CardTitle>
              <CardDescription className="text-gray-400">TrackFlow PWA features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Version</p>
                  <p className="text-white">1.0.0</p>
                </div>
                <div>
                  <p className="text-gray-400">Type</p>
                  <p className="text-white">Progressive Web App</p>
                </div>
                <div>
                  <p className="text-gray-400">Offline Support</p>
                  <p className="text-green-400">Enabled</p>
                </div>
                <div>
                  <p className="text-gray-400">Push Notifications</p>
                  <p className="text-cyan-400">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
