import { describe, expect, it } from "vitest";

import { calculateRiskQuoteFromInputs } from "../src/services/premium.service.js";

describe("calculateRiskQuoteFromInputs", () => {
  it("returns a low-risk weekly premium within expected bounds", () => {
    const quote = calculateRiskQuoteFromInputs({
      zoneRiskScore: 0.22,
      historicalDisruptionFrequency: 0.18,
      weatherForecastSeverity: 0.21,
      workerActivityConsistency: 0.9,
      pollutionHistory: 0.14,
      floodProneFactor: 0.08,
      safeZoneDiscount: 2
    });

    expect(quote.weekly_premium).toBeGreaterThanOrEqual(18);
    expect(quote.weekly_premium).toBeLessThanOrEqual(40);
    expect(["low", "medium"]).toContain(quote.risk_level);
  });

  it("raises the weekly premium for highly exposed zones", () => {
    const quote = calculateRiskQuoteFromInputs({
      zoneRiskScore: 0.8,
      historicalDisruptionFrequency: 0.74,
      weatherForecastSeverity: 0.9,
      workerActivityConsistency: 0.44,
      pollutionHistory: 0.68,
      floodProneFactor: 0.52,
      safeZoneDiscount: 0
    });

    expect(quote.weekly_premium).toBeGreaterThanOrEqual(55);
    expect(quote.coverage_amount).toBeGreaterThanOrEqual(500);
    expect(quote.risk_level).toBe("high");
  });
});

