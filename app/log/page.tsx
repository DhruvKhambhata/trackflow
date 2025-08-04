"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Activity, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { getActivities, saveLog, generateId, getTodayString } from "@/lib/storage"

interface ActivityType {
  id: string
  name: string
  category: string
  target: number
  unit: string
  color: string
  emoji: string
}

export default function LogActivityPage() {
  const [activities, setActivities] = useState<ActivityType[]>([])
  const [selectedActivity, setSelectedActivity] = useState("")
  const [value, setValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingActivities, setIsLoadingActivities] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = () => {
    try {
      const allActivities = getActivities()
      setActivities(allActivities)
    } catch (error) {
      console.error("Error fetching activities:", error)
    } finally {
      setIsLoadingActivities(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const log = {
        id: generateId(),
        activityId: selectedActivity,
        value: Number.parseFloat(value),
        date: getTodayString(),
        createdAt: new Date().toISOString(),
      }

      saveLog(log)

      const activity = activities.find((a) => a.id === selectedActivity)
      toast({
        title: "Activity logged!",
        description: `${activity?.emoji} ${value} ${activity?.unit} recorded for ${activity?.name}`,
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log activity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const selectedActivityData = activities.find((a) => a.id === selectedActivity)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">Log Activity</h1>
            <p className="text-sm text-muted-foreground">Record your daily progress</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Record Your Progress
              </CardTitle>
              <CardDescription>Log your daily activity progress</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingActivities ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading activities...</p>
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No activities found</h3>
                  <p className="text-muted-foreground mb-4">Create your first activity to start logging progress</p>
                  <Link href="/activities/new">
                    <Button>Create Your First Activity</Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="activity">Select Activity</Label>
                    <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an activity to log" />
                      </SelectTrigger>
                      <SelectContent>
                        {activities.map((activity) => (
                          <SelectItem key={activity.id} value={activity.id}>
                            <div className="flex items-center space-x-2">
                              <span>{activity.emoji}</span>
                              <span>{activity.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedActivityData && (
                    <div className="p-4 rounded-lg border bg-muted/50">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">{selectedActivityData.emoji}</span>
                        <h3 className="font-medium">{selectedActivityData.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Target: {selectedActivityData.target} {selectedActivityData.unit} • Category:{" "}
                        {selectedActivityData.category}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="value">Value {selectedActivityData && `(${selectedActivityData.unit})`}</Label>
                    <Input
                      id="value"
                      type="number"
                      step="0.1"
                      placeholder={selectedActivityData ? `Enter value in ${selectedActivityData.unit}` : "Enter value"}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Link href="/dashboard" className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent">
                        Cancel
                      </Button>
                    </Link>
                    <Button type="submit" className="flex-1" disabled={isLoading || !selectedActivity || !value}>
                      {isLoading ? (
                        "Logging..."
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Log Activity
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
