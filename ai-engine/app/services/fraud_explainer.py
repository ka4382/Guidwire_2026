"""
fraud_explainer.py — Stateless fraud-score explainability service.

Wraps the raw output of the Isolation Forest fraud model into a
human-readable, frontend-friendly explanation payload.

Does NOT modify the existing model or agent — consumes their output only.
"""

from __future__ import annotations

from typing import Any, Dict, List


# ── Reason mapping: feature → human-readable explanation ────────────
_REASON_MAP: Dict[str, Dict[str, Any]] = {
    "gps_stability_score": {
        "threshold": 0.3,
        "direction": "below",
        "label": "GPS mismatch",
        "detail": "GPS stability is too low — possible spoofing detected."
    },
    "movement_distance_ratio": {
        "threshold": 0.2,
        "direction": "below",
        "label": "Static device",
        "detail": "Device appears static while claiming movement routes."
    },
    "accelerometer_motion_score": {
        "threshold": 0.2,
        "direction": "below",
        "label": "No real motion",
        "detail": "Accelerometer shows no genuine physical movement."
    },
    "network_geo_consistency": {
        "threshold": 0.35,
        "direction": "below",
        "label": "Network location mismatch",
        "detail": "Network signals do not match the GPS-claimed zone."
    },
    "active_minutes_during_window": {
        "threshold": 15,
        "direction": "below",
        "label": "No delivery activity",
        "detail": "No meaningful delivery activity during the disruption window."
    },
    "claim_frequency_30d": {
        "threshold": 3,
        "direction": "above",
        "label": "Abnormal claim frequency",
        "detail": "Claim frequency is significantly above the 30-day norm."
    },
    "cross_worker_trigger_similarity": {
        "threshold": 0.75,
        "direction": "above",
        "label": "Coordinated anomaly",
        "detail": "Claim resembles a coordinated multi-user anomaly cluster."
    },
}


def _score_to_percentage(raw_score: float) -> int:
    """Convert 0.0-1.0 fraud score to 0-100 integer percentage."""
    return max(0, min(100, round(raw_score * 100)))


def _score_to_risk_level(score_pct: int) -> str:
    """Map percentage score to risk level label."""
    if score_pct >= 78:
        return "HIGH"
    if score_pct >= 45:
        return "MEDIUM"
    return "LOW"


def _extract_reasons(features: Dict[str, float]) -> List[Dict[str, str]]:
    """Evaluate feature values against thresholds and return triggered reasons."""
    triggered: List[Dict[str, str]] = []

    for feature_key, rule in _REASON_MAP.items():
        value = features.get(feature_key)
        if value is None:
            continue

        is_triggered = (
            value < rule["threshold"]
            if rule["direction"] == "below"
            else value > rule["threshold"]
        )

        if is_triggered:
            triggered.append({
                "label": rule["label"],
                "detail": rule["detail"],
                "feature": feature_key,
                "value": round(float(value), 3),
                "threshold": rule["threshold"],
            })

    return triggered


def explain_fraud(fraud_output: Dict[str, Any]) -> Dict[str, Any]:
    """
    Accept the raw fraud agent / model output and return an
    explainable, UI-ready dictionary.

    Parameters
    ----------
    fraud_output : dict
        Must contain at minimum:
          - fraud_score   (float 0.0 – 1.0)
          - features      (dict of feature name → float)
        Optionally:
          - reasons       (list[str]) — agent-generated reason strings
          - anomaly_label (str)

    Returns
    -------
    dict  with keys:
      fraud_score      (int 0-100)
      risk_level       (str LOW / MEDIUM / HIGH)
      reasons          (list[dict])  — each with label, detail, feature
      anomaly_label    (str)
      raw_score        (float)  — original 0-1 score
      explanation      (str)    — one-liner summary
    """
    try:
        raw_score = float(fraud_output.get("fraud_score", 0))
        features = fraud_output.get("features", {})
        agent_reasons = fraud_output.get("reasons", [])
        anomaly_label = fraud_output.get("anomaly_label", "unknown")

        score_pct = _score_to_percentage(raw_score)
        risk_level = _score_to_risk_level(score_pct)
        reasons = _extract_reasons(features)

        # Build a one-liner readable explanation
        if risk_level == "LOW":
            explanation = (
                f"Fraud score is {score_pct}/100. "
                "Telemetry looks consistent with genuine Blinkit delivery activity."
            )
        elif risk_level == "MEDIUM":
            top_labels = ", ".join(r["label"] for r in reasons[:2]) or "mixed signals"
            explanation = (
                f"Fraud score is {score_pct}/100. "
                f"Some signals need verification: {top_labels}."
            )
        else:
            top_labels = ", ".join(r["label"] for r in reasons[:3]) or "strong indicators"
            explanation = (
                f"Fraud score is {score_pct}/100. "
                f"High-risk indicators detected: {top_labels}."
            )

        return {
            "fraud_score": score_pct,
            "risk_level": risk_level,
            "reasons": reasons,
            "anomaly_label": anomaly_label,
            "agent_reasons": agent_reasons,
            "raw_score": round(raw_score, 4),
            "explanation": explanation,
        }

    except Exception as exc:
        return {
            "fraud_score": 0,
            "risk_level": "LOW",
            "reasons": [],
            "anomaly_label": "error",
            "agent_reasons": [],
            "raw_score": 0,
            "explanation": f"Could not explain fraud output: {str(exc)}",
        }
