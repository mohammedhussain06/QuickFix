"""
app/schemas/admin.py — Schemas for the admin portal endpoints.

Used by:
  - Admin user management
  - Audit log viewer
  - System configuration (verification thresholds)
  - Contractor scorecard
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


# ── User management ───────────────────────────────────────────────────────────
class UserManageRequest(BaseModel):
    """Body for PUT /admin/users/{id}"""
    full_name: Optional[str] = None
    role: Optional[str] = Field(None, pattern="^(citizen|contractor|officer|admin)$")
    is_active: Optional[bool] = None


class AdminUserResponse(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str
    role: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Audit log ─────────────────────────────────────────────────────────────────
class AuditLogEntry(BaseModel):
    """One entry in the tamper-evident audit log."""
    id: UUID
    actor_id: Optional[UUID]
    action: str
    entity_type: str
    entity_id: UUID
    notes: Optional[str]
    sha256_payload: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ── System config (verification thresholds) ───────────────────────────────────
class SystemConfig(BaseModel):
    """
    Current verification thresholds — all are runtime-configurable
    via PUT /admin/config without redeployment.
    """
    gps_tolerance_meters: float = Field(..., gt=0)
    heading_tolerance_degrees: float = Field(..., gt=0, le=180)
    tilt_tolerance_degrees: float = Field(..., gt=0, le=90)
    landmark_min_matches: int = Field(..., gt=0)
    landmark_min_inlier_ratio: float = Field(..., gt=0.0, le=1.0)
    phash_hamming_threshold: int = Field(..., gt=0)
    fusion_auto_pass: float = Field(..., gt=0.0, le=1.0)
    fusion_officer_review: float = Field(..., gt=0.0, le=1.0)


# ── Contractor scorecard ───────────────────────────────────────────────────────
class ContractorScorecard(BaseModel):
    """Summary of a contractor's repair history for officer monitoring."""
    contractor_id: UUID
    contractor_name: str
    total_assigned: int
    auto_passed: int
    officer_reviewed: int
    auto_rejected: int
    pass_rate: float            # auto_passed / total_assigned
    avg_fusion_score: float     # Average CV confidence across all repairs
