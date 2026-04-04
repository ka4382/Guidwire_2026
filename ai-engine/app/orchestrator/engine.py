from langchain_core.runnables import RunnableLambda

from app.agents.claim_agent import claim_decision_agent
from app.agents.disruption_agent import disruption_monitoring_agent
from app.agents.fraud_agent import fraud_detection_agent
from app.agents.payout_agent import payout_execution_agent
from app.models.schemas import (
    ClaimDecisionRequest,
    OrchestratorRequest,
    OrchestratorResponse,
    PayoutExecutionRequest,
)


class AgenticOrchestrator:
    def __init__(self) -> None:
        self._chain = (
            RunnableLambda(self._run_disruption)
            | RunnableLambda(self._run_fraud)
            | RunnableLambda(self._run_claim)
            | RunnableLambda(self._run_payout)
        )

    def _run_disruption(self, payload: dict) -> dict:
        request = payload["request"]
        payload["disruption"] = disruption_monitoring_agent.run(request.event_context)
        return payload

    def _run_fraud(self, payload: dict) -> dict:
        request = payload["request"]
        payload["fraud"] = fraud_detection_agent.run(request.fraud_context)
        return payload

    def _run_claim(self, payload: dict) -> dict:
        request = payload["request"]
        disruption = payload["disruption"]
        fraud = payload["fraud"]
        claim_request = ClaimDecisionRequest(
            trigger_event={
                "isTriggerActive": disruption.trigger_status,
                "type": disruption.disruption_type,
                "recommendedClaimWindow": disruption.recommended_claim_window,
                "severity": disruption.severity,
            },
            active_policy={
                "coverageAmount": request.policy["coverageAmount"],
                "weeklyPremium": request.policy["weeklyPremium"],
            },
            fraud_score=fraud.fraud_score,
            worker_eligibility={
                "isPolicyActive": request.policy["isActive"],
                "zoneMatch": request.worker["assignedZone"] == disruption.affected_zone,
                "activityMinutesDuringWindow": request.fraud_context.active_delivery_logs.get(
                    "active_minutes_during_window", 0
                ),
            },
            estimated_income_loss=request.estimated_income_loss,
        )
        payload["claim"] = claim_decision_agent.run(claim_request)
        return payload

    def _run_payout(self, payload: dict) -> dict:
        request = payload["request"]
        claim = payload["claim"]
        payout = None
        if claim.decision == "approved":
            payout = payout_execution_agent.run(
                PayoutExecutionRequest(
                    claim_id="pending-backend-id",
                    worker_id=str(request.worker.get("_id", request.worker.get("id", "worker"))),
                    approved_claim={"payoutAmount": claim.payout_amount},
                    payout_account_details=request.worker.get("payoutMethod", {}),
                )
            )
        payload["payout"] = payout
        return payload

    def run(self, request: OrchestratorRequest) -> OrchestratorResponse:
        result = self._chain.invoke({"request": request})
        return OrchestratorResponse(
            disruption=result["disruption"],
            fraud=result["fraud"],
            claim=result["claim"],
            payout=result["payout"],
        )


agentic_orchestrator = AgenticOrchestrator()

