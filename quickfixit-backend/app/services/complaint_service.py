"""
app/services/complaint_service.py — Complaint business logic.

Responsibilities:
  - Create a complaint: upload photo, compute pHash, store in DB
  - Auto-triage: assign a severity score (placeholder for AI model)
  - List complaints by citizen
  - Get full complaint detail with timeline events from audit log
  - Build the public heatmap GeoJSON
  - Reopen a verified complaint
"""

import imagehash
from datetime import datetime, timezone
from uuid import UUID

from PIL import Image
from io import BytesIO
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError, InvalidComplaintStatusError
from app.core.storage import upload_photo, get_presigned_url
from app.models.complaint import Complaint
from app.models.audit_log import AuditLog
from app.schemas.complaint import (
    ComplaintCreate,
    ComplaintResponse,
    ComplaintSummary,
    HeatmapPoint,
    HeatmapResponse,
    TimelineEvent,
)
from app.services.audit_service import AuditService


class ComplaintService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.audit = AuditService(db)

    # ── Create complaint ──────────────────────────────────────────────────────
    async def create_complaint(
        self,
        citizen_id: UUID,
        body: ComplaintCreate,
        photo_bytes: bytes,
    ) -> ComplaintResponse:
        # 1. Upload photo to MinIO
        photo_key = upload_photo(photo_bytes)

        # 2. Compute pHash fingerprint for Step 1 duplicate detection later
        img = Image.open(BytesIO(photo_bytes))
        photo_hash = str(imagehash.phash(img))

        # 3. Auto-triage: severity score (simple pixel-darkness proxy; replace with model)
        severity = self._compute_severity(img)

        # 4. Build and persist the complaint
        complaint = Complaint(
            citizen_id=citizen_id,
            gps_lat=body.gps_lat,
            gps_lng=body.gps_lng,
            address_text=body.address_text,
            heading=body.heading,
            tilt=body.tilt,
            description=body.description,
            before_photo_url=photo_key,
            before_photo_hash=photo_hash,
            severity_score=severity,
            status="pending",
        )
        self.db.add(complaint)
        await self.db.flush()
        await self.db.refresh(complaint)

        # 5. Write audit log entry
        await self.audit.log(
            actor_id=citizen_id,
            action="COMPLAINT_CREATED",
            entity_type="complaint",
            entity_id=complaint.id,
        )

        return self._to_response(complaint)

    # ── List by citizen ───────────────────────────────────────────────────────
    async def list_by_citizen(self, citizen_id: UUID) -> list[ComplaintSummary]:
        result = await self.db.scalars(
            select(Complaint)
            .where(Complaint.citizen_id == citizen_id)
            .order_by(Complaint.created_at.desc())
        )
        return [ComplaintSummary.model_validate(c) for c in result.all()]

    # ── Get detail with timeline ──────────────────────────────────────────────
    async def get_detail(self, complaint_id: UUID) -> ComplaintResponse:
        complaint = await self.db.get(Complaint, complaint_id)
        if not complaint:
            raise NotFoundError("Complaint")

        # Fetch timeline from audit log
        logs = await self.db.scalars(
            select(AuditLog)
            .where(AuditLog.entity_type == "complaint", AuditLog.entity_id == complaint_id)
            .order_by(AuditLog.created_at.asc())
        )
        timeline = [
            TimelineEvent(action=log.action, timestamp=log.created_at, notes=log.notes)
            for log in logs.all()
        ]
        response = self._to_response(complaint)
        response.timeline = timeline
        return response

    # ── Public heatmap ────────────────────────────────────────────────────────
    async def get_heatmap(self) -> HeatmapResponse:
        result = await self.db.scalars(select(Complaint))
        points = [
            HeatmapPoint(
                lat=c.gps_lat,
                lng=c.gps_lng,
                status=c.status,
                severity=c.severity_score,
            )
            for c in result.all()
        ]
        return HeatmapResponse(points=points)

    # ── Reopen ────────────────────────────────────────────────────────────────
    async def reopen(self, complaint_id: UUID, citizen_id: UUID, reason: str) -> ComplaintResponse:
        complaint = await self.db.get(Complaint, complaint_id)
        if not complaint:
            raise NotFoundError("Complaint")
        if complaint.status != "verified":
            raise InvalidComplaintStatusError(complaint.status, "verified")

        complaint.status = "reopened"
        await self.db.flush()

        await self.audit.log(
            actor_id=citizen_id,
            action="COMPLAINT_REOPENED",
            entity_type="complaint",
            entity_id=complaint_id,
            notes=reason,
        )
        return self._to_response(complaint)

    # ── Helpers ───────────────────────────────────────────────────────────────
    def _compute_severity(self, img: Image.Image) -> float:
        """
        Placeholder severity scorer.
        In production: run YOLOv8 pothole size estimation.
        For now: darker average pixel = worse road condition.
        """
        import numpy as np
        arr = np.array(img.convert("L"))  # grayscale
        brightness = arr.mean() / 255.0
        return round(1.0 - brightness, 4)  # darker = higher severity

    def _to_response(self, complaint: Complaint) -> ComplaintResponse:
        """Convert ORM model to Pydantic response, resolving the photo URL."""
        photo_url = None
        if complaint.before_photo_url:
            photo_url = get_presigned_url(complaint.before_photo_url)

        return ComplaintResponse(
            id=complaint.id,
            status=complaint.status,
            description=complaint.description,
            gps_lat=complaint.gps_lat,
            gps_lng=complaint.gps_lng,
            address_text=complaint.address_text,
            heading=complaint.heading,
            tilt=complaint.tilt,
            severity_score=complaint.severity_score,
            before_photo_url=photo_url,
            created_at=complaint.created_at,
            updated_at=complaint.updated_at,
        )
