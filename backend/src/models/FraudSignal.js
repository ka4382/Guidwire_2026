import mongoose from "mongoose";

const fraudSignalSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    gpsStabilityScore: { type: Number, default: 0 },
    movementRatio: { type: Number, default: 0 },
    activityMatch: { type: Number, default: 0 },
    networkConsistency: { type: Number, default: 0 },
    anomalyScore: { type: Number, default: 0 },
    flaggedReasons: { type: [String], default: [] },
    recordedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const FraudSignal = mongoose.model("FraudSignal", fraudSignalSchema);

