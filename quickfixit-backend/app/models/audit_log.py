"""
app/models/audit_log.py — Tamper-evident audit log table.

Every significant state transition in the platform is recorded here.
Each entry includes a SHA-256 hash of its own data combined with the
previous entry's hash — forming a blockchain-style chain where any
tampering with past entries is immediately detectable.

This table is append-only. Nothing is ever updated or deleted from it.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, default=uuid.uuid4
    )

    # ── Who triggered this action ─────────────────────────────────────────────
    actor_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id"), nullable=True  # nullable for system actions
    )

    # ── What happened ─────────────────────────────────────────────────────────
    # Examples: COMPLAINT_CREATED, REPAIR_SUBMITTED, VERIFICATION_PASSED,
    #           OFFICER_OVERRIDE, COMPLAINT_REOPENED
    action: Mapped[str] = mapped_column(String(60), nullable=False, index=True)

    # ── Which entity was affected ─────────────────────────────────────────────
    entity_type: Mapped[str] = mapped_column(String(30), nullable=False)  # complaint | repair | verification | user
    entity_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False, index=True)


    # ── Optional human-readable note ──────────────────────────────────────────
    notes: Mapped[str] = mapped_column(Text, nullable=True)

    # ── Tamper-evident chain ──────────────────────────────────────────────────
    # SHA-256 of: (action + entity_type + str(entity_id) + str(actor_id) + str(created_at) + previous_hash)
    sha256_payload: Mapped[str] = mapped_column(String(64), nullable=False)

    # ── Timestamp ─────────────────────────────────────────────────────────────
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # ── Relationships ─────────────────────────────────────────────────────────
    actor = relationship("User", back_populates="audit_logs")

    def __repr__(self) -> str:
        return f"<AuditLog action={self.action} entity={self.entity_type}/{self.entity_id}>"
