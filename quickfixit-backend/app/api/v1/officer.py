"""
app/api/v1/officer.py — Municipal officer portal endpoints.

Endpoints:
  GET  /officer/queue                         — complaints pending manual review
  GET  /officer/queue/{verification_id}       — full evidence viewer (before/after + step breakdown)
  POST /officer/queue/{verification_id}/approve — manually approve a repair
  POST /officer/queue/{verification_id}/reject  — manually reject a repair
  GET  /officer/dashboard                     — heatmap stats + SLA overview
  GET  /officer/contractors/{id}/scorecard    — fraud/pass/fail history per contractor

Rule: NO business logic here. All logic delegated to OfficerService.
"""

from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_session, get_current_user_id
from app.core.security import require_role
from app.schemas.complaint import ComplaintSummary
from app.schemas.verification import EvidenceViewerResponse, OfficerOverrideRequest
from app.schemas.admin import ContractorScorecard
from app.services.officer_service import OfficerService

router = APIRouter()

# All officer routes require officer or admin role
_officer = Depends(require_role("officer", "admin"))


@router.get("/queue", response_model=list[ComplaintSummary], dependencies=[_officer])
async def get_review_queue(db: AsyncSession = Depends(get_session)):
    """
    Returns all verifications with outcome='officer_review'.
    These are cases where the AI was uncertain (fusion score 0.50–0.79)
    and a human decision is required.
    """
    return await OfficerService(db).get_review_queue()


@router.get(
    "/queue/{verification_id}",
    response_model=EvidenceViewerResponse,
    dependencies=[_officer],
)
async def get_evidence(
    verification_id: UUID,
    db: AsyncSession = Depends(get_session),
):
    """
    Returns the full evidence package for a verification case:
      - Before and after photos (pre-signed URLs)
      - Per-step CV pipeline breakdown
      - Matched keypoint overlay image (visualised ORB/SIFT matches)
    """
    return await OfficerService(db).get_evidence(verification_id)


@router.post(
    "/queue/{verification_id}/approve",
    response_model=dict,
    dependencies=[_officer],
)
async def approve_repair(
    verification_id: UUID,
    body: OfficerOverrideRequest,
    db: AsyncSession = Depends(get_session),
    officer_id: UUID = Depends(get_current_user_id),
):
    """
    Officer manually approves a repair.
    The complaint moves to 'verified' status and the contractor is notified.
    The override is recorded in the audit log.
    """
    await OfficerService(db).approve(verification_id, officer_id, body.notes)
    return {"message": "Repair approved and complaint marked as verified"}


@router.post(
    "/queue/{verification_id}/reject",
    response_model=dict,
    dependencies=[_officer],
)
async def reject_repair(
    verification_id: UUID,
    body: OfficerOverrideRequest,
    db: AsyncSession = Depends(get_session),
    officer_id: UUID = Depends(get_current_user_id),
):
    """
    Officer manually rejects a repair.
    The complaint returns to 'assigned' and the contractor must resubmit.
    """
    await OfficerService(db).reject(verification_id, officer_id, body.notes)
    return {"message": "Repair rejected. Contractor notified to resubmit."}


@router.get("/dashboard", response_model=dict, dependencies=[_officer])
async def get_dashboard(db: AsyncSession = Depends(get_session)):
    """
    Aggregated dashboard data:
      - Complaint counts by status
      - SLA breach rate
      - Heatmap data
      - Top/bottom contractors by pass rate
    """
    return await OfficerService(db).get_dashboard()


@router.get(
    "/contractors/{contractor_id}/scorecard",
    response_model=ContractorScorecard,
    dependencies=[_officer],
)
async def get_contractor_scorecard(
    contractor_id: UUID,
    db: AsyncSession = Depends(get_session),
):
    """
    Returns a contractor's full repair integrity scorecard:
    auto_pass / officer_review / auto_reject counts, pass rate,
    and average CV fusion score.
    """
    return await OfficerService(db).get_contractor_scorecard(contractor_id)
