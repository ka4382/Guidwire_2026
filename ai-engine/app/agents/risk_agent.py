from app.models.schemas import PricingFactor, RiskAssessmentRequest, RiskAssessmentResponse


def _clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, value))


class RiskAssessmentAgent:
    def run(self, payload: RiskAssessmentRequest) -> RiskAssessmentResponse:
        risk_score = _clamp(
            payload.zone_risk_score * 0.25
            + payload.historical_disruption_frequency * 0.2
            + payload.weather_forecast_severity * 0.2
            + payload.pollution_history * 0.12
            + payload.flood_prone_factor * 0.13
            + (1 - payload.worker_activity_consistency) * 0.1,
            0.05,
            0.95,
        )

        base_premium = 40
        coverage_amount = 400
        risk_level = "medium"

        if risk_score < 0.38:
            base_premium = 20
            coverage_amount = 200
            risk_level = "low"
        elif risk_score > 0.68:
            base_premium = 60
            coverage_amount = 600
            risk_level = "high"

        pricing_factors = []
        adjustment = 0

        monsoon_adjustment = round(payload.historical_disruption_frequency * 8)
        pricing_factors.append(
            PricingFactor(
                label="Monsoon disruption score",
                value=monsoon_adjustment,
                direction="increase" if monsoon_adjustment else "neutral",
            )
        )
        adjustment += monsoon_adjustment

        pollution_adjustment = round(payload.pollution_history * 5)
        pricing_factors.append(
            PricingFactor(
                label="Pollution volatility",
                value=pollution_adjustment,
                direction="increase" if pollution_adjustment else "neutral",
            )
        )
        adjustment += pollution_adjustment

        activity_adjustment = -2 if payload.worker_activity_consistency > 0.82 else 3 if payload.worker_activity_consistency < 0.5 else 0
        pricing_factors.append(
            PricingFactor(
                label="Activity regularity",
                value=abs(activity_adjustment),
                direction="decrease" if activity_adjustment < 0 else "increase" if activity_adjustment > 0 else "neutral",
            )
        )
        adjustment += activity_adjustment

        flood_adjustment = round(payload.flood_prone_factor * 10)
        pricing_factors.append(
            PricingFactor(
                label="Flood-prone micro-zone factor",
                value=flood_adjustment,
                direction="increase" if flood_adjustment else "neutral",
            )
        )
        adjustment += flood_adjustment

        forecast_adjustment = round(payload.weather_forecast_severity * 4)
        pricing_factors.append(
            PricingFactor(
                label="Next-week weather severity",
                value=forecast_adjustment,
                direction="increase" if forecast_adjustment else "neutral",
            )
        )
        adjustment += forecast_adjustment

        weekly_premium = int(_clamp(base_premium + adjustment, 18, 68))
        coverage_amount = int(_clamp(round((coverage_amount + adjustment * 8) / 10) * 10, 200, 650))

        explanation = " ".join(
            [
                f"Base premium ₹{base_premium}.",
                f"Increased by ₹{monsoon_adjustment} due to monsoon disruption history.",
                (
                    f"Increased by ₹{pollution_adjustment} due to pollution volatility."
                    if pollution_adjustment
                    else "Pollution history is stable."
                ),
                (
                    f"Reduced by ₹{abs(activity_adjustment)} because of strong activity regularity."
                    if activity_adjustment < 0
                    else f"Increased by ₹{activity_adjustment} due to irregular recent activity."
                    if activity_adjustment > 0
                    else "Activity regularity is neutral."
                ),
                f"Final weekly premium ₹{weekly_premium} for ₹{coverage_amount} income cover.",
            ]
        )

        return RiskAssessmentResponse(
            weekly_premium=weekly_premium,
            coverage_amount=coverage_amount,
            risk_level=risk_level,
            explanation=explanation,
            pricing_factors=pricing_factors,
            risk_score=round(risk_score, 2),
        )


risk_assessment_agent = RiskAssessmentAgent()

