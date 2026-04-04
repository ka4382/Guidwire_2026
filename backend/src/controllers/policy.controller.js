import { asyncHandler } from "../utils/asyncHandler.js";
import {
  activatePolicy,
  cancelPolicy,
  createPolicy,
  getPoliciesByWorker
} from "../services/policy.service.js";

export const createWorkerPolicy = asyncHandler(async (req, res) => {
  const data = await createPolicy(req.body.workerId, req.body.startDate);
  res.status(201).json({ success: true, data });
});

export const getWorkerPolicies = asyncHandler(async (req, res) => {
  const data = await getPoliciesByWorker(req.params.workerId);
  res.json({ success: true, data });
});

export const activateWorkerPolicy = asyncHandler(async (req, res) => {
  const data = await activatePolicy(req.params.policyId);
  res.json({ success: true, data });
});

export const cancelWorkerPolicy = asyncHandler(async (req, res) => {
  const data = await cancelPolicy(req.params.policyId);
  res.json({ success: true, data });
});

