"""
app/models/verification.py — Verification result table.

Stores the output of every step in the 6-step CV pipeline as JSONB columns.
Each step's result is independent and fully auditable.

Outcome values:
  auto_pass      — fusion score ≥ 0.80, complaint moves to 'verified'
  officer_review — fusion score 0.50–0.79, goes to officer queue
  auto_reject    — fusion score < 0.50 or hard fail on Step 1/2
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, JSON, String, Text, Uuid
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

JSON_TYPE = JSON().with_variant(JSONB, "postgresql")


class Verification(Base):
    __tablename__ = "verifications"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, default=uuid.uuid4
    )
    repair_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("repairs.id"), nullable=False, unique=True
    )

    # ── Per-step results stored as JSON ───────────────────────────────────────
    # Each step stores: { "score": float, "passed": bool, "reason": str, ...extras }

    # Step 1: pHash duplicate check + timestamp validation
    step1_integrity: Mapped[dict] = mapped_column(JSON_TYPE, nullable=True)

    # Step 2: Haversine GPS distance
    step2_gps: Mapped[dict] = mapped_column(JSON_TYPE, nullable=True)

    # Step 3: Heading/tilt delta + homography matrix score
    step3_angle: Mapped[dict] = mapped_column(JSON_TYPE, nullable=True)

    # Step 4: ORB/SIFT keypoint matching + RANSAC inlier ratio
    step4_landmarks: Mapped[dict] = mapped_column(JSON_TYPE, nullable=True)

    # Step 5: YOLOv8 damage-before / patch-after segmentation
    step5_repair: Mapped[dict] = mapped_column(JSON_TYPE, nullable=True)


    # Step 6: Weighted fusion score (0.0–1.0)
    step6_fusion: Mapped[float] = mapped_column(Float, nullable=True)

    # ── Final decision ────────────────────────────────────────────────────────
    # auto_pass | officer_review | auto_reject
    outcome: Mapped[str] = mapped_column(String(20), nullable=True, index=True)

    # Human-readable explanation sent to the contractor on rejection
    rejection_reason: Mapped[str] = mapped_column(Text, nullable=True)

    # True if a municipal officer manually overrode the AI decision
    officer_override: Mapped[bool] = mapped_column(Boolean, default=False)
    officer_notes: Mapped[str] = mapped_column(Text, nullable=True)

    # ── Timestamps ────────────────────────────────────────────────────────────
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # ── Relationships ─────────────────────────────────────────────────────────
    repair = relationship("Repair", back_populates="verification")

    def __repr__(self) -> str:
        return f"<Verification id={self.id} outcome={self.outcome} fusion={self.step6_fusion}>"
