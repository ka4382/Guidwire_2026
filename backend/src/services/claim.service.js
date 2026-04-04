import { Claim } from "../models/Claim.js";
import { DisruptionEvent } from "../models/DisruptionEvent.js";
import { FraudSignal } from "../models/FraudSignal.js";
import { WorkerProfile } from "../models/WorkerProfile.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { callAi } from "./aiEngine.service.js";
import { getActivePolicy } from "./policy.service.js";
import { createPayoutForApprovedClaim } from "./payout.service.js";
import {
  buildSimulationState,
  buildZoneStatus,
  getAqi,
  getPlatformStatus,
  getWeather,
  getWorkerActivityByMode,
  getWorkerActivityForUser
} from "./mockProvider.service.js";

function normalize(value, maxValue) {
  return Math.max(0, Math.min(1, value / maxValue));
}

export function estimateIncomeLoss(profile, windowHours) {
  const hourly = profile.avgWeeklyEarnings / 7 / Math.max(profile.avgDailyHours, 1);
  return Math.round(hourly * windowHours);
}

function buildFraudFallback(activity, claimHistoryCount) {
  const reasons = [];
  let score = 0.18;

  if (activity.gpsStabilityScore < 0.3) {
    score += 0.22;
    reasons.push("GPS points are unusually unstable for short Blinkit delivery hops.");
  }

  if (activity.accelerometerMotionScore < 0.2 && activity.movementDistanceRatio < 0.2) {
    score += 0.18;
    reasons.push("Device appears static while route claims movement.");
  }

  if (activity.networkGeoConsistency < 0.35) {
    score += 0.16;
    reasons.push("Network and claimed location do not align closely.");
  }

  if (activity.activeMinutesDuringWindow < 15) {
    score += 0.12;
    reasons.push("No meaningful delivery activity during the disruption window.");
  }

  if (claimHistoryCount >= 3) {
    score += 0.14;
    reasons.push("Recent claim frequency is materially above cohort norm.");
  }

  const label = score >= 0.78 ? "fraudulent" : score >= 0.48 ? "flagged" : "clear";

  return {
    fraud_score: Number(score.toFixed(2)),
    anomaly_label: label,
    reasons:
      reasons.length > 0
        ? reasons
        : ["Telemetry looks consistent with genuine Blinkit activity."],
    confidence: label === "clear" ? 0.82 : 0.74,
    features: {
      gps_stability_score: activity.gpsStabilityScore,
      movement_distance_ratio: activity.movementDistanceRatio,
      avg_speed: activity.avgSpeed,
      accelerometer_motion_score: activity.accelerometerMotionScore,
      delivery_completion_rate: activity.deliveryCompletionRate,
      claim_frequency_30d: claimHistoryCount,
      network_geo_consistency: activity.networkGeoConsistency,
      cross_worker_trigger_similarity: activity.crossWorkerTriggerSimilarity
    }
  };
}

function buildDecisionFallback(event, policy, fraud, incomeLoss, workerEligibility) {
  if (!workerEligibility.isPolicyActive) {
    return {
      decision: "rejected",
      payout_amount: 0,
      decision_reasoning: ["Worker did not have an active weekly BlinkShield policy."],
      next_action: "Ask the worker to activate a weekly plan before the next cycle.",
      loss_window_hours: 0
    };
  }

  if (!event.isTriggerActive) {
    return {
      decision: "rejected",
      payout_amount: 0,
      decision_reasoning: ["Disruption trigger is not active anymore."],
      next_action: "No payout.",
      loss_window_hours: 0
    };
  }

  if (fraud.fraud_score >= 0.82) {
    return {
      decision: "rejected",
      payout_amount: 0,
      decision_reasoning: [
        "Claim shows strong spoofing indicators and near-zero activity match."
      ],
      next_action: "Reject and send to fraud operations.",
      loss_window_hours: event.recommendedClaimWindow || 0
    };
  }

  if (fraud.fraud_score >= 0.5) {
    return {
      decision: "flagged",
      payout_amount: Math.round(Math.min(policy.coverageAmount * 0.75, incomeLoss)),
      decision_reasoning: [
        "Telemetry signals need manual verification before auto payout.",
        ...fraud.reasons.slice(0, 2)
      ],
      next_action: "Flag claim for quick verification rather than rejecting it.",
      loss_window_hours: event.recommendedClaimWindow || 0
    };
  }

  const payoutAmount = Math.round(Math.min(policy.coverageAmount, Math.max(incomeLoss, 120)));

  return {
    decision: "approved",
    payout_amount: payoutAmount,
    decision_reasoning: [
      "Parametric trigger is valid and worker remained active in the affected zone.",
      ...fraud.reasons.slice(0, 1)
    ],
    next_action: "Trigger instant payout.",
    loss_window_hours: event.recommendedClaimWindow || 0
  };
}

