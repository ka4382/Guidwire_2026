/**
 * simulationPipeline.service.js
 *
 * Phase 3 orchestration layer for demo simulations.
 *
 * Wraps existing disruption simulation logic with the new fraud
 * explainer to produce a complete, demo-ready pipeline result:
 *
 *   Trigger → Disruption Event → Claim → Fraud Explain → Payout
 *
 * Does NOT modify any existing service — it imports and wraps them.
 */

import { simulateDisruption } from "./disruption.service.js";
import { explainFraud } from "./fraudExplainer.service.js";
import { getWeatherData } from "./weather.service.js";

/**
 * Run a full simulation pipeline for a given disruption type and zone.
 *
 * @param {object} params
 * @param {string} params.type  — heavy_rainfall | severe_pollution | gps_spoof_attack | etc.
 * @param {string} params.zone  — e.g. "Koramangala"
 * @param {string} [params.darkStoreId]
 * @param {number} [params.durationHours]
 * @param {boolean} [params.useRealApi] — Whether to query Open-Meteo live API first
 * @returns {Promise<object>}  full pipeline result
 */
export async function runSimulationPipeline({
  type,
  zone,
  darkStoreId,
  durationHours,
  useRealApi = false
}) {
  const startTime = Date.now();
  try {
    let triggeredType = type;
    let eventDataOverrides = null;

    // ── Phase 3: Real Weather Integration ──
    if (useRealApi && type === "heavy_rainfall") {
      try {
        const liveWeather = await getWeatherData(zone);
        if (liveWeather) {
           console.log(`[SimulationPipeline] Live weather for ${zone}: ${liveWeather.condition} (${liveWeather.rainfall_mm}mm)`);
           // If live weather says it's raining heavily, map it properly.
           if (liveWeather.rainfall_mm > 15 || liveWeather.condition === "Thunderstorm") {
              triggeredType = "heavy_rainfall";
           } else if (liveWeather.rainfall_mm > 0) {
              // It is raining, but not super heavy. Let's still trigger for demo purposes, 
              // but we pass the actual live rainfall amount.
              triggeredType = "heavy_rainfall";
              eventDataOverrides = { rainfall: liveWeather.rainfall_mm };
           } else {
              // No rain. For demo mode if user specifically asked for "useRealApi", 
              // we can throw to trigger fallback, or just process it as a 'mock rain' anyway 
              // to ensure the demo continues. Let's make it throw to trigger the fallback block below.
              console.warn("[SimulationPipeline] Live weather shows no rain. Falling back to simulation logic to force event for demo.");
              throw new Error("No live rain detected.");
           }
        } else {
           throw new Error("Live weather API returned null");
        }
      } catch (err) {
        console.warn(`[SimulationPipeline] Live API failed or no rain: ${err.message}. Relying on pure simulation fallback.`);
        // Fallback: type remains what passed in originally, simulation runs normally.
        triggeredType = type;
      }
    }

    // Step 1: Use existing disruption simulator (creates event + claims + payouts)
    const simulation = await simulateDisruption({
      type: triggeredType,
      zone,
      darkStoreId,
      durationHours,
      ...(eventDataOverrides && { overrides: eventDataOverrides })
    });

    // Step 2: Enrich each claim result with fraud explanations
    const enrichedClaims = await Promise.all(
      (simulation.claims || []).map(async (claimResult) => {
        let fraudExplanation = null;

        try {
          if (claimResult.fraud) {
            fraudExplanation = await explainFraud(claimResult.fraud);
          }
        } catch {
          // Non-critical — fraud explanation is additive
          fraudExplanation = null;
        }

        return {
          workerId: claimResult.workerId,
          workerName: claimResult.workerName,
          claim: claimResult.claim,
          fraud: claimResult.fraud,
          fraudExplanation,
          fraudSignal: claimResult.fraudSignal,
          payout: claimResult.payout
        };
      })
    );

    return {
      success: true,
      event: simulation.event,
      affectedWorkers: simulation.affectedWorkers,
      claims: enrichedClaims,
      summary: {
        totalClaims: enrichedClaims.length,
        approved: enrichedClaims.filter(
          (c) => c.claim?.decision === "approved"
        ).length,
        flagged: enrichedClaims.filter(
          (c) => c.claim?.decision === "flagged"
        ).length,
        rejected: enrichedClaims.filter(
          (c) => c.claim?.decision === "rejected"
        ).length,
        totalPayout: enrichedClaims.reduce(
          (sum, c) => sum + (c.payout?.amount || 0),
          0
        ),
        processingTimeMs: Date.now() - startTime
      }
    };
  } catch (error) {
    console.error("[SimulationPipeline] Error:", error.message);
    return {
      success: false,
      error: error.message,
      event: null,
      affectedWorkers: 0,
      claims: [],
      summary: {
        totalClaims: 0,
        approved: 0,
        flagged: 0,
        rejected: 0,
        totalPayout: 0,
        processingTimeMs: Date.now() - startTime
      }
    };
  }
}

/**
 * Convenience method: simulate rain event.
 */
export function simulateRainEvent(zone = "Koramangala") {
  return runSimulationPipeline({ type: "heavy_rainfall", zone, durationHours: 3 });
}

/**
 * Convenience method: simulate pollution event.
 */
export function simulatePollutionEvent(zone = "Koramangala") {
  return runSimulationPipeline({ type: "severe_pollution", zone, durationHours: 2 });
}

/**
 * Convenience method: simulate fraud (GPS spoof attack).
 */
export function simulateFraudCase(zone = "Koramangala") {
  return runSimulationPipeline({ type: "gps_spoof_attack", zone, durationHours: 3 });
}
