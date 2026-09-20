"""
app/api/v1/contractor.py — Contractor portal endpoints.

Endpoints:
  GET  /contractor/jobs                 — list assigned jobs with SLA countdowns
  GET  /contractor/jobs/{complaint_id}  — job detail + before photo
  GET  /contractor/jobs/{complaint_id}/overlay — ghost overlay data for camera alignment
  POST /contractor/jobs/{complaint_id}/submit  — upload after-photo + sensor metadata

Rule: NO business logic here. All logic delegated to ContractorService.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.api.dependencies import get_session, get_current_user_id
from app.core.security import require_role
from app.schemas.repair import GhostOverlayData, JobDetail, JobSummary, RepairResponse
from app.services.contractor_service import ContractorService

router = APIRouter()

# All contractor routes require the 'contractor' role
_contractor = Depends(require_role("contractor"))


@router.get("/jobs", response_model=list[JobSummary], dependencies=[_contractor])
async def list_jobs(
    db: AsyncSession = Depends(get_session),
    contractor_id: UUID = Depends(get_current_user_id),
):
    """
    List all complaints assigned to this contractor.
    Each job includes an SLA countdown so the contractor knows urgency.
    """
    return await ContractorService(db).list_jobs(contractor_id)


@router.get("/jobs/{complaint_id}", response_model=JobDetail, dependencies=[_contractor])
async def get_job_detail(
    complaint_id: UUID,
    db: AsyncSession = Depends(get_session),
    contractor_id: UUID = Depends(get_current_user_id),
):
    """Full detail for one assigned job including the before photo."""
    return await ContractorService(db).get_job_detail(complaint_id, contractor_id)


@router.get(
    "/jobs/{complaint_id}/overlay",
    response_model=GhostOverlayData,
    dependencies=[_contractor],
)
async def get_ghost_overlay(
    complaint_id: UUID,
    db: AsyncSession = Depends(get_session),
):
    """
    Returns the before photo (pre-signed URL) and sensor targets (heading, tilt, GPS)
    so the contractor app can overlay a translucent ghost in the camera viewfinder
    to guide precise alignment before taking the after photo.
    """
    return await ContractorService(db).get_overlay_data(complaint_id)


@router.post(
    "/jobs/{complaint_id}/submit",
    response_model=RepairResponse,
    status_code=202,
    dependencies=[_contractor],
)
async def submit_repair(
    complaint_id: UUID,
    after_photo: UploadFile = File(..., description="After-repair photo"),
    after_gps_lat: float = Form(...),
    after_gps_lng: float = Form(...),
    after_heading: Optional[float] = Form(None),
    after_tilt: Optional[float] = Form(None),
    db: AsyncSession = Depends(get_session),
    contractor_id: UUID = Depends(get_current_user_id),
):
    """
    Upload the after-photo and sensor metadata for a completed repair.
    Returns 202 Accepted — the 6-step CV verification pipeline runs asynchronously
    as a Celery background task. The contractor is notified of the result.
    """
    photo_bytes = await after_photo.read()
    return await ContractorService(db).submit_repair(
        complaint_id=complaint_id,
        contractor_id=contractor_id,
        photo_bytes=photo_bytes,
        after_gps_lat=after_gps_lat,
        after_gps_lng=after_gps_lng,
        after_heading=after_heading,
        after_tilt=after_tilt,
    )
