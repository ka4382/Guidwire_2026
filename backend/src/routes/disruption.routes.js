import { Router } from "express";

import {
  getDisruptionHistoryFeed,
  getLiveDisruptionFeed,
  simulateDisruptionEvent
} from "../controllers/disruption.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";
import { simulateDisruptionSchema } from "../validators/disruption.validator.js";

export const disruptionRouter = Router();

disruptionRouter.get("/live", requireAuth, getLiveDisruptionFeed);
disruptionRouter.post(
  "/simulate",
  requireAuth,
  requireRole("admin"),
  validateRequest(simulateDisruptionSchema),
  simulateDisruptionEvent
);
disruptionRouter.get("/history", requireAuth, getDisruptionHistoryFeed);

