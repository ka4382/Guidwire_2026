/**
 * fraudExplainer.service.js
 *
 * Calls the AI Engine's stateless fraud-explain endpoint to convert
 * raw fraud detection output into an explainable, UI-friendly format.
 *
 * Falls back to a local deterministic explainer when the AI Engine
 * is unreachable (same logic, pure JS).
 *
 * Does NOT modify any existing fraud detection flow.
 */

import { callAi } from "./aiEngine.service.js";

// ── Local fallback: mirrors ai-engine/services/fraud_explainer.py ──
const REASON_MAP = {
  gps_stability_score: {
    threshold: 0.3,
    direction: "below",
    label: "GPS mismatch",
    detail: "GPS stability is too low — possible spoofing detected."
  },
  movement_distance_ratio: {
    threshold: 0.2,
    direction: "below",
    label: "Static device",
    detail: "Device appears static while claiming movement routes."
  },
  accelerometer_motion_score: {
    threshold: 0.2,
    direction: "below",
    label: "No real motion",
    detail: "Accelerometer shows no genuine physical movement."
  },
  network_geo_consistency: {
    threshold: 0.35,
    direction: "below",
    label: "Network location mismatch",
    detail: "Network signals do not match the GPS-claimed zone."
  },
  active_minutes_during_window: {
    threshold: 15,
    direction: "below",
    label: "No delivery activity",
    detail: "No meaningful delivery activity during the disruption window."
  },
  claim_frequency_30d: {
    threshold: 3,
    direction: "above",
    label: "Abnormal claim frequency",
    detail: "Claim frequency is significantly above the 30-day norm."
  },
  cross_worker_trigger_similarity: {
    threshold: 0.75,
    direction: "above",
    label: "Coordinated anomaly",
    detail: "Claim resembles a coordinated multi-user anomaly cluster."
  }
};

function localExplain(fraudOutput) {
  try {
    const rawScore = Number(fraudOutput.fraud_score || 0);
    const features = fraudOutput.features || {};
    const agentReasons = fraudOutput.reasons || [];
    const anomalyLabel = fraudOutput.anomaly_label || "unknown";

    const scorePct = Math.max(0, Math.min(100, Math.round(rawScore * 100)));
    const riskLevel = scorePct >= 78 ? "HIGH" : scorePct >= 45 ? "MEDIUM" : "LOW";

    const reasons = [];
    for (const [key, rule] of Object.entries(REASON_MAP)) {
      const value = features[key];
      if (value === undefined || value === null) continue;

      const triggered =
        rule.direction === "below" ? value < rule.threshold : value > rule.threshold;

      if (triggered) {
        reasons.push({
          label: rule.label,
          detail: rule.detail,
          feature: key,
          value: Math.round(value * 1000) / 1000,
          threshold: rule.threshold
        });
      }
    }

    let explanation;
    if (riskLevel === "LOW") {
      explanation = `Fraud score is ${scorePct}/100. Telemetry looks consistent with genuine Blinkit delivery activity.`;
    } else if (riskLevel === "MEDIUM") {
      const labels = reasons.slice(0, 2).map((r) => r.label).join(", ") || "mixed signals";
      explanation = `Fraud score is ${scorePct}/100. Some signals need verification: ${labels}.`;
    } else {
      const labels = reasons.slice(0, 3).map((r) => r.label).join(", ") || "strong indicators";
      explanation = `Fraud score is ${scorePct}/100. High-risk indicators detected: ${labels}.`;
    }

    return {
      fraud_score: scorePct,
      risk_level: riskLevel,
      reasons,
      anomaly_label: anomalyLabel,
      agent_reasons: agentReasons,
      raw_score: Math.round(rawScore * 10000) / 10000,
      explanation
    };
  } catch {
    return {
      fraud_score: 0,
      risk_level: "LOW",
      reasons: [],
      anomaly_label: "error",
      agent_reasons: [],
      raw_score: 0,
      explanation: "Could not explain fraud output."
    };
  }
}

/**
 * Explain fraud output — calls AI Engine first, falls back to local.
 *
 * @param {object} fraudOutput — raw fraud agent / model result
 * @returns {Promise<object>}  explainable payload
 */
export async function explainFraud(fraudOutput) {
  return callAi("/ai/fraud-explain", fraudOutput, () => localExplain(fraudOutput));
}
