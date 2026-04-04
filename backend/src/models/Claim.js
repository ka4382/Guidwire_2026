import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    policyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Policy",
      required: true
    },
    disruptionEventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DisruptionEvent",
      required: true
    },
    claimStatus: {
      type: String,
      enum: ["created", "pending", "approved", "flagged", "rejected", "paid"],
      default: "created"
    },
    fraudScore: { type: Number, default: 0 },
    decision: { type: String, default: "created" },
    payoutAmount: { type: Number, default: 0 },
    lossWindowHours: { type: Number, default: 0 },
    reasons: { type: [String], default: [] }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const Claim = mongoose.model("Claim", claimSchema);

