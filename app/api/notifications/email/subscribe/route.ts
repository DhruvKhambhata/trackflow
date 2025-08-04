import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import EmailSubscription from "@/models/EmailSubscription"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any
    const { email, reminderTime } = await request.json()

    // Save or update email subscription
    await EmailSubscription.findOneAndUpdate(
      { userId: decoded.userId },
      {
        userId: decoded.userId,
        email,
        reminderTime,
        isActive: true,
      },
      { upsert: true },
    )

    return NextResponse.json({ message: "Email subscription saved successfully" })
  } catch (error) {
    console.error("Email subscription error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
