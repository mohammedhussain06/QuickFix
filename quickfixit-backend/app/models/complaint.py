"""
app/models/complaint.py — Complaint table definition.

A Complaint is created by a citizen and progresses through a defined status lifecycle:
  pending → assigned → in_progress → under_review → verified | rejected | reopened

Stores geospatial location (PostGIS Point), before-photo metadata, and the AI
severity score used for priority triage.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Complaint(Base):
    __tablename__ = "complaints"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, default=uuid.uuid4
    )

    # ── Ownership ─────────────────────────────────────────────────────────────
    citizen_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id"), nullable=False, index=True
    )

    # ── Status lifecycle ──────────────────────────────────────────────────────
    # pending | assigned | in_progress | under_review | verified | rejected | reopened
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="pending", index=True)

    # ── Location data ─────────────────────────────────────────────────────────
    address_text: Mapped[str] = mapped_column(Text, nullable=True)   # reverse-geocoded label


    # Raw GPS values (also stored separately for easy querying without PostGIS)
    gps_lat: Mapped[float] = mapped_column(Float, nullable=False)
    gps_lng: Mapped[float] = mapped_column(Float, nullable=False)

    # ── Camera metadata (used by CV pipeline Steps 1, 3) ─────────────────────
    heading: Mapped[float] = mapped_column(Float, nullable=True)   # compass degrees 0–360
    tilt: Mapped[float] = mapped_column(Float, nullable=True)      # phone pitch in degrees

    # ── Photo storage ─────────────────────────────────────────────────────────
    before_photo_url: Mapped[str] = mapped_column(Text, nullable=True)   # MinIO object key
    before_photo_hash: Mapped[str] = mapped_column(String(64), nullable=True)  # pHash fingerprint

    # ── AI triage ─────────────────────────────────────────────────────────────
    severity_score: Mapped[float] = mapped_column(Float, nullable=True)  # 0.0–1.0, set by AI
    description: Mapped[str] = mapped_column(Text, nullable=True)        # citizen's description

    # ── Timestamps ────────────────────────────────────────────────────────────
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # ── Relationships ─────────────────────────────────────────────────────────
    citizen = relationship("User", back_populates="complaints", foreign_keys=[citizen_id])
    repairs = relationship("Repair", back_populates="complaint")
    audit_logs = relationship("AuditLog", primaryjoin="and_(AuditLog.entity_type=='complaint', foreign(AuditLog.entity_id)==Complaint.id)")

    def __repr__(self) -> str:
        return f"<Complaint id={self.id} status={self.status}>"
