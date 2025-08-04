"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Settings, User } from "lucide-react"
import Link from "next/link"
import NotificationSettings from "@/components/notification-settings"
import { ThemeToggle } from "@/components/theme-toggle"
import { getUser } from "@/lib/storage"
import DemoEmailViewer from "@/components/demo-email-viewer"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = getUser()
    if (userData) {
      setUser(userData)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200/80 bg-white/80 backdrop-blur-md dark:border-gray-700/50 dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Settings</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Info */}
          <Card className="shadow-sm border-gray-200/60 bg-white/70 backdrop-blur-sm hover:shadow-md transition-all duration-200 dark:bg-gray-800/50 dark:border-gray-700/50">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-gray-900 dark:text-white">Profile</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Your account information
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 px-4 bg-gray-50/80 dark:bg-gray-700/30 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Name</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{user.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-gray-50/80 dark:bg-gray-700/30 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Email</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{user.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-gray-50/80 dark:bg-gray-700/30 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Member since</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <NotificationSettings />

          {/* App Info */}
          <Card className="shadow-sm border-gray-200/60 bg-white/70 backdrop-blur-sm hover:shadow-md transition-all duration-200 dark:bg-gray-800/50 dark:border-gray-700/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-gray-900 dark:text-white">App Information</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                TrackFlow features and capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200/50 dark:border-blue-700/30">
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Version</p>
                  <p className="font-bold text-blue-900 dark:text-blue-100">1.0.0</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200/50 dark:border-purple-700/30">
                  <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">Type</p>
                  <p className="font-bold text-purple-900 dark:text-purple-100">Progressive Web App</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/20 border border-green-200/50 dark:border-green-700/30">
                  <p className="text-sm text-green-700 dark:text-green-300 font-medium">Offline Support</p>
                  <p className="font-bold text-green-900 dark:text-green-100">Enabled</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-cyan-100/50 dark:from-cyan-900/20 dark:to-cyan-800/20 border border-cyan-200/50 dark:border-cyan-700/30">
                  <p className="text-sm text-cyan-700 dark:text-cyan-300 font-medium">Local Storage</p>
                  <p className="font-bold text-cyan-900 dark:text-cyan-100">Available</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mr-2"></div>
                  Features
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50/80 dark:bg-gray-700/30 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Activity Tracking</span>
                    <span className="text-green-600 dark:text-green-400 font-bold flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50/80 dark:bg-gray-700/30 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Progress Analytics</span>
                    <span className="text-green-600 dark:text-green-400 font-bold flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50/80 dark:bg-gray-700/30 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Streak Tracking</span>
                    <span className="text-green-600 dark:text-green-400 font-bold flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50/80 dark:bg-gray-700/30 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Dark/Light Theme</span>
                    <span className="text-green-600 dark:text-green-400 font-bold flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Email Viewer - only show in development */}
          <DemoEmailViewer />
        </div>
      </div>
    </div>
  )
}
