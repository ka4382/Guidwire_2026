from __future__ import annotations

import json
from pathlib import Path

import joblib
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler


BASE_DIR = Path(__file__).resolve().parents[1]
MODEL_PATH = BASE_DIR / "models" / "fraud_isolation_forest.joblib"
DATA_PATH = BASE_DIR / "data" / "synthetic_fraud_training.json"


def generate_synthetic_rows(sample_size: int = 320):
    rng = np.random.default_rng(42)
    rows = []

    for _ in range(sample_size):
        normal = rng.random() > 0.2
        if normal:
            row = {
                "gps_stability_score": float(rng.uniform(0.62, 0.95)),
                "movement_distance_ratio": float(rng.uniform(0.45, 0.88)),
                "avg_speed": float(rng.uniform(10, 28)),
                "accelerometer_motion_score": float(rng.uniform(0.52, 0.92)),
                "delivery_completion_rate": float(rng.uniform(0.58, 0.96)),
                "claim_frequency_30d": float(rng.integers(0, 3)),
                "network_geo_consistency": float(rng.uniform(0.64, 0.96)),
                "cross_worker_trigger_similarity": float(rng.uniform(0.05, 0.42)),
                "active_minutes_during_window": float(rng.uniform(42, 118)),
                "label": "normal",
            }
        else:
            row = {
                "gps_stability_score": float(rng.uniform(0.02, 0.38)),
                "movement_distance_ratio": float(rng.uniform(0.01, 0.28)),
                "avg_speed": float(rng.uniform(35, 84)),
                "accelerometer_motion_score": float(rng.uniform(0.01, 0.22)),
                "delivery_completion_rate": float(rng.uniform(0.02, 0.36)),
                "claim_frequency_30d": float(rng.integers(3, 7)),
                "network_geo_consistency": float(rng.uniform(0.02, 0.4)),
                "cross_worker_trigger_similarity": float(rng.uniform(0.58, 0.96)),
                "active_minutes_during_window": float(rng.uniform(0, 18)),
                "label": "anomaly",
            }
        rows.append(row)

    return rows


def train():
    rows = generate_synthetic_rows()
    DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    DATA_PATH.write_text(json.dumps(rows, indent=2))

    feature_keys = [
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
    X = np.array([[row[key] for key in feature_keys] for row in rows])

    pipeline = Pipeline(
        steps=[
            ("scaler", StandardScaler()),
            (
                "isolation_forest",
                IsolationForest(
                    contamination=0.2,
                    n_estimators=200,
                    random_state=42,
                ),
            ),
        ]
    )
    pipeline.fit(X)
    joblib.dump(pipeline, MODEL_PATH)
    print(f"Saved model to {MODEL_PATH}")
    print(f"Saved synthetic dataset to {DATA_PATH}")


if __name__ == "__main__":
    train()

