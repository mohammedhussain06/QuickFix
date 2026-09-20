"""
app/core/config.py — Centralised configuration.

Responsibilities:
  - Reads ALL environment variables from .env in one place
  - Exposes a single `settings` singleton used everywhere
  - Supports two modes:
      demo        → SQLite + local file storage (no Docker needed)
      development → PostgreSQL + MinIO (full Docker stack)
"""

from typing import Any
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", case_sensitive=False, extra="ignore"
    )

    # ── App ───────────────────────────────────────────────────────────────────
    app_env: str = "demo"           # demo | development | production
    debug: bool = True
    secret_key: str = "change-me"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_days: int = 7

    # ── Database ──────────────────────────────────────────────────────────────
    # Demo default: SQLite (no install needed)
    # Production:   postgresql+asyncpg://user:pass@host/db
    database_url: str = "sqlite+aiosqlite:///./quickfixit_demo.db"

    # ── Storage backend ───────────────────────────────────────────────────────
    # "local"  → saves photos to LOCAL_STORAGE_PATH folder (demo)
    # "minio"  → saves photos to MinIO/S3 bucket (production)
    storage_backend: str = "local"
    local_storage_path: str = "./uploaded_photos"

    # ── MinIO / S3 (only used when storage_backend="minio") ───────────────────
    minio_endpoint: str = "localhost:9000"
    minio_root_user: str = "minioadmin"
    minio_root_password: str = "minioadmin123"
    minio_bucket_photos: str = "quickfixit-photos"
    minio_use_ssl: bool = False

    # ── Redis / Celery (optional — not needed in demo mode) ───────────────────
    redis_url: str = ""
    celery_broker_url: str = ""
    celery_result_backend: str = ""

    @property
    def is_demo(self) -> bool:
        return self.app_env == "demo"

    # ── Verification thresholds (all configurable at runtime via /admin/config)
    gps_tolerance_meters: float = 20.0
    heading_tolerance_degrees: float = 30.0
    tilt_tolerance_degrees: float = 20.0
    landmark_min_matches: int = 15
    landmark_min_inlier_ratio: float = 0.35
    phash_hamming_threshold: int = 8
    fusion_auto_pass: float = 0.80
    fusion_officer_review: float = 0.50

    # ── YOLO & Hugging Face ──────────────────────────────────────────────────
    yolo_model_path: str = "models/pothole_yolov8/weights/best.pt"
    hf_model_repo: str = "RoxieRoller/QuickFixIt-model"

    # ── CORS ──────────────────────────────────────────────────────────────────
    # Accepts JSON list string or comma-separated string from .env
    allowed_origins_raw: Any = Field(
        default=["http://localhost:3000", "http://localhost:5173"],
        alias="allowed_origins",
        validation_alias="allowed_origins",
    )

    @property
    def allowed_origins(self) -> list[str]:
        val = self.allowed_origins_raw
        if isinstance(val, list):
            return [str(x) for x in val]
        if isinstance(val, str):
            val = val.strip()
            if val.startswith("[") and val.endswith("]"):
                import json
                try:
                    parsed = json.loads(val)
                    if isinstance(parsed, list):
                        return [str(x) for x in parsed]
                except Exception:
                    pass
            return [origin.strip() for origin in val.split(",") if origin.strip()]
        return ["http://localhost:3000", "http://localhost:5173"]


# Singleton — import this everywhere instead of instantiating Settings again
settings = Settings()

