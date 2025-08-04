"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Mail, Eye, Trash2 } from "lucide-react"
import { getDemoEmails, clearDemoEmails } from "@/lib/email-service"
import { useToast } from "@/hooks/use-toast"

interface DemoEmail {
  to: string
  subject: string
  html: string
  sentAt: string
  type: string
}

export default function DemoEmailViewer() {
  const [emails, setEmails] = useState<DemoEmail[]>([])
  const [selectedEmail, setSelectedEmail] = useState<DemoEmail | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadEmails()
  }, [])

  const loadEmails = () => {
    const demoEmails = getDemoEmails()
    setEmails(demoEmails)
  }

  const handleClearEmails = () => {
    clearDemoEmails()
    setEmails([])
    toast({
      title: "Emails cleared",
      description: "All demo emails have been removed.",
    })
  }

  if (emails.length === 0) {
    return null
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-blue-600" />
            <div>
              <CardTitle>Demo Emails ({emails.length})</CardTitle>
              <CardDescription>Emails that would be sent in production</CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleClearEmails}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {emails.map((email, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-sm">{email.subject}</p>
                <p className="text-xs text-muted-foreground">To: {email.to}</p>
                <p className="text-xs text-muted-foreground">{new Date(email.sentAt).toLocaleString()}</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setSelectedEmail(email)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{email.subject}</DialogTitle>
                    <DialogDescription>Email that would be sent to: {email.to}</DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    <div className="border rounded-lg p-4 bg-white" dangerouslySetInnerHTML={{ __html: email.html }} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
