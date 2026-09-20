"""
app/services/officer_service.py — Officer review and dashboard logic.

Responsibilities:
  - Return the officer review queue (verifications needing human decision)
  - Build the full evidence viewer package (before/after + step breakdown)
  - Process approve/reject overrides and update complaint status
  - Build the officer dashboard aggregates
  - Compute contractor integrity scorecards
"""

from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.core.storage import get_presigned_url
from app.models.complaint import Complaint
from app.models.repair import Repair
from app.models.verification import Verification
from app.models.user import User
from app.schemas.complaint import ComplaintSummary
from app.schemas.verification import (
    EvidenceViewerResponse,
    VerificationResult,
    Step1IntegrityResult,
    Step2GPSResult,
    Step3AngleResult,
    Step4LandmarkResult,
    Step5RepairResult,
)
from app.schemas.admin import ContractorScorecard
from app.services.audit_service import AuditService
from app.services.notification_service import NotificationService


class OfficerService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.audit = AuditService(db)
        self.notify = NotificationService()

    # ── Review queue ──────────────────────────────────────────────────────────
    async def get_review_queue(self) -> list[ComplaintSummary]:
        """All verifications with outcome='officer_review', newest first."""
        verifications = await self.db.scalars(
            select(Verification)
            .where(Verification.outcome == "officer_review")
            .order_by(Verification.created_at.desc())
        )
        summaries = []
        for v in verifications.all():
            repair = await self.db.get(Repair, v.repair_id)
            if repair:
                complaint = await self.db.get(Complaint, repair.complaint_id)
                if complaint:
                    summaries.append(ComplaintSummary.model_validate(complaint))
        return summaries

    # ── Evidence viewer ───────────────────────────────────────────────────────
    async def get_evidence(self, verification_id: UUID) -> EvidenceViewerResponse:
        """Returns before/after photos + full per-step CV breakdown."""
        verification = await self.db.get(Verification, verification_id)
        if not verification:
            raise NotFoundError("Verification")

        repair = await self.db.get(Repair, verification.repair_id)
        complaint = await self.db.get(Complaint, repair.complaint_id)

        before_url = get_presigned_url(complaint.before_photo_url) if complaint.before_photo_url else ""
        after_url = get_presigned_url(repair.after_photo_url) if repair.after_photo_url else ""

        result = self._build_verification_result(verification)

        return EvidenceViewerResponse(
            verification_id=verification.id,
            complaint_id=complaint.id,
            before_photo_url=before_url,
            after_photo_url=after_url,
            result=result,
        )

    # ── Approve override ──────────────────────────────────────────────────────
    async def approve(self, verification_id: UUID, officer_id: UUID, notes: str | None) -> None:
        verification = await self.db.get(Verification, verification_id)
        if not verification:
            raise NotFoundError("Verification")

        verification.outcome = "auto_pass"
        verification.officer_override = True
        verification.officer_notes = notes

        repair = await self.db.get(Repair, verification.repair_id)
        complaint = await self.db.get(Complaint, repair.complaint_id)
        complaint.status = "verified"

        await self.db.flush()
        await self.audit.log(
            actor_id=officer_id,
            action="OFFICER_OVERRIDE_APPROVE",
            entity_type="verification",
            entity_id=verification_id,
            notes=notes,
        )
        await self.notify.send_contractor_notification(
            repair.contractor_id, "Your repair has been manually approved by an officer."
        )

    # ── Reject override ───────────────────────────────────────────────────────
    async def reject(self, verification_id: UUID, officer_id: UUID, notes: str | None) -> None:
        verification = await self.db.get(Verification, verification_id)
        if not verification:
            raise NotFoundError("Verification")

        verification.outcome = "auto_reject"
        verification.officer_override = True
        verification.officer_notes = notes

        repair = await self.db.get(Repair, verification.repair_id)
        complaint = await self.db.get(Complaint, repair.complaint_id)
        complaint.status = "assigned"   # contractor must resubmit

        await self.db.flush()
        await self.audit.log(
            actor_id=officer_id,
            action="OFFICER_OVERRIDE_REJECT",
            entity_type="verification",
            entity_id=verification_id,
            notes=notes,
        )
        await self.notify.send_contractor_notification(
            repair.contractor_id,
            f"Your repair was rejected by an officer. Reason: {notes or 'See portal for details'}",
        )

    # ── Dashboard ─────────────────────────────────────────────────────────────
    async def get_dashboard(self) -> dict:
        """Aggregated complaint counts, SLA breach rate, and top/bottom contractors."""
        status_counts = await self.db.execute(
            select(Complaint.status, func.count(Complaint.id))
            .group_by(Complaint.status)
        )
        return {
            "complaint_counts_by_status": {row[0]: row[1] for row in status_counts.all()},
        }

    # ── Contractor scorecard ──────────────────────────────────────────────────
    async def get_contractor_scorecard(self, contractor_id: UUID) -> ContractorScorecard:
        contractor = await self.db.get(User, contractor_id)
        if not contractor:
            raise NotFoundError("Contractor")

        repairs = await self.db.scalars(
            select(Repair).where(Repair.contractor_id == contractor_id)
        )
        repairs_list = repairs.all()
        total = len(repairs_list)

        passed = officer_reviewed = rejected = 0
        fusion_scores = []

        for repair in repairs_list:
            v = await self.db.scalar(
                select(Verification).where(Verification.repair_id == repair.id)
            )
            if v:
                if v.outcome == "auto_pass":
                    passed += 1
                elif v.outcome == "officer_review":
                    officer_reviewed += 1
                elif v.outcome == "auto_reject":
                    rejected += 1
                if v.step6_fusion is not None:
                    fusion_scores.append(v.step6_fusion)

        return ContractorScorecard(
            contractor_id=contractor_id,
            contractor_name=contractor.full_name,
            total_assigned=total,
            auto_passed=passed,
            officer_reviewed=officer_reviewed,
            auto_rejected=rejected,
            pass_rate=round(passed / total, 4) if total else 0.0,
            avg_fusion_score=round(sum(fusion_scores) / len(fusion_scores), 4) if fusion_scores else 0.0,
        )

    # ── Helper: convert DB verification to schema ─────────────────────────────
    def _build_verification_result(self, v: Verification) -> VerificationResult:
        """Unpacks JSONB columns into typed Pydantic step result objects."""
        def parse(cls, data: dict | None):
            return cls(**(data or {"passed": False, "score": 0.0, "reason": "No data"}))

        return VerificationResult(
            verification_id=v.id,
            repair_id=v.repair_id,
            step1=parse(Step1IntegrityResult, v.step1_integrity),
            step2=parse(Step2GPSResult, v.step2_gps),
            step3=parse(Step3AngleResult, v.step3_angle),
            step4=parse(Step4LandmarkResult, v.step4_landmarks),
            step5=parse(Step5RepairResult, v.step5_repair),
            fusion_score=v.step6_fusion or 0.0,
            outcome=v.outcome or "unknown",
            rejection_reason=v.rejection_reason,
        )
