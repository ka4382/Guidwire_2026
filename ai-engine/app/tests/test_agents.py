from app.agents.claim_agent import claim_decision_agent
from app.agents.disruption_agent import disruption_monitoring_agent
from app.agents.risk_agent import risk_assessment_agent
from app.models.schemas import ClaimDecisionRequest, DisruptionMonitorRequest, RiskAssessmentRequest


def test_disruption_agent_detects_heavy_rain():
    result = disruption_monitoring_agent.run(
        DisruptionMonitorRequest(
            zone="Koramangala-5th-Block",
            dark_store_id="BLR-KRM-01",
            weather={"rainfallMm": 75, "temperatureC": 30},
            aqi={"aqi": 120},
            zone_status={"zoneRestricted": False, "darkStoreClosed": False},
            platform_status={"orderSuspension": False},
        )
    )
    assert result.trigger_status is True
    assert result.disruption_type == "heavy_rainfall"


def test_risk_agent_stays_within_weekly_bounds():
    result = risk_assessment_agent.run(
        RiskAssessmentRequest(
            worker_location="Koramangala-5th-Block",
            historical_disruption_frequency=0.55,
            zone_risk_score=0.61,
            weather_forecast_severity=0.72,
            worker_activity_consistency=0.83,
            pollution_history=0.32,
            flood_prone_factor=0.21,
            avg_weekly_earnings=4200,
        )
    )
    assert 18 <= result.weekly_premium <= 68
    assert result.coverage_amount >= 200


def test_claim_agent_flags_suspicious_claims():
    result = claim_decision_agent.run(
        ClaimDecisionRequest(
            trigger_event={"recommendedClaimWindow": 3},
            active_policy={"coverageAmount": 400, "weeklyPremium": 40},
            fraud_score=0.66,
            worker_eligibility={
                "isPolicyActive": True,
                "zoneMatch": True,
                "activityMinutesDuringWindow": 8,
            },
            estimated_income_loss=220,
        )
    )
    assert result.decision == "flagged"

