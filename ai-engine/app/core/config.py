from pathlib import Path
import os

from dotenv import load_dotenv


load_dotenv()


BASE_DIR = Path(__file__).resolve().parents[2]


class Settings:
    app_env = os.getenv("APP_ENV", "development")
    mock_mode = os.getenv("MOCK_MODE", "true").lower() == "true"
    enable_langchain = os.getenv("ENABLE_LANGCHAIN", "true").lower() == "true"
    fraud_model_path = os.getenv(
        "FRAUD_MODEL_PATH", str(BASE_DIR / "models" / "fraud_isolation_forest.joblib")
    )


settings = Settings()

