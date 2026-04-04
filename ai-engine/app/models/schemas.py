from datetime import datetime
from typing import Any, Dict, List, Literal, Optional

from pydantic import BaseModel, Field


class DisruptionMonitorRequest(BaseModel):
    zone: str
    dark_store_id: str
    weather: Dict[str, Any]
    aqi: Dict[str, Any]
    zone_status: Dict[str, Any]
    platform_status: Dict[str, Any]


class DisruptionMonitorResponse(BaseModel):
    disruption_type: str
    severity: str
    affected_zone: str
    trigger_status: bool
    recommended_claim_window: int
    evidence: List[Dict[str, Any]]
    threshold_value: float
    observed_value: float
    source: str


class RiskAssessmentRequest(BaseModel):
    worker_id: Optional[str] = None
    worker_location: str
    historical_disruption_frequency: float
    zone_risk_score: float
    weather_forecast_severity: float
    worker_activity_consistency: float
    pollution_history: float
    flood_prone_factor: float
    avg_weekly_earnings: float


class PricingFactor(BaseModel):
    label: str
    value: float
    direction: Literal["increase", "decrease", "neutral"]


class RiskAssessmentResponse(BaseModel):
    weekly_premium: int
    coverage_amount: int
    risk_level: Literal["low", "medium", "high"]
    explanation: str
    pricing_factors: List[PricingFactor]
    risk_score: float


class FraudDetectionRequest(BaseModel):
    worker_id: Optional[str] = None
    gps_history: List[Dict[str, Any]] = Field(default_factory=list)
    accelerometer: Dict[str, float] = Field(default_factory=dict)
    network_consistency: float
    claim_history: Dict[str, Any]
    active_delivery_logs: Dict[str, Any]


class FraudDetectionResponse(BaseModel):
    fraud_score: float
    anomaly_label: Literal["clear", "flagged", "fraudulent"]
    reasons: List[str]
    confidence: float
    features: Dict[str, float]


class ClaimDecisionRequest(BaseModel):
    trigger_event: Dict[str, Any]
    active_policy: Dict[str, Any]
    fraud_score: float
    worker_eligibility: Dict[str, Any]
    estimated_income_loss: float


class ClaimDecisionResponse(BaseModel):
    decision: Literal["approved", "flagged", "rejected"]
    payout_amount: int
    decision_reasoning: List[str]
    next_action: str
    loss_window_hours: int


class PayoutExecutionRequest(BaseModel):
    claim_id: str
    worker_id: str
    approved_claim: Dict[str, Any]
    payout_account_details: Dict[str, Any]


class PayoutExecutionResponse(BaseModel):
    simulated_payout_id: str
    payout_status: Literal["queued", "processing", "completed", "failed"]
    payout_timestamp: datetime
    provider: str


class OrchestratorRequest(BaseModel):
    worker: Dict[str, Any]
    worker_profile: Dict[str, Any]
    policy: Dict[str, Any]
    event_context: DisruptionMonitorRequest
    fraud_context: FraudDetectionRequest
    estimated_income_loss: float


class OrchestratorResponse(BaseModel):
    disruption: DisruptionMonitorResponse
    fraud: FraudDetectionResponse
    claim: ClaimDecisionResponse
    payout: Optional[PayoutExecutionResponse] = None

