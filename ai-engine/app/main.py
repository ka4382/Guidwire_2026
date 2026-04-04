from fastapi import FastAPI

from app.orchestrator.engine import agentic_orchestrator
from app.agents.claim_agent import claim_decision_agent
from app.agents.disruption_agent import disruption_monitoring_agent
from app.agents.fraud_agent import fraud_detection_agent
from app.agents.payout_agent import payout_execution_agent
from app.agents.risk_agent import risk_assessment_agent
from app.models.schemas import (
    ClaimDecisionRequest,
    FraudDetectionRequest,
    OrchestratorRequest,
    PayoutExecutionRequest,
    RiskAssessmentRequest,
    DisruptionMonitorRequest,
)


app = FastAPI(
    title="BlinkShield AI Engine",
    version="1.0.0",
    description="Deterministic agentic AI service for BlinkShield AI"
)


@app.get("/health")
def health_check():
    return {"success": True, "service": "ai-engine", "status": "ok"}


@app.post("/ai/risk-assess")
def risk_assess(payload: RiskAssessmentRequest):
    return risk_assessment_agent.run(payload)


@app.post("/ai/fraud-detect")
def fraud_detect(payload: FraudDetectionRequest):
    return fraud_detection_agent.run(payload)


@app.post("/ai/claim-decision")
def claim_decision(payload: ClaimDecisionRequest):
    return claim_decision_agent.run(payload)


@app.post("/ai/payout-execute")
def payout_execute(payload: PayoutExecutionRequest):
    return payout_execution_agent.run(payload)


@app.get("/ai/disruption-monitor")
def disruption_monitor_get(
    zone: str,
    dark_store_id: str,
    rainfall_mm: float = 0,
    temperature_c: float = 0,
    aqi_value: float = 0,
    zone_restricted: bool = False,
    dark_store_closed: bool = False,
    order_suspension: bool = False,
):
    payload = DisruptionMonitorRequest(
        zone=zone,
        dark_store_id=dark_store_id,
        weather={
            "rainfallMm": rainfall_mm,
            "temperatureC": temperature_c
        },
        aqi={"aqi": aqi_value},
        zone_status={
            "zoneRestricted": zone_restricted,
            "darkStoreClosed": dark_store_closed
        },
        platform_status={"orderSuspension": order_suspension}
    )
    return disruption_monitoring_agent.run(payload)


@app.post("/ai/run-orchestrator")
def run_orchestrator(payload: OrchestratorRequest):
    return agentic_orchestrator.run(payload)

