"""
app/services/verification/pipeline.py — Verification pipeline orchestrator.

Responsibilities:
  - Runs Steps 1–6 in sequence
  - Short-circuits on hard fails (Steps 1 & 2)
  - Collects all step results and writes them to the verification table
  - Updates complaint status based on the fusion outcome
  - Sends notifications based on outcome

This is the only file that knows the order of the steps.
Individual step files know nothing about each other.
"""

import uuid
from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal
from app.core.storage import download_photo
from app.models.complaint import Complaint
from app.models.repair import Repair
from app.models.verification import Verification
from app.services import (
    audit_service as audit_svc,
    notification_service as notify_svc,
)
from app.services.audit_service import AuditService
from app.services.notification_service import NotificationService
from app.services.verification import (
    step1_integrity,
    step2_gps,
    step3_angle,
    step4_landmark,
    step5_repair,
    step6_fusion,
)


async def run_pipeline(repair_id: UUID) -> dict:
    """
    Runs the full 6-step verification pipeline for a given repair.

    Called by the Celery task. Uses its own DB session (not request-scoped).

    Returns the final outcome dict.
    """
    async with AsyncSessionLocal() as db:
        audit = AuditService(db)
        notify = NotificationService()

        # ── Load repair + complaint ───────────────────────────────────────────
        repair = await db.get(Repair, repair_id)
        if not repair:
            return {"error": f"Repair {repair_id} not found"}

        complaint = await db.get(Complaint, repair.complaint_id)
        if not complaint:
            return {"error": f"Complaint for repair {repair_id} not found"}

        # ── Download photos from MinIO ────────────────────────────────────────
        before_bytes = download_photo(complaint.before_photo_url)
        after_bytes = download_photo(repair.after_photo_url)

        # ── Fetch all known photo hashes for duplicate detection (Step 1) ─────
        from sqlalchemy import select as sa_select
        from app.models.complaint import Complaint as C
        from app.models.repair import Repair as R

        before_hashes = list(await db.scalars(sa_select(C.before_photo_hash).where(C.before_photo_hash.isnot(None))))
        after_hashes = list(await db.scalars(sa_select(R.after_photo_hash).where(R.after_photo_hash.isnot(None))))
        # Exclude the current repair's own hash from the comparison
        all_known_hashes = [h for h in (before_hashes + after_hashes) if h != repair.after_photo_hash]

        # ── Step 1: Integrity ─────────────────────────────────────────────────
        s1 = step1_integrity.run(
            after_photo_bytes=after_bytes,
            after_photo_hash=repair.after_photo_hash,
            all_known_hashes=all_known_hashes,
            complaint_created_at=complaint.created_at,
        )
        if not s1["passed"]:
            return await _finalise(
                db, audit, notify, repair, complaint,
                s1=s1, outcome="auto_reject", reason=s1["reason"]
            )

        # ── Step 2: GPS ───────────────────────────────────────────────────────
        s2 = step2_gps.run(
            before_lat=complaint.gps_lat,
            before_lng=complaint.gps_lng,
            after_lat=repair.after_gps_lat,
            after_lng=repair.after_gps_lng,
        )
        if not s2["passed"]:
            return await _finalise(
                db, audit, notify, repair, complaint,
                s1=s1, s2=s2, outcome="auto_reject", reason=s2["reason"]
            )

        # ── Step 3: Angle ─────────────────────────────────────────────────────
        s3 = step3_angle.run(
            before_photo_bytes=before_bytes,
            after_photo_bytes=after_bytes,
            before_heading=complaint.heading,
            after_heading=repair.after_heading,
            before_tilt=complaint.tilt,
            after_tilt=repair.after_tilt,
        )

        # ── Step 4: Landmark matching ─────────────────────────────────────────
        s4 = step4_landmark.run(before_bytes, after_bytes)

        # ── Step 5: Repair confirmation ───────────────────────────────────────
        s5 = step5_repair.run(before_bytes, after_bytes)

        # ── Step 6: Fusion ────────────────────────────────────────────────────
        s6 = step6_fusion.run(s2, s3, s4, s5)

        return await _finalise(
            db, audit, notify, repair, complaint,
            s1=s1, s2=s2, s3=s3, s4=s4, s5=s5,
            fusion_score=s6["fusion_score"],
            outcome=s6["outcome"],
            reason=s6.get("rejection_reason"),
        )


async def _finalise(
    db: AsyncSession,
    audit: AuditService,
    notify: NotificationService,
    repair: Repair,
    complaint: Complaint,
    s1: dict = None,
    s2: dict = None,
    s3: dict = None,
    s4: dict = None,
    s5: dict = None,
    fusion_score: float = 0.0,
    outcome: str = "auto_reject",
    reason: str = None,
) -> dict:
    """
    Writes the Verification record, updates complaint status,
    logs to audit, and sends notifications.
    """
    verification = Verification(
        repair_id=repair.id,
        step1_integrity=s1,
        step2_gps=s2,
        step3_angle=s3,
        step4_landmarks=s4,
        step5_repair=s5,
        step6_fusion=fusion_score,
        outcome=outcome,
        rejection_reason=reason,
    )
    db.add(verification)

    # Update complaint status based on outcome
    if outcome == "auto_pass":
        complaint.status = "verified"
        action = "VERIFICATION_PASSED"
    elif outcome == "officer_review":
        complaint.status = "under_review"
        action = "VERIFICATION_NEEDS_REVIEW"
    else:  # auto_reject
        complaint.status = "assigned"  # contractor must resubmit
        action = "VERIFICATION_REJECTED"

    await db.flush()
    await db.refresh(verification)

    await audit.log(
        action=action,
        entity_type="verification",
        entity_id=verification.id,
    )
    await db.commit()

    # Notify relevant parties
    if outcome == "auto_pass":
        await notify.send_contractor_notification(
            repair.contractor_id, "✅ Your repair has been automatically verified."
        )
        await notify.broadcast_complaint_verified(complaint.id)
    elif outcome == "officer_review":
        await notify.send_contractor_notification(
            repair.contractor_id,
            "🔍 Your repair is under manual officer review. You'll be notified of the decision."
        )
    else:
        await notify.send_contractor_notification(
            repair.contractor_id,
            f"❌ Repair rejected: {reason}"
        )

    return {
        "verification_id": str(verification.id),
        "outcome": outcome,
        "fusion_score": fusion_score,
        "reason": reason,
    }
