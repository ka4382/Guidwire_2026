import { Claim } from "../models/Claim.js";
import { DisruptionEvent } from "../models/DisruptionEvent.js";
import { FraudSignal } from "../models/FraudSignal.js";
import { Payout } from "../models/Payout.js";
import { Policy } from "../models/Policy.js";
import { User } from "../models/User.js";
import { WorkerProfile } from "../models/WorkerProfile.js";
import {
  demoHistoricalEvents,
  demoProfiles,
  demoSeededClaims,
  demoUsers
} from "../data/seed-data.js";
import { hashPassword } from "../utils/password.js";
import { calculateRiskQuoteFromInputs } from "../services/premium.service.js";
import { getZoneMeta, getWeather } from "../services/mockProvider.service.js";

export async function seedDatabase({ force = false } = {}) {
  const alreadySeeded = await User.countDocuments();
  if (alreadySeeded > 0 && !force) {
    return { skipped: true };
  }

  if (force) {
    await Promise.all([
      Claim.deleteMany({}),
      DisruptionEvent.deleteMany({}),
      FraudSignal.deleteMany({}),
      Payout.deleteMany({}),
      Policy.deleteMany({}),
      WorkerProfile.deleteMany({}),
      User.deleteMany({})
    ]);
  }

  const userMap = {};

  for (const item of demoUsers) {
    const passwordHash = await hashPassword(item.password);
    const user = await User.findOneAndUpdate(
      { email: item.email },
      { ...item, passwordHash },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    userMap[item.email] = user;
  }

  for (const [email, profileData] of Object.entries(demoProfiles)) {
    const user = userMap[email];
    const zoneMeta = getZoneMeta(user.assignedZone);
    const weather = getWeather(user.assignedZone);
    const quote = calculateRiskQuoteFromInputs({
      zoneRiskScore: zoneMeta.zoneRiskScore,
      historicalDisruptionFrequency: zoneMeta.historicalDisruptionFrequency,
      weatherForecastSeverity: weather.forecastSeverity,
      workerActivityConsistency: profileData.activityScore,
      pollutionHistory: zoneMeta.pollutionHistory,
      floodProneFactor: zoneMeta.floodProneFactor,
      safeZoneDiscount: zoneMeta.safeZoneDiscount
    });

    await WorkerProfile.findOneAndUpdate(
      { workerId: user._id },
      {
        workerId: user._id,
        ...profileData,
        riskProfile: {
          riskLevel: quote.risk_level,
          riskScore: quote.risk_score,
          lastQuotePremium: quote.weekly_premium,
          lastCoverageAmount: quote.coverage_amount
        }
      },
      { new: true, upsert: true }
    );

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    await Policy.findOneAndUpdate(
      { workerId: user._id },
      {
        workerId: user._id,
        weeklyPremium: quote.weekly_premium,
        coverageAmount: quote.coverage_amount,
        riskLevel: quote.risk_level,
        isActive: true,
        startDate,
        endDate,
        explanation: quote.explanation,
        pricingFactors: quote.pricing_factors
      },
      { new: true, upsert: true }
    );
  }

  for (const item of demoHistoricalEvents) {
    const startedAt = new Date();
    startedAt.setHours(startedAt.getHours() - item.startedAtOffsetHours);
    const endedAt = new Date();
    endedAt.setHours(endedAt.getHours() - item.endedAtOffsetHours);

    await DisruptionEvent.create({
      type: item.type,
      zone: item.zone,
      darkStoreId: item.darkStoreId,
      severity: item.severity,
      source: item.source,
      thresholdValue: item.thresholdValue,
      observedValue: item.observedValue,
      startedAt,
      endedAt,
      isTriggerActive: item.isTriggerActive,
      recommendedClaimWindow: item.recommendedClaimWindow,
      evidence: item.evidence
    });
  }

  const storedEvents = await DisruptionEvent.find().lean();

  for (const claimTemplate of demoSeededClaims) {
    const user = userMap[claimTemplate.email];
    const event = storedEvents.find((item) => item.type === claimTemplate.eventType);
    const policy = await Policy.findOne({ workerId: user._id }).lean();

    const claim = await Claim.create({
      workerId: user._id,
      policyId: policy._id,
      disruptionEventId: event._id,
      claimStatus: claimTemplate.claimStatus,
      fraudScore: claimTemplate.fraudScore,
      decision: claimTemplate.decision,
      payoutAmount: claimTemplate.payoutAmount,
      lossWindowHours: claimTemplate.lossWindowHours,
      reasons: claimTemplate.reasons
    });

    await FraudSignal.create({
      workerId: user._id,
      gpsStabilityScore: claimTemplate.decision === "flagged" ? 0.22 : 0.81,
      movementRatio: claimTemplate.decision === "flagged" ? 0.18 : 0.74,
      activityMatch: claimTemplate.decision === "flagged" ? 0.25 : 0.84,
      networkConsistency: claimTemplate.decision === "flagged" ? 0.31 : 0.88,
      anomalyScore: claimTemplate.fraudScore,
      flaggedReasons: claimTemplate.reasons
    });

    if (claimTemplate.payoutStatus) {
      await Payout.create({
        claimId: claim._id,
        workerId: user._id,
        amount: claimTemplate.payoutAmount,
        payoutStatus: claimTemplate.payoutStatus,
        provider: "mock-razorpay",
        providerReference: `seeded_${claim._id.toString().slice(-6)}`,
        processedAt: new Date()
      });
    }
  }

  return { seeded: true };
}
