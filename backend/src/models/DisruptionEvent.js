import mongoose from "mongoose";

const evidenceSchema = new mongoose.Schema(
  {
    source: { type: String, required: true },
    summary: { type: String, required: true },
    payload: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { _id: false }
);

const disruptionEventSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    zone: { type: String, required: true },
    darkStoreId: { type: String, required: true },
    severity: { type: String, required: true },
    source: { type: String, required: true },
    thresholdValue: { type: Number, required: true },
    observedValue: { type: Number, required: true },
    startedAt: { type: Date, required: true },
    endedAt: { type: Date, required: true },
    isTriggerActive: { type: Boolean, default: true },
    recommendedClaimWindow: { type: Number, default: 3 },
    evidence: { type: [evidenceSchema], default: [] }
  },
  { timestamps: true }
);

export const DisruptionEvent = mongoose.model(
  "DisruptionEvent",
  disruptionEventSchema
);

