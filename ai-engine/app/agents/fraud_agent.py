from app.models.schemas import FraudDetectionRequest, FraudDetectionResponse
from app.services.fraud_model_service import fraud_model_service


class FraudDetectionAgent:
    def _feature_map(self, payload: FraudDetectionRequest):
        logs = payload.active_delivery_logs
        return {
            "gps_stability_score": float(logs.get("gps_stability_score", 0)),
            "movement_distance_ratio": float(logs.get("movement_distance_ratio", 0)),
            "avg_speed": float(logs.get("avg_speed", 0)),
            "accelerometer_motion_score": float(logs.get("accelerometer_motion_score", 0)),
            "delivery_completion_rate": float(logs.get("delivery_completion_rate", 0)),
            "claim_frequency_30d": float(payload.claim_history.get("claim_frequency_30d", 0)),
            "network_geo_consistency": float(logs.get("network_geo_consistency", payload.network_consistency)),
            "cross_worker_trigger_similarity": float(logs.get("cross_worker_trigger_similarity", 0)),
            "active_minutes_during_window": float(logs.get("active_minutes_during_window", 0)),
        }

    def run(self, payload: FraudDetectionRequest) -> FraudDetectionResponse:
        features = self._feature_map(payload)
        reasons = []
        rule_score = 0.18

        if features["gps_stability_score"] < 0.3:
            rule_score += 0.22
            reasons.append("GPS stability is too low for hyperlocal Blinkit routing.")

        if (
            features["accelerometer_motion_score"] < 0.2
            and features["movement_distance_ratio"] < 0.2
        ):
            rule_score += 0.18
            reasons.append("Movement telemetry suggests a static device with fake route jumps.")

        if features["network_geo_consistency"] < 0.35:
            rule_score += 0.16
            reasons.append("Network signals do not consistently match the claimed zone.")

        if features["active_minutes_during_window"] < 15:
            rule_score += 0.12
            reasons.append("The worker had almost no delivery activity during the claim window.")

        if features["claim_frequency_30d"] >= 3:
            rule_score += 0.14
            reasons.append("Claim frequency is significantly above the 30-day worker norm.")

        if features["cross_worker_trigger_similarity"] > 0.75:
            rule_score += 0.08
            reasons.append("This claim resembles a coordinated multi-user anomaly cluster.")

        model_score = fraud_model_service.score(features)
        fraud_score = rule_score if model_score is None else min(1.0, (rule_score * 0.55) + (model_score * 0.45))

        label = "clear"
        if fraud_score >= 0.82:
            label = "fraudulent"
        elif fraud_score >= 0.48:
            label = "flagged"

        if not reasons:
            reasons = ["Telemetry looks consistent with genuine Blinkit activity."]

        return FraudDetectionResponse(
            fraud_score=round(fraud_score, 2),
            anomaly_label=label,
            reasons=reasons,
            confidence=0.86 if label == "clear" else 0.79 if label == "flagged" else 0.9,
            features=features,
        )


fraud_detection_agent = FraudDetectionAgent()

