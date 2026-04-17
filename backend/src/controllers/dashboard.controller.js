/**
 * dashboard.controller.js
 *
 * Phase 3 dashboard endpoints for worker and admin views.
 * Aggregates data from existing services without modifying them.
 */

import { asyncHandler } from "../utils/asyncHandler.js";
import { getWorkerAnalytics, getAdminOverview, getFraudAnalytics } from "../services/analytics.service.js";
import { getGlobalPredictiveInsights } from "../services/prediction.service.js";
import { Claim } from "../models/Claim.js";
import { FraudSignal } from "../models/FraudSignal.js";
import { Policy } from "../models/Policy.js";
import { Payout } from "../models/Payout.js";
import { User } from "../models/User.js";

// ── Worker Dashboard ───────────────────────────────────────────────
export const getWorkerDashboard = asyncHandler(async (req, res) => {
  const workerId = req.params.workerId;

  const analytics = await getWorkerAnalytics(workerId);

  // Build premium explanation
  const premiumExplanation = [];
  const activePolicy = analytics.activePolicy;

  if (activePolicy) {
    const riskLevel = activePolicy.riskLevel || "medium";
    if (riskLevel === "high") {
      premiumExplanation.push("High rainfall risk in your area increases your weekly premium.");
    } else if (riskLevel === "low") {
      premiumExplanation.push("Your zone has historically low disruption risk — you enjoy a lower premium.");
    }
    premiumExplanation.push(
      `Your weekly premium of ₹${activePolicy.weeklyPremium} covers up to ₹${activePolicy.coverageAmount} of income loss.`
    );
  }

  res.json({
    success: true,
    data: {
      ...analytics,
      premiumExplanation,
      summary: {
        activePolicyExists: Boolean(activePolicy),
        weeklyPremium: activePolicy?.weeklyPremium || 0,
        coverageAmount: activePolicy?.coverageAmount || 0,
        totalClaimsCount: analytics.claimsSummary.total,
        totalEarningsProtected: analytics.payoutSummary.paidAmount,
        policyValidUntil: activePolicy?.validUntil || null,
        paymentDetails: activePolicy?.paymentDetails || null
      }
    }
  });
});

// ── Admin Dashboard ────────────────────────────────────────────────
export const getAdminDashboard = asyncHandler(async (_req, res) => {
  const [overview, fraudData] = await Promise.all([
    getAdminOverview(),
    getFraudAnalytics()
  ]);

  const predictions = getGlobalPredictiveInsights();

  // Count fraud flags
  const fraudFlaggedCount = fraudData.flaggedClaims.length;

  // Approval rate
  const totalClaims = overview.totals.totalClaims;
  const approvedClaims = overview.claimsByDecision.find((d) => d.name === "approved")?.value || 0;
  const approvalRate = totalClaims > 0 ? Math.round((approvedClaims / totalClaims) * 100) : 0;

  // High-risk zones (derived from next week trend)
  const highRiskZones = (overview.nextWeekTrend || [])
    .filter((t) => t.predictedRisk > 60)
    .map((t) => ({
      zone: t.zone,
      predictedRisk: t.predictedRisk,
      likelyTrigger: t.likelyTrigger
    }));

  // Predicted next week risk (average)
  const avgRisk =
    highRiskZones.length > 0
      ? Math.round(highRiskZones.reduce((s, z) => s + z.predictedRisk, 0) / highRiskZones.length)
      : 35;

  res.json({
    success: true,
    data: {
      total_claims: totalClaims,
      fraud_flagged_count: fraudFlaggedCount,
      approval_rate: approvalRate,
      high_risk_zones: highRiskZones,
      predicted_next_week_risk: avgRisk,
      predictions,
      overview,
      recentFraudSignals: fraudData.recentSignals.slice(0, 5)
    }
  });
});
