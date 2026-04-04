import { Claim } from "../models/Claim.js";
import { DisruptionEvent } from "../models/DisruptionEvent.js";
import { FraudSignal } from "../models/FraudSignal.js";
import { Payout } from "../models/Payout.js";
import { Policy } from "../models/Policy.js";
import { User } from "../models/User.js";
import { WorkerProfile } from "../models/WorkerProfile.js";

export async function getWorkerAnalytics(workerId) {
  const [claims, payouts, policies, profile, user] = await Promise.all([
    Claim.find({ workerId }).sort({ createdAt: -1 }).lean(),
    Payout.find({ workerId }).sort({ createdAt: -1 }).lean(),
    Policy.find({ workerId }).sort({ createdAt: -1 }).lean(),
    WorkerProfile.findOne({ workerId }).lean(),
    User.findById(workerId).lean()
  ]);

  const protectedEarnings = payouts.reduce((sum, item) => sum + item.amount, 0);

  return {
    workerId,
    workerName: user?.name,
    zone: user?.assignedZone,
    protectedEarnings,
    activePolicy: policies.find((item) => item.isActive) || null,
    claimsSummary: {
      total: claims.length,
      approved: claims.filter((item) => item.decision === "approved").length,
      flagged: claims.filter((item) => item.decision === "flagged").length,
      rejected: claims.filter((item) => item.decision === "rejected").length
    },
    payoutSummary: {
      total: payouts.length,
      paidAmount: protectedEarnings
    },
    earningsSummary: {
      avgWeeklyEarnings: profile?.avgWeeklyEarnings || 0,
      avgDailyHours: profile?.avgDailyHours || 0
    },
    recentClaims: claims.slice(0, 5)
  };
}

export async function getAdminOverview() {
  const [users, activePoliciesCount, claims, payouts, disruptions, allPolicies] =
    await Promise.all([
      User.countDocuments({ role: "worker" }),
      Policy.countDocuments({ isActive: true }),
      Claim.find().sort({ createdAt: -1 }).lean(),
      Payout.find().sort({ createdAt: -1 }).lean(),
      DisruptionEvent.find().sort({ createdAt: -1 }).lean(),
      Policy.find().lean()
    ]);

  const paidAmount = payouts.reduce((sum, item) => sum + item.amount, 0);
  const writtenPremium = allPolicies.reduce((sum, item) => sum + item.weeklyPremium, 0);
  const claimsByDecision = ["approved", "flagged", "rejected"].map((status) => ({
    name: status,
    value: claims.filter((item) => item.decision === status).length
  }));

  return {
    totals: {
      totalWorkers: users,
      activePolicies: activePoliciesCount,
      totalClaims: claims.length,
      paidAmount,
      lossRatio: writtenPremium === 0 ? 0 : Number((paidAmount / writtenPremium).toFixed(2))
    },
    claimsByDecision,
    latestClaims: claims.slice(0, 8),
    latestDisruptions: disruptions.slice(0, 8),
    nextWeekTrend: disruptions.slice(0, 5).map((item, index) => ({
      zone: item.zone,
      predictedRisk: Math.min(95, 52 + index * 7 + Math.round(item.observedValue % 11)),
      likelyTrigger: item.type
    }))
  };
}

export async function getFraudAnalytics() {
  const [signals, flaggedClaims] = await Promise.all([
    FraudSignal.find().sort({ createdAt: -1 }).limit(20).populate("workerId").lean(),
    Claim.find({ claimStatus: "flagged" })
      .sort({ createdAt: -1 })
      .populate("workerId")
      .lean()
  ]);

  return {
    flaggedClaims,
    recentSignals: signals
  };
}

export async function getDisruptionAnalytics() {
  const disruptions = await DisruptionEvent.find().sort({ createdAt: -1 }).lean();

  const byZone = disruptions.reduce((accumulator, item) => {
    accumulator[item.zone] = (accumulator[item.zone] || 0) + 1;
    return accumulator;
  }, {});

  return {
    byZone: Object.entries(byZone).map(([zone, count]) => ({ zone, count })),
    history: disruptions
  };
}

