"""
app/api/v1/complaints.py — Citizen portal endpoints.

Endpoints:
  POST   /complaints/              — submit a new pothole complaint (with photo)
  GET    /complaints/              — list the authenticated citizen's complaints
  GET    /complaints/{id}          — full complaint detail + timeline
  POST   /complaints/{id}/reopen   — citizen flags repair as inadequate
  GET    /complaints/public/heatmap — public GeoJSON heatmap (no auth required)

Rule: NO business logic here. All logic delegated to ComplaintService.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.api.dependencies import get_session, get_current_user_id
from app.core.security import get_current_user
from app.schemas.complaint import (
    ComplaintCreate,
    ComplaintResponse,
    ComplaintSummary,
    HeatmapResponse,
    ReopenRequest,
)
from app.services.complaint_service import ComplaintService

router = APIRouter()


@router.post("/", response_model=ComplaintResponse, status_code=201)
async def submit_complaint(
    # Photo sent as multipart file
    photo: UploadFile = File(..., description="Before photo of the pothole"),
    # Metadata sent as form fields alongside the photo
    gps_lat: float = Form(...),
    gps_lng: float = Form(...),
    description: Optional[str] = Form(None),
    address_text: Optional[str] = Form(None),
    heading: Optional[float] = Form(None),
    tilt: Optional[float] = Form(None),
    db: AsyncSession = Depends(get_session),
    current_user: dict = Depends(get_current_user),
):
    """
    Submit a new pothole complaint.
    The before-photo is uploaded to MinIO; its pHash is computed and stored.
    An AI severity score is asynchronously computed for triage.
    """
    citizen_id = UUID(current_user["sub"])
    body = ComplaintCreate(
        gps_lat=gps_lat,
        gps_lng=gps_lng,
        description=description,
        address_text=address_text,
        heading=heading,
        tilt=tilt,
    )
    photo_bytes = await photo.read()
    return await ComplaintService(db).create_complaint(citizen_id, body, photo_bytes)


@router.get("/", response_model=list[ComplaintSummary])
async def list_my_complaints(
    db: AsyncSession = Depends(get_session),
    citizen_id: UUID = Depends(get_current_user_id),
):
    """List all complaints submitted by the currently authenticated citizen."""
    return await ComplaintService(db).list_by_citizen(citizen_id)


@router.get("/public/heatmap", response_model=HeatmapResponse)
async def get_public_heatmap(db: AsyncSession = Depends(get_session)):
    """
    Public endpoint — no authentication required.
    Returns a GeoJSON-compatible list of all complaints for the public map.
    """
    return await ComplaintService(db).get_heatmap()


@router.get("/{complaint_id}", response_model=ComplaintResponse)
async def get_complaint_detail(
    complaint_id: UUID,
    db: AsyncSession = Depends(get_session),
    current_user: dict = Depends(get_current_user),
):
    """Get the full detail and status timeline for a single complaint."""
    return await ComplaintService(db).get_detail(complaint_id)


@router.post("/{complaint_id}/reopen", response_model=ComplaintResponse)
async def reopen_complaint(
    complaint_id: UUID,
    body: ReopenRequest,
    db: AsyncSession = Depends(get_session),
    citizen_id: UUID = Depends(get_current_user_id),
):
    """
    Citizen flags a 'verified' repair as inadequate, reopening the complaint.
    The complaint status returns to 'reopened' and a new repair cycle begins.
    """
    return await ComplaintService(db).reopen(complaint_id, citizen_id, body.reason)
