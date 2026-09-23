"""
app/schemas/verification.py — Schemas for the CV verification pipeline results.

Used by:
  - Officer evidence viewer (before/after + step-by-step breakdown)
  - Admin audit log
  - Contractor rejection notifications
"""

from typing import Optional
from uuid import UUID

from pydantic import BaseModel


# ── Per-step result (matches the JSONB stored in verification table) ───────────
class StepResult(BaseModel):
    """Generic result structure for any single verification step."""
    passed: bool
    score: float           # 0.0–1.0 contribution to fusion
    reason: Optional[str]  # Human-readable explanation (shown on rejection)


class Step1IntegrityResult(StepResult):
    hamming_distance: Optional[int]   # pHash Hamming distance
    is_duplicate: bool
    timestamp_valid: bool


class Step2GPSResult(StepResult):
    distance_meters: float            # Haversine result


class Step3AngleResult(StepResult):
    heading_diff: Optional[float]     # Degrees difference in compass heading
    tilt_diff: Optional[float]        # Degrees difference in tilt
    homography_score: Optional[float] # Reprojection error (lower = better)


class Step4LandmarkResult(StepResult):
    match_count: int                  # Total ORB/SIFT matches
    inlier_count: int                 # Matches surviving RANSAC
    inlier_ratio: float               # inlier_count / match_count


class Step5RepairResult(StepResult):
    before_detected_class: Optional[str]  # e.g. "pothole"
    after_detected_class: Optional[str]   # e.g. "intact_road"
    pothole_in_after: bool


# ── Full verification result ──────────────────────────────────────────────────
class VerificationResult(BaseModel):
    """Complete result returned by the CV pipeline and stored in the DB."""
    verification_id: UUID
    repair_id: UUID
    step1: Step1IntegrityResult
    step2: Step2GPSResult
    step3: Step3AngleResult
    step4: Step4LandmarkResult
    step5: Step5RepairResult
    vlm_result: Optional[dict] = None # Vision-LLM Semantic Co-Pilot result
    fusion_score: float               # Weighted aggregate 0.0–1.0
    outcome: str                      # auto_pass | officer_review | auto_reject
    rejection_reason: Optional[str]

    model_config = {"from_attributes": True}


# ── Officer override request ──────────────────────────────────────────────────
class OfficerOverrideRequest(BaseModel):
    """Body for POST /officer/queue/{vid}/approve or /reject"""
    notes: Optional[str] = None


# ── Officer evidence viewer response ─────────────────────────────────────────
class EvidenceViewerResponse(BaseModel):
    """
    Full data package for the officer's side-by-side evidence viewer.
    Includes before/after photos and detailed step-by-step breakdown.
    """
    verification_id: UUID
    complaint_id: UUID
    before_photo_url: str
    after_photo_url: str
    result: VerificationResult
    keypoint_overlay_url: Optional[str]  # Optional: visualised keypoint match image
