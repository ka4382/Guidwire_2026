import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getDisruptionHistory,
  getLiveDisruptions,
  simulateDisruption
} from "../services/disruption.service.js";

export const getLiveDisruptionFeed = asyncHandler(async (req, res) => {
  const data = await getLiveDisruptions(req.query.zone);
  res.json({ success: true, data });
});

export const simulateDisruptionEvent = asyncHandler(async (req, res) => {
  const data = await simulateDisruption(req.body);
  res.status(201).json({ success: true, data });
});

export const getDisruptionHistoryFeed = asyncHandler(async (_req, res) => {
  const data = await getDisruptionHistory();
  res.json({ success: true, data });
});

