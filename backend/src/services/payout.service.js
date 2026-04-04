import crypto from "crypto";

import { Payout } from "../models/Payout.js";
import { Claim } from "../models/Claim.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { callAi } from "./aiEngine.service.js";

export async function createPayoutForApprovedClaim(claimId) {
  const claim = await Claim.findById(claimId);

  if (!claim) {
    throw new ApiError(404, "Claim not found");
  }

  if (!["approved", "paid"].includes(claim.claimStatus) && claim.decision !== "approved") {
    throw new ApiError(400, "Claim is not approved for payout");
  }

  const existingPayout = await Payout.findOne({ claimId }).lean();
  if (existingPayout) {
    return existingPayout;
  }

  const worker = await User.findById(claim.workerId).lean();

  const payout = await callAi(
    "/ai/payout-execute",
    {
      claim_id: claim._id.toString(),
      worker_id: claim.workerId.toString(),
      approved_claim: {
        payoutAmount: claim.payoutAmount,
        decision: claim.decision
      },
      payout_account_details: worker?.payoutMethod || {}
    },
    () => ({
      simulated_payout_id: `payout_${crypto.randomUUID().slice(0, 8)}`,
      payout_status: "completed",
      payout_timestamp: new Date().toISOString(),
      provider: "mock-razorpay"
    })
  );

  const payoutRecord = await Payout.create({
    claimId,
    workerId: claim.workerId,
    amount: claim.payoutAmount,
    payoutStatus: payout.payout_status,
    provider: payout.provider,
    providerReference: payout.simulated_payout_id,
    processedAt: payout.payout_timestamp
  });

  claim.claimStatus = payout.payout_status === "completed" ? "paid" : "approved";
  await claim.save();

  return payoutRecord;
}

export async function getPayoutsForWorker(workerId) {
  return Payout.find({ workerId }).sort({ createdAt: -1 }).lean();
}

