"""
app/models/repair.py — Repair table definition.

A Repair is submitted by a contractor for an assigned Complaint.
It stores the after-photo and all sensor metadata (GPS, heading, tilt)
needed by the 6-step CV verification pipeline.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Repair(Base):
    __tablename__ = "repairs"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, default=uuid.uuid4
    )

    # ── Ownership ─────────────────────────────────────────────────────────────
    complaint_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("complaints.id"), nullable=False, index=True
    )
    contractor_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id"), nullable=False, index=True
    )


    # ── After-photo storage ───────────────────────────────────────────────────
    after_photo_url: Mapped[str] = mapped_column(Text, nullable=True)        # MinIO object key
    after_photo_hash: Mapped[str] = mapped_column(String(64), nullable=True) # pHash (Step 1)

    # ── After-photo sensor metadata (used by CV pipeline Steps 2, 3) ─────────
    after_gps_lat: Mapped[float] = mapped_column(Float, nullable=True)
    after_gps_lng: Mapped[float] = mapped_column(Float, nullable=True)
    after_heading: Mapped[float] = mapped_column(Float, nullable=True)  # compass degrees
    after_tilt: Mapped[float] = mapped_column(Float, nullable=True)     # phone pitch

    # ── SLA tracking ──────────────────────────────────────────────────────────
    sla_deadline: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)

    # ── Timestamps ────────────────────────────────────────────────────────────
    submitted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # ── Relationships ─────────────────────────────────────────────────────────
    complaint = relationship("Complaint", back_populates="repairs")
    contractor = relationship("User", back_populates="repairs", foreign_keys=[contractor_id])
    verification = relationship("Verification", back_populates="repair", uselist=False)

    def __repr__(self) -> str:
        return f"<Repair id={self.id} complaint_id={self.complaint_id}>"
