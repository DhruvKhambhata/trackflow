import { type NextRequest, NextResponse } from "next/server"
import webpush from "web-push"
import nodemailer from "nodemailer"
import { connectDB } from "@/lib/mongodb"
import PushSubscription from "@/models/PushSubscription"
import EmailSubscription from "@/models/EmailSubscription"

const vapidEmail = process.env.VAPID_EMAIL
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY

if (!vapidEmail || !vapidPublicKey || !vapidPrivateKey) {
  throw new Error("Missing VAPID config: make sure VAPID_EMAIL, VAPID_PUBLIC_KEY, and VAPID_PRIVATE_KEY are set.")
}

webpush.setVapidDetails(
  `mailto:${vapidEmail}`,
  vapidPublicKey,
  vapidPrivateKey
)


// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { type, message, userId } = await request.json()

    if (type === "push") {
      await sendPushNotifications(message, userId)
    } else if (type === "email") {
      await sendEmailNotifications(message, userId)
    } else if (type === "daily-reminder") {
      await sendDailyReminders()
    }

    return NextResponse.json({ message: "Notifications sent successfully" })
  } catch (error) {
    console.error("Send notification error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

async function sendPushNotifications(message: string, userId?: string) {
  const query = userId ? { userId, isActive: true } : { isActive: true }
  const subscriptions = await PushSubscription.find(query)

  const promises = subscriptions.map(async (sub) => {
    try {
      const subscription = JSON.parse(sub.subscription)
      await webpush.sendNotification(subscription, message)
    } catch (error) {
      console.error("Failed to send push notification:", error)
      // Mark subscription as inactive if it fails
      sub.isActive = false
      await sub.save()
    }
  })

  await Promise.all(promises)
}

async function sendEmailNotifications(message: string, userId?: string) {
  const query = userId ? { userId, isActive: true } : { isActive: true }
  const subscriptions = await EmailSubscription.find(query).populate("userId")

  const promises = subscriptions.map(async (sub) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: sub.email,
        subject: "TrackFlow Daily Reminder",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #8b5cf6, #06b6d4); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">TrackFlow</h1>
            </div>
            <div style="padding: 20px; background: #f8fafc;">
              <h2 style="color: #1e293b;">Daily Activity Reminder</h2>
              <p style="color: #475569; font-size: 16px;">${message}</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/log" 
                   style="background: linear-gradient(135deg, #8b5cf6, #06b6d4); 
                          color: white; 
                          padding: 12px 24px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          display: inline-block;">
                  Log Your Activities
                </a>
              </div>
              <p style="color: #64748b; font-size: 14px;">
                Keep up the great work! Consistency is key to building lasting habits.
              </p>
            </div>
            <div style="padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
              <p>You're receiving this because you subscribed to TrackFlow notifications.</p>
              <p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color: #8b5cf6;">
                  Manage your notification preferences
                </a>
              </p>
            </div>
          </div>
        `,
      }

      await transporter.sendMail(mailOptions)
    } catch (error) {
      console.error("Failed to send email notification:", error)
    }
  })

  await Promise.all(promises)
}

async function sendDailyReminders() {
  const now = new Date()
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

  // Send push notifications
  const pushSubs = await PushSubscription.find({
    isActive: true,
    reminderTime: currentTime,
  })

  for (const sub of pushSubs) {
    try {
      const subscription = JSON.parse(sub.subscription)
      await webpush.sendNotification(
        subscription,
        JSON.stringify({
          title: "TrackFlow Daily Reminder",
          body: "Don't forget to log your daily activities! Keep your streak going! 🔥",
          icon: "/icons/icon-192x192.png",
          badge: "/icons/icon-72x72.png",
          data: { url: "/log" },
        }),
      )
    } catch (error) {
      console.error("Failed to send daily push reminder:", error)
      sub.isActive = false
      await sub.save()
    }
  }

  // Send email notifications
  const emailSubs = await EmailSubscription.find({
    isActive: true,
    reminderTime: currentTime,
  }).populate("userId")

  for (const sub of emailSubs) {
    try {
      const user = sub.userId as any
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: sub.email,
        subject: "🔥 TrackFlow Daily Reminder - Keep Your Streak Going!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #8b5cf6, #06b6d4); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">TrackFlow</h1>
              <p style="color: white; margin: 10px 0 0 0;">Daily Activity Tracker</p>
            </div>
            <div style="padding: 20px; background: #f8fafc;">
              <h2 style="color: #1e293b;">Hi ${user.name}! 👋</h2>
              <p style="color: #475569; font-size: 16px;">
                It's time for your daily check-in! Don't let your streak break - log your activities now.
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6;">
                <h3 style="color: #8b5cf6; margin: 0 0 10px 0;">💪 Stay Consistent</h3>
                <p style="color: #475569; margin: 0;">
                  Small daily actions lead to big results. Take a moment to log your progress!
                </p>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/log" 
                   style="background: linear-gradient(135deg, #8b5cf6, #06b6d4); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          display: inline-block;
                          font-weight: bold;">
                  📝 Log Activities Now
                </a>
              </div>
              <div style="display: flex; gap: 20px; margin: 20px 0;">
                <div style="flex: 1; text-align: center; padding: 15px; background: white; border-radius: 8px;">
                  <div style="font-size: 24px;">📊</div>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/analytics" style="color: #8b5cf6; text-decoration: none;">
                    View Analytics
                  </a>
                </div>
                <div style="flex: 1; text-align: center; padding: 15px; background: white; border-radius: 8px;">
                  <div style="font-size: 24px;">🎯</div>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="color: #8b5cf6; text-decoration: none;">
                    Dashboard
                  </a>
                </div>
              </div>
            </div>
            <div style="padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
              <p>You're receiving this daily reminder because you subscribed to TrackFlow notifications.</p>
              <p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color: #8b5cf6;">
                  Manage notification preferences
                </a> | 
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color: #8b5cf6;">
                  Unsubscribe
                </a>
              </p>
            </div>
          </div>
        `,
      }

      await transporter.sendMail(mailOptions)
    } catch (error) {
      console.error("Failed to send daily email reminder:", error)
    }
  }
}
