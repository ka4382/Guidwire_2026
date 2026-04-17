import { WorkerProfile } from "../models/WorkerProfile.js";
import { User } from "../models/User.js";
import { getZoneMeta, getWeather } from "./mockProvider.service.js";
import { callAi } from "./aiEngine.service.js";
import { ApiError } from "../utils/apiError.js";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function calculateRiskQuoteFromInputs(input) {
  const riskScore = clamp(
    input.zoneRiskScore * 0.25 +
      input.historicalDisruptionFrequency * 0.2 +
      input.weatherForecastSeverity * 0.2 +
      input.pollutionHistory * 0.12 +
      input.floodProneFactor * 0.13 +
      (1 - input.workerActivityConsistency) * 0.1,
    0.05,
    0.95
  );

  let basePremium = 40;
  let coverageAmount = 400;
  let riskLevel = "medium";

  if (riskScore < 0.38) {
    basePremium = 20;
    coverageAmount = 200;
    riskLevel = "low";
  } else if (riskScore > 0.68) {
    basePremium = 60;
    coverageAmount = 600;
    riskLevel = "high";
  }

  const pricingFactors = [];
  let adjustment = 0;

  const safeZoneAdjustment = -(input.safeZoneDiscount || 0);
  if (safeZoneAdjustment !== 0) {
    adjustment += safeZoneAdjustment;
    pricingFactors.push({
      label: "Historically safe zone credit",
      value: Math.abs(safeZoneAdjustment),
      direction: "decrease"
    });
  }

  const monsoonAdjustment = Math.round(input.historicalDisruptionFrequency * 8);
  adjustment += monsoonAdjustment;
  pricingFactors.push({
    label: "Monsoon disruption score",
    value: monsoonAdjustment,
    direction: monsoonAdjustment > 0 ? "increase" : "neutral"
  });

  const pollutionAdjustment = Math.round(input.pollutionHistory * 5);
  adjustment += pollutionAdjustment;
  pricingFactors.push({
    label: "Pollution volatility",
    value: pollutionAdjustment,
    direction: pollutionAdjustment > 0 ? "increase" : "neutral"
  });

  const activityAdjustment =
    input.workerActivityConsistency > 0.82
      ? -2
      : input.workerActivityConsistency < 0.5
        ? 3
        : 0;
  adjustment += activityAdjustment;
  pricingFactors.push({
    label: "Activity regularity",
    value: Math.abs(activityAdjustment),
    direction:
      activityAdjustment < 0 ? "decrease" : activityAdjustment > 0 ? "increase" : "neutral"
  });

  const floodAdjustment = Math.round(input.floodProneFactor * 10);
  adjustment += floodAdjustment;
  pricingFactors.push({
    label: "Flood-prone micro-zone factor",
    value: floodAdjustment,
    direction: floodAdjustment > 0 ? "increase" : "neutral"
  });

  const forecastAdjustment = Math.round(input.weatherForecastSeverity * 4);
  adjustment += forecastAdjustment;
  pricingFactors.push({
    label: "Next-week weather severity",
    value: forecastAdjustment,
    direction: forecastAdjustment > 0 ? "increase" : "neutral"
  });

  const weeklyPremium = clamp(basePremium + adjustment, 18, 68);
  coverageAmount = clamp(Math.round((coverageAmount + adjustment * 8) / 10) * 10, 200, 650);

  const plans = {
    lite: {
      weekly_premium: Math.round(weeklyPremium * 0.6),
      coverage_amount: Math.round(coverageAmount * 0.6),
      label: "Lite Plan",
      features: ["Basic income protection", "Standard claim processing"]
    },
    standard: {
      weekly_premium: Math.round(weeklyPremium),
      coverage_amount: Math.round(coverageAmount),
      label: "Standard Plan",
      features: ["Full income protection", "Fast claim processing", "Priority support"]
    },
    premium: {
      weekly_premium: Math.round(weeklyPremium * 1.6),
      coverage_amount: Math.round(coverageAmount * 1.6),
      label: "Premium Plan",
      features: ["Max income protection", "Instant AI payouts", "Multi-zone coverage", "Premium support"]
    }
  };

  const explanation = [
    `Base premium ₹${basePremium}.`,
    safeZoneAdjustment !== 0
      ? `Reduced by ₹${Math.abs(safeZoneAdjustment)} due to historically safe zone pockets.`
      : "No safe-zone discount applied.",
    `Increased by ₹${monsoonAdjustment} due to monsoon disruption history.`,
    pollutionAdjustment > 0
      ? `Increased by ₹${pollutionAdjustment} due to pollution volatility.`
      : "Pollution history is stable.",
    activityAdjustment < 0
      ? `Reduced by ₹${Math.abs(activityAdjustment)} because of strong activity regularity.`
      : activityAdjustment > 0
        ? `Increased by ₹${activityAdjustment} due to irregular recent activity.`
        : "Activity regularity is neutral.",
    `Standard weekly premium ₹${weeklyPremium} for ₹${coverageAmount} income cover.`
  ].join(" ");

  return {
    weekly_premium: weeklyPremium, // Keep standard as default for backward compatibility
    coverage_amount: coverageAmount,
    plans,
    risk_level: riskLevel,
    explanation,
    pricing_factors: pricingFactors,
    risk_score: Number(riskScore.toFixed(2))
  };
}

export async function calculatePremium(workerId) {
  const user = await User.findById(workerId);
  const profile = await WorkerProfile.findOne({ workerId });

  if (!user || !profile) {
    throw new ApiError(404, "Worker not found");
  }

  const zoneMeta = getZoneMeta(user.assignedZone);
  const weather = getWeather(user.assignedZone);

  if (!zoneMeta) {
    throw new ApiError(404, "Zone metadata not found");
  }

  const requestPayload = {
    worker_id: workerId,
    worker_location: user.assignedZone,
    historical_disruption_frequency: zoneMeta.historicalDisruptionFrequency,
    zone_risk_score: zoneMeta.zoneRiskScore,
    weather_forecast_severity: weather.forecastSeverity,
    worker_activity_consistency: profile.activityScore,
    pollution_history: zoneMeta.pollutionHistory,
    flood_prone_factor: zoneMeta.floodProneFactor,
    avg_weekly_earnings: profile.avgWeeklyEarnings
  };

  const quote = await callAi("/ai/risk-assess", requestPayload, () =>
    calculateRiskQuoteFromInputs({
      ...requestPayload,
      safeZoneDiscount: zoneMeta.safeZoneDiscount
    })
  );

  profile.riskProfile = {
    riskLevel: quote.risk_level,
    riskScore: quote.risk_score,
    lastQuotePremium: quote.weekly_premium,
    lastCoverageAmount: quote.coverage_amount
  };
  await profile.save();

  return {
    worker: user,
    profile,
    quote
  };
}

export async function getLatestPremium(workerId) {
  const [user, profile] = await Promise.all([
    User.findById(workerId),
    WorkerProfile.findOne({ workerId })
  ]);

  if (!user || !profile) {
    throw new ApiError(404, "Worker not found");
  }

  return {
    workerId,
    zone: user.assignedZone,
    riskProfile: profile.riskProfile
  };
}

