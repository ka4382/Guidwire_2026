import mongoose from "mongoose";

const payoutMethodSchema = new mongoose.Schema(
  {
    provider: { type: String, default: "mock-razorpay" },
    upiId: { type: String, default: "" },
    accountName: { type: String, default: "" }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["worker", "admin"],
      default: "worker"
    },
    city: { type: String, required: true, default: "Bengaluru" },
    assignedZone: { type: String, required: true },
    darkStoreId: { type: String, required: true },
    payoutMethod: { type: payoutMethodSchema, default: () => ({}) }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const User = mongoose.model("User", userSchema);

