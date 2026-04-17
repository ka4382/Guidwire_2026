/**
 * dashboard.routes.js
 *
 * Phase 3 dashboard API routes.
 */

import { Router } from "express";

import { requireAuth } from "../middleware/auth.js";
import {
  getWorkerDashboard,
  getAdminDashboard
} from "../controllers/dashboard.controller.js";

export const dashboardRouter = Router();

// GET /api/dashboard/worker/:workerId  — Worker's intelligent dashboard
dashboardRouter.get("/worker/:workerId", requireAuth, getWorkerDashboard);

// GET /api/dashboard/admin  — Admin intelligent dashboard
dashboardRouter.get("/admin", requireAuth, getAdminDashboard);