async function buildOrchestrationForWorker(event, worker, options = {}) {
  const profile = await WorkerProfile.findOne({ workerId: worker._id }).lean();
  const policy = await getActivePolicy(worker._id);

  if (!profile || !policy) {
    return null;
  }

  const simulationState = options.simulationType
    ? buildSimulationState(options.simulationType, worker.assignedZone)
    : null;
  const weather = simulationState?.weather || getWeather(worker.assignedZone);
  const aqi = simulationState?.aqi || getAqi(worker.assignedZone);
  const platformStatus = simulationState?.platformStatus || getPlatformStatus(worker.assignedZone);
  const zoneStatus =
    simulationState?.zoneStatus || buildZoneStatus(worker.assignedZone, platformStatus);

  const activityMode =
    options.simulationType === "gps_spoof_attack" && worker.email === "imran@blinkshield.demo"
      ? "suspicious"
      : undefined;
  const activity = activityMode
    ? getWorkerActivityByMode(activityMode)
    : getWorkerActivityForUser(worker);
  const claimHistoryCount = await Claim.countDocuments({ workerId: worker._id });
  const incomeLoss = estimateIncomeLoss(profile, event.recommendedClaimWindow || 3);

  const fraudPayload = {
    worker_id: worker._id.toString(),
    gps_history: [],
    accelerometer: {
      motion_score: activity.accelerometerMotionScore
    },
    network_consistency: activity.networkGeoConsistency,
    claim_history: {
      claim_frequency_30d: claimHistoryCount
    },
    active_delivery_logs: {
      gps_stability_score: activity.gpsStabilityScore,
      movement_distance_ratio: activity.movementDistanceRatio,
      avg_speed: activity.avgSpeed,
      accelerometer_motion_score: activity.accelerometerMotionScore,
      delivery_completion_rate: activity.deliveryCompletionRate,
      network_geo_consistency: activity.networkGeoConsistency,
      cross_worker_trigger_similarity: activity.crossWorkerTriggerSimilarity,
      active_minutes_during_window: activity.activeMinutesDuringWindow,
      recent_weather: weather,
      recent_aqi: aqi,
      zone_status: zoneStatus
    }
  };

  const fraud = await callAi("/ai/fraud-detect", fraudPayload, () =>
    buildFraudFallback(activity, claimHistoryCount)
  );

  const decisionPayload = {
    trigger_event: {
      isTriggerActive: event.isTriggerActive,
      type: event.type,
      recommendedClaimWindow: event.recommendedClaimWindow,
      severity: event.severity
    },
    active_policy: {
      coverageAmount: policy.coverageAmount,
      weeklyPremium: policy.weeklyPremium
    },
    fraud_score: fraud.fraud_score,
    worker_eligibility: {
      isPolicyActive: policy.isActive,
      zoneMatch: worker.assignedZone === event.zone,
      activityMinutesDuringWindow: activity.activeMinutesDuringWindow
    },
    estimated_income_loss: incomeLoss
  };

  const decision = await callAi("/ai/claim-decision", decisionPayload, () =>
    buildDecisionFallback(
      event,
      policy,
      fraud,
      incomeLoss,
      decisionPayload.worker_eligibility
    )
  );

  const fraudSignal = await FraudSignal.create({
    workerId: worker._id,
    gpsStabilityScore: activity.gpsStabilityScore,
    movementRatio: activity.movementDistanceRatio,
    activityMatch: normalize(activity.activeMinutesDuringWindow, 120),
    networkConsistency: activity.networkGeoConsistency,
    anomalyScore: fraud.fraud_score,
    flaggedReasons: fraud.reasons
  });

  const claim = await Claim.create({
    workerId: worker._id,
    policyId: policy._id,
    disruptionEventId: event._id,
    claimStatus:
      decision.decision === "approved"
        ? "approved"
        : decision.decision === "flagged"
          ? "flagged"
          : "rejected",
    fraudScore: fraud.fraud_score,
    decision: decision.decision,
    payoutAmount: decision.payout_amount,
    lossWindowHours: decision.loss_window_hours,
    reasons: decision.decision_reasoning
  });

  let payout = null;
  if (decision.decision === "approved") {
    payout = await createPayoutForApprovedClaim(claim._id);
  }

  return {
    workerId: worker._id,
    workerName: worker.name,
    claim,
    fraud,
    fraudSignal,
    payout
  };
}

export async function runClaimsForEvent(event, workers, options = {}) {
  const results = [];

  for (const worker of workers) {
    const result = await buildOrchestrationForWorker(event, worker, options);
    if (result) {
      results.push(result);
    }
  }

  return results;
}

export async function triggerClaimForWorker(workerId, disruptionEventId) {
  const [worker, event] = await Promise.all([
    User.findById(workerId).lean(),
    DisruptionEvent.findById(disruptionEventId).lean()
  ]);

  if (!worker || !event) {
    throw new ApiError(404, "Worker or disruption event not found");
  }

  const results = await runClaimsForEvent(event, [worker]);
  return results[0];
}

