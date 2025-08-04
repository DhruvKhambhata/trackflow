"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { saveActivity, generateId } from "@/lib/storage"

const categories = [
  { name: "Health & Fitness", emoji: "💪", color: "#ef4444" },
  { name: "Learning", emoji: "📚", color: "#3b82f6" },
  { name: "Work", emoji: "💼", color: "#8b5cf6" },
  { name: "Personal", emoji: "🧘", color: "#10b981" },
  { name: "Social", emoji: "👥", color: "#f59e0b" },
  { name: "Creative", emoji: "🎨", color: "#ec4899" },
  { name: "Other", emoji: "⭐", color: "#6b7280" },
]

const activityEmojis = [
  "💪",
  "🏃",
  "🚴",
  "🏊",
  "🧘",
  "📚",
  "✍️",
  "🎨",
  "🎵",
  "🍎",
  "💧",
  "😴",
  "🧠",
  "💼",
  "📱",
  "🎯",
  "🌱",
  "🔥",
  "⚡",
  "🌟",
  "🏋️",
  "🚶",
  "🧘‍♀️",
  "📖",
  "💻",
  "🎪",
  "🎭",
  "🎬",
  "📷",
  "🎸",
]

const colors = [
  "#ef4444",
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#6b7280",
  "#14b8a6",
  "#f97316",
  "#84cc16",
]

export default function NewActivityPage() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    target: "",
    unit: "",
    color: colors[0],
    emoji: activityEmojis[0],
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const activity = {
        id: generateId(),
        name: formData.name,
        category: formData.category,
        target: Number.parseInt(formData.target),
        unit: formData.unit,
        color: formData.color,
        emoji: formData.emoji,
        createdAt: new Date().toISOString(),
      }

      saveActivity(activity)

      toast({
        title: "Activity created!",
        description: `${activity.emoji} ${activity.name} has been added to your activities.`,
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create activity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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
            <h1 className="text-xl font-bold">Create New Activity</h1>
            <p className="text-sm text-muted-foreground">Add a new activity to track your progress</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                New Activity
              </CardTitle>
              <CardDescription>
                Create a custom activity to track your daily progress and build better habits.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Activity Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Morning Workout, Read Books, Drink Water"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          <div className="flex items-center space-x-2">
                            <span>{category.emoji}</span>
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target">Daily Target</Label>
                    <Input
                      id="target"
                      type="number"
                      placeholder="e.g., 1, 30, 8"
                      value={formData.target}
                      onChange={(e) => handleChange("target", e.target.value)}
                      required
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      placeholder="e.g., times, minutes, glasses"
                      value={formData.unit}
                      onChange={(e) => handleChange("unit", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Choose Emoji</Label>
                  <div className="grid grid-cols-10 gap-2">
                    {activityEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        className={`p-2 text-2xl rounded-md border-2 transition-colors hover:bg-muted ${
                          formData.emoji === emoji
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-muted-foreground"
                        }`}
                        onClick={() => handleChange("emoji", emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Color Theme</Label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                          formData.color === color ? "border-foreground scale-110" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleChange("color", color)}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4 pt-6">
                  <Link href="/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Activity"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
