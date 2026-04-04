import { asyncHandler } from "../utils/asyncHandler.js";
import {
  fileManualClaim,
  getAllClaimsForAdmin,
  getClaimDetails,
  getClaimsForWorker,
  getPendingClaimsForAdmin,
  reviewClaim,
  triggerClaimForWorker
} from "../services/claim.service.js";

export const triggerClaim = asyncHandler(async (req, res) => {
  const data = await triggerClaimForWorker(req.body.workerId, req.body.disruptionEventId);
  res.status(201).json({ success: true, data });
});

export const getWorkerClaims = asyncHandler(async (req, res) => {
  const data = await getClaimsForWorker(req.params.workerId);
  res.json({ success: true, data });
});

export const getClaimById = asyncHandler(async (req, res) => {
  const data = await getClaimDetails(req.params.claimId);
  res.json({ success: true, data });
});

export const reviewClaimDecision = asyncHandler(async (req, res) => {
  const data = await reviewClaim(req.params.claimId, req.body.action, req.body.notes);
  res.json({ success: true, data });
});

export const fileClaimManually = asyncHandler(async (req, res) => {
  const data = await fileManualClaim(
    req.body.workerId,
    req.body.eventType,
    req.body.description,
    req.body.zone
  );
  res.status(201).json({ success: true, data });
});

export const getAdminPendingClaims = asyncHandler(async (req, res) => {
  const data = await getPendingClaimsForAdmin();
  res.json({ success: true, data });
});

export const getAdminAllClaims = asyncHandler(async (req, res) => {
  const data = await getAllClaimsForAdmin();
  res.json({ success: true, data });
});

