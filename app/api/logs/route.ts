import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import Log from "@/models/Log"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any
    const logs = await Log.find({ userId: decoded.userId }).populate("activityId")

    return NextResponse.json(logs)
  } catch (error) {
    console.error("Logs fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any
    const { activityId, value, date } = await request.json()

    // Check if log already exists for this activity and date
    const existingLog = await Log.findOne({
      userId: decoded.userId,
      activityId,
      date: new Date(date),
    })

    if (existingLog) {
      // Update existing log
      existingLog.value = value
      await existingLog.save()
      return NextResponse.json(existingLog)
    } else {
      // Create new log
      const log = await Log.create({
        activityId,
        value,
        date: new Date(date),
        userId: decoded.userId,
      })
      return NextResponse.json(log)
    }
  } catch (error) {
    console.error("Log creation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
