import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema(
  {
    claimId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Claim",
      required: true
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    amount: { type: Number, required: true },
    payoutStatus: {
      type: String,
      enum: ["queued", "processing", "completed", "failed"],
      default: "queued"
    },
    provider: { type: String, default: "mock-razorpay" },
    providerReference: { type: String, required: true },
    processedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Payout = mongoose.model("Payout", payoutSchema);

