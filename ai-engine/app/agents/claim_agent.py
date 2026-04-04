from app.models.schemas import ClaimDecisionRequest, ClaimDecisionResponse


class ClaimDecisionAgent:
    def run(self, payload: ClaimDecisionRequest) -> ClaimDecisionResponse:
        is_policy_active = bool(payload.worker_eligibility.get("isPolicyActive", False))
        activity_minutes = float(payload.worker_eligibility.get("activityMinutesDuringWindow", 0))
        zone_match = bool(payload.worker_eligibility.get("zoneMatch", False))
        claim_window = int(payload.trigger_event.get("recommendedClaimWindow", 0))

        if not is_policy_active:
            return ClaimDecisionResponse(
                decision="rejected",
                payout_amount=0,
                decision_reasoning=["Worker does not have an active weekly BlinkShield policy."],
                next_action="Reject claim and prompt policy activation for the next cycle.",
                loss_window_hours=0,
            )

        if not zone_match:
            return ClaimDecisionResponse(
                decision="rejected",
                payout_amount=0,
                decision_reasoning=["Worker was not mapped to the affected Blinkit micro-zone."],
                next_action="Reject claim because the disruption did not impact the worker's dark-store cluster.",
                loss_window_hours=0,
            )

        if payload.fraud_score >= 0.82:
            return ClaimDecisionResponse(
                decision="rejected",
                payout_amount=0,
                decision_reasoning=[
                    "Strong fraud indicators were detected, including spoof-like activity patterns."
                ],
                next_action="Reject claim and route to fraud operations.",
                loss_window_hours=claim_window,
            )

        if payload.fraud_score >= 0.48 or activity_minutes < 20:
            payout_amount = round(
                min(payload.active_policy["coverageAmount"] * 0.75, payload.estimated_income_loss)
            )
            return ClaimDecisionResponse(
                decision="flagged",
                payout_amount=payout_amount,
                decision_reasoning=[
                    "The trigger is valid, but worker telemetry needs quick verification.",
                    "BlinkShield flags suspicious claims instead of rejecting them by default.",
                ],
                next_action="Flag for manual verification within the zero-touch exception queue.",
                loss_window_hours=claim_window,
            )

        payout_amount = round(
            min(payload.active_policy["coverageAmount"], max(payload.estimated_income_loss, 120))
        )
        return ClaimDecisionResponse(
            decision="approved",
            payout_amount=payout_amount,
            decision_reasoning=[
                "Parametric trigger validated for the assigned zone.",
                "Worker telemetry is consistent with real Blinkit delivery activity.",
            ],
            next_action="Process instant payout.",
            loss_window_hours=claim_window,
        )


claim_decision_agent = ClaimDecisionAgent()

