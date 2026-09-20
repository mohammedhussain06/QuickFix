"""
app/models/user.py — User table definition.

Represents all platform users: citizens, contractors, officers, and admins.
Role-based access control is enforced in app/core/security.py using the `role` column.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, default=uuid.uuid4
    )

    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)

    # Role: citizen | contractor | officer | admin
    role: Mapped[str] = mapped_column(String(20), nullable=False, default="citizen")

    # Optional identifier fields for flexible login (phone, crew ID, badge ID)
    phone: Mapped[str | None] = mapped_column(String(30), nullable=True, unique=True, index=True)
    crew_id: Mapped[str | None] = mapped_column(String(50), nullable=True, unique=True, index=True)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


    # ── Relationships ─────────────────────────────────────────────────────────
    complaints = relationship("Complaint", back_populates="citizen", foreign_keys="Complaint.citizen_id")
    repairs = relationship("Repair", back_populates="contractor", foreign_keys="Repair.contractor_id")
    audit_logs = relationship("AuditLog", back_populates="actor")

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email} role={self.role}>"
