from datetime import datetime, timezone
from uuid import uuid4

from app.models.schemas import PayoutExecutionRequest, PayoutExecutionResponse


class PayoutExecutionAgent:
    def run(self, payload: PayoutExecutionRequest) -> PayoutExecutionResponse:
        return PayoutExecutionResponse(
            simulated_payout_id=f"payout_{uuid4().hex[:10]}",
            payout_status="completed",
            payout_timestamp=datetime.now(timezone.utc),
            provider=payload.payout_account_details.get("provider", "mock-razorpay"),
        )


payout_execution_agent = PayoutExecutionAgent()

