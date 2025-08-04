import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import PushSubscription from "@/models/PushSubscription"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any
    const { subscription, reminderTime } = await request.json()

    // Save or update push subscription
    await PushSubscription.findOneAndUpdate(
      { userId: decoded.userId },
      {
        userId: decoded.userId,
        subscription: JSON.stringify(subscription),
        reminderTime,
        isActive: true,
      },
      { upsert: true },
    )

    return NextResponse.json({ message: "Subscription saved successfully" })
  } catch (error) {
    console.error("Push subscription error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
