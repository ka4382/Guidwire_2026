import { Policy } from "../models/Policy.js";
import { ApiError } from "../utils/apiError.js";
import { calculatePremium } from "./premium.service.js";

export async function createPolicy(workerId, startDateInput) {
  const { quote } = await calculatePremium(workerId);

  const startDate = startDateInput ? new Date(startDateInput) : new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 7);

  const policy = await Policy.create({
    workerId,
    weeklyPremium: quote.weekly_premium,
    coverageAmount: quote.coverage_amount,
    riskLevel: quote.risk_level,
    isActive: false,
    startDate,
    endDate,
    explanation: quote.explanation,
    pricingFactors: quote.pricing_factors
  });

  return policy;
}

export async function getPoliciesByWorker(workerId) {
  return Policy.find({ workerId }).sort({ createdAt: -1 }).lean();
}

export async function activatePolicy(policyId) {
  const policy = await Policy.findById(policyId);

  if (!policy) {
    throw new ApiError(404, "Policy not found");
  }

  await Policy.updateMany({ workerId: policy.workerId }, { $set: { isActive: false } });
  policy.isActive = true;
  await policy.save();

  return policy;
}

export async function cancelPolicy(policyId) {
  const policy = await Policy.findById(policyId);

  if (!policy) {
    throw new ApiError(404, "Policy not found");
  }

  policy.isActive = false;
  await policy.save();
  return policy;
}

export async function getActivePolicy(workerId) {
  return Policy.findOne({ workerId, isActive: true }).sort({ createdAt: -1 });
}

