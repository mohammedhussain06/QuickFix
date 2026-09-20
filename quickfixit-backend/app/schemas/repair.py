"""
app/schemas/repair.py — Request/response schemas for the contractor portal.

Used by:
  - Contractor portal (view jobs, ghost overlay, submit repair)
  - Officer dashboard (evidence viewer)
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


# ── Contractor: Submit repair after-photo ─────────────────────────────────────
class RepairSubmitRequest(BaseModel):
    """
    Metadata accompanying the after-photo upload.
    The photo itself is sent as a multipart file upload.
    """
    after_gps_lat: float = Field(..., ge=-90.0, le=90.0)
    after_gps_lng: float = Field(..., ge=-180.0, le=180.0)
    after_heading: Optional[float] = Field(None, ge=0.0, lt=360.0)
    after_tilt: Optional[float] = Field(None, ge=-90.0, le=90.0)


# ── Ghost overlay data (returned to contractor app for alignment) ─────────────
class GhostOverlayData(BaseModel):
    """
    Data returned by GET /contractor/jobs/{id}/overlay.
    The contractor app uses this to overlay the before photo as a
    translucent ghost in the camera viewfinder, guiding alignment.
    """
    before_photo_url: str          # Pre-signed URL of the original before photo
    target_heading: Optional[float]   # Expected compass heading
    target_tilt: Optional[float]      # Expected phone pitch
    gps_lat: float                 # Target GPS latitude
    gps_lng: float                 # Target GPS longitude


# ── Job list item (for contractor's assigned jobs list) ───────────────────────
class JobSummary(BaseModel):
    complaint_id: UUID
    repair_id: Optional[UUID]
    address_text: Optional[str]
    status: str
    severity_score: Optional[float]
    sla_deadline: Optional[datetime]
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Full job detail ────────────────────────────────────────────────────────────
class JobDetail(BaseModel):
    complaint_id: UUID
    repair_id: Optional[UUID]
    address_text: Optional[str]
    description: Optional[str]
    status: str
    severity_score: Optional[float]
    sla_deadline: Optional[datetime]
    before_photo_url: Optional[str]
    overlay: Optional[GhostOverlayData]

    model_config = {"from_attributes": True}


# ── Repair submission response ────────────────────────────────────────────────
class RepairResponse(BaseModel):
    repair_id: UUID
    complaint_id: UUID
    message: str = "Repair submitted. Verification is running in the background."
    submitted_at: datetime

    model_config = {"from_attributes": True}
