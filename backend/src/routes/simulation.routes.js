/**
 * simulation.routes.js
 *
 * Phase 3 demo simulation API routes.
 */

import { Router } from "express";

import { requireAuth } from "../middleware/auth.js";
import {
  simulateRain,
  simulatePollution,
  simulateFraud,
  simulateCustom
} from "../controllers/simulation.controller.js";

export const simulationRouter = Router();

// POST /api/simulation/rain       — Simulate heavy rainfall
simulationRouter.post("/rain", requireAuth, simulateRain);

// POST /api/simulation/pollution   — Simulate severe pollution
simulationRouter.post("/pollution", requireAuth, simulatePollution);

// POST /api/simulation/fraud       — Simulate GPS spoof / fraud case
simulationRouter.post("/fraud", requireAuth, simulateFraud);

// POST /api/simulation/custom      — Simulate any disruption type
simulationRouter.post("/custom", requireAuth, simulateCustom);