export async function getClaimsForWorker(workerId) {
  return Claim.find({ workerId })
    .populate("disruptionEventId")
    .populate("policyId")
    .sort({ createdAt: -1 })
    .lean();
}

export async function getClaimDetails(claimId) {
  const claim = await Claim.findById(claimId)
    .populate("workerId")
    .populate("policyId")
    .populate("disruptionEventId");

  if (!claim) {
    throw new ApiError(404, "Claim not found");
  }

  return claim;
}

export async function reviewClaim(claimId, action, notes) {
  const claim = await Claim.findById(claimId);

  if (!claim) {
    throw new ApiError(404, "Claim not found");
  }

  if (action === "reject") {
    claim.claimStatus = "rejected";
    claim.decision = "rejected";
    claim.reasons = [...claim.reasons, notes || "Rejected during admin review"];
    await claim.save();
    return { claim, payout: null };
  }

  claim.claimStatus = "approved";
  claim.decision = "approved";
  claim.reasons = [...claim.reasons, notes || "Approved after admin verification"];
  await claim.save();

  const payout = await createPayoutForApprovedClaim(claim._id);
  return { claim, payout };
}

// ── Manual claim filing by worker ──────────────────────────────────
export async function fileManualClaim(workerId, eventType, description, zone) {
  const worker = await User.findById(workerId).lean();
  if (!worker) {
    throw new ApiError(404, "Worker not found");
  }

  const policy = await getActivePolicy(workerId);
  if (!policy) {
    throw new ApiError(400, "No active policy found. Please activate a policy first.");
  }

  // Map event types to severity and thresholds
  const typeConfig = {
    heavy_rainfall: { severity: "high", thresholdValue: 50, observedValue: 72, source: "worker_report", claimWindow: 4 },
    extreme_heat: { severity: "high", thresholdValue: 42, observedValue: 45, source: "worker_report", claimWindow: 3 },
    severe_aqi: { severity: "high", thresholdValue: 300, observedValue: 380, source: "worker_report", claimWindow: 3 },
    zone_closure: { severity: "critical", thresholdValue: 1, observedValue: 1, source: "worker_report", claimWindow: 6 },
    platform_outage: { severity: "critical", thresholdValue: 1, observedValue: 1, source: "worker_report", claimWindow: 4 },
    unplanned_curfew: { severity: "critical", thresholdValue: 1, observedValue: 1, source: "worker_report", claimWindow: 8 },
    local_strike: { severity: "high", thresholdValue: 1, observedValue: 1, source: "worker_report", claimWindow: 6 },
    market_closure: { severity: "high", thresholdValue: 1, observedValue: 1, source: "worker_report", claimWindow: 5 }
  };

  const config = typeConfig[eventType] || {
    severity: "medium",
    thresholdValue: 1,
    observedValue: 1,
    source: "worker_report",
    claimWindow: 3
  };

  const now = new Date();
  const event = await DisruptionEvent.create({
    type: eventType,
    zone: zone || worker.assignedZone,
    darkStoreId: worker.darkStoreId || "MANUAL-" + (worker.assignedZone || "UNKNOWN"),
    severity: config.severity,
    source: config.source,
    thresholdValue: config.thresholdValue,
    observedValue: config.observedValue,
    startedAt: new Date(now.getTime() - config.claimWindow * 60 * 60 * 1000),
    endedAt: now,
    isTriggerActive: true,
    recommendedClaimWindow: config.claimWindow,
    evidence: [
      {
        source: "worker_report",
        summary: description || `Worker reported ${eventType.replace(/_/g, " ")} disruption`,
        payload: { reportedBy: worker.name, reportedAt: now }
      }
    ]
  });

  // Run the full orchestration (fraud detection + decision)
  const results = await runClaimsForEvent(event, [worker]);
  const result = results[0];

  if (!result) {
    throw new ApiError(500, "Could not process claim. Ensure you have an active policy.");
  }

  // Override auto-decision to 'pending' for manual claims so admin must review
  result.claim.claimStatus = "pending";
  result.claim.decision = "pending_review";
  result.claim.reasons = [
    ...result.claim.reasons,
    `Worker-reported ${eventType.replace(/_/g, " ")} — pending admin verification`
  ];
  await result.claim.save();

  return result;
}

// ── Admin: get all pending/flagged claims for review ───────────────
export async function getPendingClaimsForAdmin() {
  return Claim.find({ claimStatus: { $in: ["pending", "flagged", "created"] } })
    .populate("workerId", "name email assignedZone")
    .populate("disruptionEventId")
    .populate("policyId")
    .sort({ createdAt: -1 })
    .lean();
}

// ── Admin: get all claims (for full list view) ─────────────────────
export async function getAllClaimsForAdmin() {
  return Claim.find({})
    .populate("workerId", "name email assignedZone")
    .populate("disruptionEventId")
    .populate("policyId")
    .sort({ createdAt: -1 })
    .lean();
}


