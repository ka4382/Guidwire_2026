import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getAdminOverview,
  getDisruptionAnalytics,
  getFraudAnalytics,
  getWorkerAnalytics
} from "../services/analytics.service.js";

export const getWorkerAnalyticsById = asyncHandler(async (req, res) => {
  const data = await getWorkerAnalytics(req.params.workerId);
  res.json({ success: true, data });
});

export const getAdminOverviewAnalytics = asyncHandler(async (_req, res) => {
  const data = await getAdminOverview();
  res.json({ success: true, data });
});

export const getAdminFraudAnalytics = asyncHandler(async (_req, res) => {
  const data = await getFraudAnalytics();
  res.json({ success: true, data });
});

export const getAdminDisruptionAnalytics = asyncHandler(async (_req, res) => {
  const data = await getDisruptionAnalytics();
  res.json({ success: true, data });
});

