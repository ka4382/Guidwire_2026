from __future__ import annotations

from pathlib import Path
from typing import Dict, Optional

import joblib
import numpy as np

from app.core.config import settings


FEATURE_ORDER = [
    "gps_stability_score",
    "movement_distance_ratio",
    "avg_speed",
    "accelerometer_motion_score",
    "delivery_completion_rate",
    "claim_frequency_30d",
    "network_geo_consistency",
    "cross_worker_trigger_similarity",
    "active_minutes_during_window",
]


class FraudModelService:
    def __init__(self) -> None:
        self._pipeline = None

    def load(self):
        if self._pipeline is not None:
            return self._pipeline

        model_path = Path(settings.fraud_model_path)
        if model_path.exists():
            self._pipeline = joblib.load(model_path)
        return self._pipeline

    def vectorize(self, features: Dict[str, float]) -> np.ndarray:
        return np.array([[float(features.get(key, 0.0)) for key in FEATURE_ORDER]])

    def score(self, features: Dict[str, float]) -> Optional[float]:
        pipeline = self.load()
        if pipeline is None:
            return None

        vector = self.vectorize(features)
        raw_score = float(pipeline.score_samples(vector)[0])
        normalized = 1 - ((raw_score + 0.5) / 0.8)
        return max(0.0, min(1.0, normalized))


fraud_model_service = FraudModelService()

