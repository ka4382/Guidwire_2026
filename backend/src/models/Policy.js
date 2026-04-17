import mongoose from "mongoose";

const pricingFactorSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: Number, required: true },
    direction: {
      type: String,
      enum: ["increase", "decrease", "neutral"],
      default: "neutral"
    }
  },
  { _id: false }
);

const policySchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    weeklyPremium: { type: Number, required: true },
    coverageAmount: { type: Number, required: true },
    riskLevel: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    explanation: { type: String, required: true },
    pricingFactors: { type: [pricingFactorSchema], default: [] },
    paymentMethod: { type: String },
    transactionId: { type: String }
  },
  { timestamps: true }
);

export const Policy = mongoose.model("Policy", policySchema);

