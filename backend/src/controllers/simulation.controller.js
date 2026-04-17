/**
 * simulation.controller.js
 *
 * Phase 3 demo simulation endpoints.
 * Calls the simulation pipeline service which wraps existing
 * disruption logic with fraud explanation enrichment.
 */

import { asyncHandler } from "../utils/asyncHandler.js";
import {
  simulateRainEvent,
  simulatePollutionEvent,
  simulateFraudCase,
  runSimulationPipeline
} from "../services/simulationPipeline.service.js";

/**
 * POST /api/simulation/rain
 * Body: { zone?: string }
 */
export const simulateRain = asyncHandler(async (req, res) => {
  const zone = req.body.zone || "Koramangala-5th-Block";
  const useRealApi = req.body.useRealApi === true;
  const result = await runSimulationPipeline({ type: "heavy_rainfall", zone, durationHours: 3, useRealApi });
  res.status(201).json({ success: true, data: result });
});

/**
 * POST /api/simulation/pollution
 * Body: { zone?: string }
 */
export const simulatePollution = asyncHandler(async (req, res) => {
  const zone = req.body.zone || "Koramangala";
  const result = await simulatePollutionEvent(zone);
  res.status(201).json({ success: true, data: result });
});

/**
 * POST /api/simulation/fraud
 * Body: { zone?: string }
 */
export const simulateFraud = asyncHandler(async (req, res) => {
  const zone = req.body.zone || "Koramangala";
  const result = await simulateFraudCase(zone);
  res.status(201).json({ success: true, data: result });
});

/**
 * POST /api/simulation/custom
 * Body: { type, zone, darkStoreId?, durationHours? }
 */
export const simulateCustom = asyncHandler(async (req, res) => {
  const { type, zone, darkStoreId, durationHours, useRealApi } = req.body;
  const result = await runSimulationPipeline({ type, zone, darkStoreId, durationHours, useRealApi });
  res.status(201).json({ success: true, data: result });
});
