import mongoose from "mongoose"

const ActivitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    target: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    emoji: {
      type: String,
      required: true,
      default: "⭐",
    },
    reminderTime: {
      type: String,
      required: true,
      default: "20:00",
    },
    reminderEnabled: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Activity || mongoose.model("Activity", ActivitySchema)
