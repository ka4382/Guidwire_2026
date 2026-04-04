import mongoose from "mongoose";

const riskProfileSchema = new mongoose.Schema(
  {
    riskLevel: { type: String, default: "medium" },
    riskScore: { type: Number, default: 0.5 },
    lastQuotePremium: { type: Number, default: 40 },
    lastCoverageAmount: { type: Number, default: 400 }
  },
  { _id: false }
);

const workerProfileSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    vehicleType: { type: String, default: "bike" },
    avgWeeklyEarnings: { type: Number, default: 4200 },
    avgDailyHours: { type: Number, default: 8 },
    preferredShift: { type: String, default: "peak-mixed" },
    activityScore: { type: Number, default: 0.75 },
    riskProfile: { type: riskProfileSchema, default: () => ({}) }
  },
  { timestamps: true }
);

export const WorkerProfile = mongoose.model("WorkerProfile", workerProfileSchema);

