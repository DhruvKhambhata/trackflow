"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { saveLog, generateId, getTodayString } from "@/lib/storage"

interface Activity {
  id: string
  name: string
  category: string
  target: number
  unit: string
  color: string
  emoji: string
}

interface QuickLogDialogProps {
  activity: Activity | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function QuickLogDialog({ activity, isOpen, onClose, onSuccess }: QuickLogDialogProps) {
  const [value, setValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activity) return

    setIsLoading(true)

    try {
      const log = {
        id: generateId(),
        activityId: activity.id,
        value: Number.parseFloat(value),
        date: getTodayString(),
        createdAt: new Date().toISOString(),
      }

      saveLog(log)

      toast({
        title: "Activity logged!",
        description: `${activity.emoji} ${value} ${activity.unit} recorded for ${activity.name}`,
      })

      setValue("")
      onSuccess()
      onClose()
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

  const handleQuickLog = (quickValue: number) => {
    setValue(quickValue.toString())
  }

  if (!activity) return null

  const quickValues = [
    Math.round(activity.target * 0.5),
    activity.target,
    Math.round(activity.target * 1.5),
    activity.target * 2,
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: activity.color + "20" }}
              >
                {activity.emoji}
              </div>
              <div>
                <DialogTitle>Quick Log</DialogTitle>
                <DialogDescription>{activity.name}</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="value">How much did you do?</Label>
            <Input
              id="value"
              type="number"
              step="0.1"
              placeholder={`Enter value in ${activity.unit}`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">
              Target: {activity.target} {activity.unit}
            </p>
          </div>

          {/* Quick value buttons */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Select</Label>
            <div className="grid grid-cols-2 gap-2">
              {quickValues.map((quickValue, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  onClick={() => handleQuickLog(quickValue)}
                  className="text-sm"
                >
                  {quickValue} {activity.unit}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading || !value}>
              {isLoading ? (
                "Logging..."
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Log It!
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
