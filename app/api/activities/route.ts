import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import Activity from "@/models/Activity"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any
    const activities = await Activity.find({ userId: decoded.userId })

    return NextResponse.json(activities)
  } catch (error) {
    console.error("Activities fetch error:", error)
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
    const { name, category, target, unit, color } = await request.json()

    const activity = await Activity.create({
      name,
      category,
      target,
      unit,
      color,
      userId: decoded.userId,
    })

    return NextResponse.json(activity)
  } catch (error) {
    console.error("Activity creation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
