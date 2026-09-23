"""
app/api/v1/verification_api.py — Public & Internal Verification Pair Evaluation Endpoint.

Enables instant evaluation of any arbitrary BEFORE / AFTER photo pair using
the Vision-LLM verification analyst, returning the exact structured JSON verdict.
"""

from typing import Optional
from fastapi import APIRouter, File, Form, UploadFile, status

from app.services.verification.vlm_verifier import evaluate_repair

router = APIRouter()


@router.post("/verify-pair", status_code=status.HTTP_200_OK)
async def verify_photo_pair(
    before_photo: UploadFile = File(..., description="Citizen's original complaint photo"),
    after_photo: UploadFile = File(..., description="Contractor's claimed repair photo"),
    complaint_id: Optional[str] = Form("CF-DEMO-01"),
    complaint_lat: Optional[float] = Form(None),
    complaint_lng: Optional[float] = Form(None),
    complaint_heading: Optional[float] = Form(None),
    repair_lat: Optional[float] = Form(None),
    repair_lng: Optional[float] = Form(None),
    repair_heading: Optional[float] = Form(None),
):
    """
    Evaluates a BEFORE and AFTER photo pair through the Vision-LLM Repair Verification Analyst.
    Returns the complete 4-dimension evaluation, matched landmarks, detected red flags,
    confidence, and municipal officer decision summary.
    """
    before_bytes = await before_photo.read()
    after_bytes = await after_photo.read()

    verdict = evaluate_repair(
        before_bytes=before_bytes,
        after_bytes=after_bytes,
        complaint_id=complaint_id or "CF-DEMO-01",
        complaint_lat=complaint_lat,
        complaint_lng=complaint_lng,
        complaint_heading=complaint_heading,
        repair_lat=repair_lat,
        repair_lng=repair_lng,
        repair_heading=repair_heading,
    )

    return verdict
