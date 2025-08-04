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

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0]

    const logs = await Log.find({
      userId: decoded.userId,
      date: {
        $gte: new Date(today),
        $lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000),
      },
    }).populate("activityId")

    return NextResponse.json(logs)
  } catch (error) {
    console.error("Today's logs fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
