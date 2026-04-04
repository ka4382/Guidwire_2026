import { Router } from "express";

import {
  getAdminDisruptionAnalytics,
  getAdminFraudAnalytics,
  getAdminOverviewAnalytics,
  getWorkerAnalyticsById
} from "../controllers/analytics.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const analyticsRouter = Router();

analyticsRouter.get("/worker/:workerId", requireAuth, getWorkerAnalyticsById);
analyticsRouter.get("/admin/overview", requireAuth, requireRole("admin"), getAdminOverviewAnalytics);
analyticsRouter.get("/admin/fraud", requireAuth, requireRole("admin"), getAdminFraudAnalytics);
analyticsRouter.get("/admin/disruptions", requireAuth, requireRole("admin"), getAdminDisruptionAnalytics);

