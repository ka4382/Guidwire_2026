import { asyncHandler } from "../utils/asyncHandler.js";
import { calculatePremium, getLatestPremium } from "../services/premium.service.js";

export const calculatePremiumQuote = asyncHandler(async (req, res) => {
  const data = await calculatePremium(req.body.workerId);
  res.json({ success: true, data });
});

export const getLatestPremiumQuote = asyncHandler(async (req, res) => {
  const data = await getLatestPremium(req.params.workerId);
  res.json({ success: true, data });
});

