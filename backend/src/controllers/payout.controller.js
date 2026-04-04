import { asyncHandler } from "../utils/asyncHandler.js";
import { createPayoutForApprovedClaim, getPayoutsForWorker } from "../services/payout.service.js";

export const processPayout = asyncHandler(async (req, res) => {
  const data = await createPayoutForApprovedClaim(req.body.claimId);
  res.status(201).json({ success: true, data });
});

export const getWorkerPayouts = asyncHandler(async (req, res) => {
  const data = await getPayoutsForWorker(req.params.workerId);
  res.json({ success: true, data });
});

