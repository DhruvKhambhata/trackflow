import mongoose from "mongoose"

const PushSubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscription: {
      type: String,
      required: true,
    },
    reminderTime: {
      type: String,
      required: true,
      default: "20:00",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.PushSubscription || mongoose.model("PushSubscription", PushSubscriptionSchema)
