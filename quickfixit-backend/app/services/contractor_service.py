"""
app/services/contractor_service.py — Contractor job management logic.

Responsibilities:
  - List jobs assigned to a contractor (with SLA countdown)
  - Get job detail (complaint + before photo)
  - Build ghost overlay data for camera alignment
  - Accept after-photo upload, store it, and trigger the CV verification pipeline
"""

import imagehash
from datetime import datetime, timezone, timedelta
from io import BytesIO
from uuid import UUID

from PIL import Image
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError, InvalidComplaintStatusError
from app.core.storage import upload_photo, get_presigned_url
from app.models.complaint import Complaint
from app.models.repair import Repair
from app.schemas.repair import GhostOverlayData, JobDetail, JobSummary, RepairResponse
from app.services.audit_service import AuditService


# SLA duration: 72 hours from assignment (configurable)
SLA_HOURS = 72


class ContractorService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.audit = AuditService(db)

    # ── List assigned jobs ────────────────────────────────────────────────────
    async def list_jobs(self, contractor_id: UUID) -> list[JobSummary]:
        """Returns all complaints currently assigned to this contractor."""
        repairs = await self.db.scalars(
            select(Repair)
            .where(Repair.contractor_id == contractor_id)
            .order_by(Repair.sla_deadline.asc())
        )
        summaries = []
        for repair in repairs.all():
            complaint = await self.db.get(Complaint, repair.complaint_id)
            summaries.append(
                JobSummary(
                    complaint_id=repair.complaint_id,
                    repair_id=repair.id,
                    address_text=complaint.address_text if complaint else None,
                    status=complaint.status if complaint else "unknown",
                    severity_score=complaint.severity_score if complaint else None,
                    sla_deadline=repair.sla_deadline,
                    created_at=repair.created_at,
                )
            )
        return summaries

    # ── Job detail ────────────────────────────────────────────────────────────
    async def get_job_detail(self, complaint_id: UUID, contractor_id: UUID) -> JobDetail:
        complaint = await self.db.get(Complaint, complaint_id)
        if not complaint:
            raise NotFoundError("Complaint")

        repair = await self.db.scalar(
            select(Repair).where(
                Repair.complaint_id == complaint_id,
                Repair.contractor_id == contractor_id,
            )
        )

        before_url = None
        if complaint.before_photo_url:
            before_url = get_presigned_url(complaint.before_photo_url)

        overlay = await self.get_overlay_data(complaint_id)

        return JobDetail(
            complaint_id=complaint.id,
            repair_id=repair.id if repair else None,
            address_text=complaint.address_text,
            description=complaint.description,
            status=complaint.status,
            severity_score=complaint.severity_score,
            sla_deadline=repair.sla_deadline if repair else None,
            before_photo_url=before_url,
            overlay=overlay,
        )

    # ── Ghost overlay data ────────────────────────────────────────────────────
    async def get_overlay_data(self, complaint_id: UUID) -> GhostOverlayData:
        """
        Returns the sensor targets the contractor app uses to show a ghost overlay
        in the camera viewfinder — guiding the contractor to match angle and GPS.
        """
        complaint = await self.db.get(Complaint, complaint_id)
        if not complaint:
            raise NotFoundError("Complaint")

        before_url = get_presigned_url(complaint.before_photo_url) if complaint.before_photo_url else ""

        return GhostOverlayData(
            before_photo_url=before_url,
            target_heading=complaint.heading,
            target_tilt=complaint.tilt,
            gps_lat=complaint.gps_lat,
            gps_lng=complaint.gps_lng,
        )

    # ── Submit after-photo (triggers verification) ────────────────────────────
    async def submit_repair(
        self,
        complaint_id: UUID,
        contractor_id: UUID,
        photo_bytes: bytes,
        after_gps_lat: float,
        after_gps_lng: float,
        after_heading: float | None,
        after_tilt: float | None,
    ) -> RepairResponse:
        complaint = await self.db.get(Complaint, complaint_id)
        if not complaint:
            raise NotFoundError("Complaint")
        if complaint.status not in ("assigned", "in_progress", "reopened"):
            raise InvalidComplaintStatusError(complaint.status, "assigned/in_progress")

        # 1. Upload after-photo to MinIO
        photo_key = upload_photo(photo_bytes)

        # 2. Compute pHash for Step 1 duplicate detection
        img = Image.open(BytesIO(photo_bytes))
        photo_hash = str(imagehash.phash(img))

        # 3. Find or create the Repair record
        repair = await self.db.scalar(
            select(Repair).where(
                Repair.complaint_id == complaint_id,
                Repair.contractor_id == contractor_id,
            )
        )
        now = datetime.now(timezone.utc)
        if repair is None:
            repair = Repair(
                complaint_id=complaint_id,
                contractor_id=contractor_id,
                sla_deadline=now + timedelta(hours=SLA_HOURS),
            )
            self.db.add(repair)

        repair.after_photo_url = photo_key
        repair.after_photo_hash = photo_hash
        repair.after_gps_lat = after_gps_lat
        repair.after_gps_lng = after_gps_lng
        repair.after_heading = after_heading
        repair.after_tilt = after_tilt
        repair.submitted_at = now

        # 4. Mark complaint as under_review
        complaint.status = "under_review"

        await self.db.flush()
        await self.db.refresh(repair)

        # 5. Log the submission
        await self.audit.log(
            actor_id=contractor_id,
            action="REPAIR_SUBMITTED",
            entity_type="repair",
            entity_id=repair.id,
        )

        # 6. Dispatch the CV verification pipeline
        #    Demo mode  → runs directly as an asyncio background coroutine (no Redis/Celery)
        #    Production → dispatches to Celery worker
        from app.core.config import settings as _s
        if _s.is_demo:
            import asyncio
            from app.services.verification.pipeline import run_pipeline as _run
            asyncio.create_task(_run(repair.id))
        else:
            from app.tasks.verify_repair import verify_repair_task
            verify_repair_task.delay(str(repair.id))

        return RepairResponse(
            repair_id=repair.id,
            complaint_id=complaint_id,
            submitted_at=now,
        )
