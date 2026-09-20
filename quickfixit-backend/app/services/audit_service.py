"""
app/services/audit_service.py — Tamper-evident audit log writer.

Responsibilities:
  - Write an audit log entry for every significant state transition
  - Chain each entry's hash with the previous entry's hash (blockchain-style)
  - Provide paginated read access for the admin portal

The SHA-256 chain works as follows:
  sha256_payload = SHA256(action + entity_type + entity_id + actor_id + timestamp + previous_hash)

If any past entry is tampered with, the chain breaks and is detectable
by recomputing hashes from the first entry forward.
"""

import hashlib
from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.audit_log import AuditLog
from app.schemas.admin import AuditLogEntry


class AuditService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def log(
        self,
        action: str,
        entity_type: str,
        entity_id: UUID,
        actor_id: UUID | None = None,
        notes: str | None = None,
    ) -> AuditLog:
        """
        Writes a new tamper-evident audit log entry.
        Automatically fetches the previous entry's hash to continue the chain.
        """
        now = datetime.now(timezone.utc)

        # Get the hash of the most recent entry (the "previous block" in our chain)
        last_entry = await self.db.scalar(
            select(AuditLog).order_by(AuditLog.created_at.desc()).limit(1)
        )
        previous_hash = last_entry.sha256_payload if last_entry else "GENESIS"

        # Compute this entry's hash
        raw = f"{action}{entity_type}{entity_id}{actor_id}{now.isoformat()}{previous_hash}"
        sha256 = hashlib.sha256(raw.encode()).hexdigest()

        entry = AuditLog(
            actor_id=actor_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            notes=notes,
            sha256_payload=sha256,
            created_at=now,
        )
        self.db.add(entry)
        await self.db.flush()
        return entry

    async def get_log(
        self,
        page: int,
        page_size: int,
        entity_type: str | None,
        action: str | None,
    ) -> list[AuditLogEntry]:
        """Returns paginated audit log entries with optional filters."""
        query = select(AuditLog).order_by(AuditLog.created_at.desc())
        if entity_type:
            query = query.where(AuditLog.entity_type == entity_type)
        if action:
            query = query.where(AuditLog.action == action)
        query = query.offset((page - 1) * page_size).limit(page_size)

        result = await self.db.scalars(query)
        return [AuditLogEntry.model_validate(e) for e in result.all()]
