"""
app/api/v1/admin.py — Admin portal endpoints.

Endpoints:
  GET    /admin/users              — list all users
  PUT    /admin/users/{id}         — update role or status
  DELETE /admin/users/{id}         — deactivate a user
  GET    /admin/audit-log          — paginated tamper-evident audit log
  GET    /admin/config             — read current verification thresholds
  PUT    /admin/config             — update thresholds at runtime

Rule: NO business logic here. All logic delegated to services.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_session
from app.core.security import require_role
from app.schemas.admin import AdminUserResponse, AuditLogEntry, SystemConfig, UserManageRequest
from app.services.auth_service import AuthService
from app.services.audit_service import AuditService
from app.core.config import settings

router = APIRouter()

# All admin routes require the 'admin' role
_admin = Depends(require_role("admin"))


@router.get("/users", response_model=list[AdminUserResponse], dependencies=[_admin])
async def list_users(
    db: AsyncSession = Depends(get_session),
    role: str | None = Query(None, description="Filter by role"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
):
    """List all registered users, with optional role filter and pagination."""
    return await AuthService(db).list_users(role=role, page=page, page_size=page_size)


@router.put("/users/{user_id}", response_model=AdminUserResponse, dependencies=[_admin])
async def update_user(
    user_id: UUID,
    body: UserManageRequest,
    db: AsyncSession = Depends(get_session),
):
    """Update a user's role or active status."""
    return await AuthService(db).update_user(user_id, body)


@router.delete("/users/{user_id}", status_code=204, dependencies=[_admin])
async def deactivate_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_session),
):
    """Soft-delete a user by setting is_active=False."""
    await AuthService(db).deactivate_user(user_id)


@router.get("/audit-log", response_model=list[AuditLogEntry], dependencies=[_admin])
async def get_audit_log(
    db: AsyncSession = Depends(get_session),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    entity_type: str | None = Query(None),
    action: str | None = Query(None),
):
    """
    Paginated tamper-evident audit log.
    Supports filtering by entity type and action for forensic investigation.
    """
    return await AuditService(db).get_log(
        page=page,
        page_size=page_size,
        entity_type=entity_type,
        action=action,
    )


@router.get("/config", response_model=SystemConfig, dependencies=[_admin])
async def get_config():
    """Read the current verification threshold configuration."""
    return SystemConfig(
        gps_tolerance_meters=settings.gps_tolerance_meters,
        heading_tolerance_degrees=settings.heading_tolerance_degrees,
        tilt_tolerance_degrees=settings.tilt_tolerance_degrees,
        landmark_min_matches=settings.landmark_min_matches,
        landmark_min_inlier_ratio=settings.landmark_min_inlier_ratio,
        phash_hamming_threshold=settings.phash_hamming_threshold,
        fusion_auto_pass=settings.fusion_auto_pass,
        fusion_officer_review=settings.fusion_officer_review,
    )


@router.put("/config", response_model=SystemConfig, dependencies=[_admin])
async def update_config(body: SystemConfig):
    """
    Update verification thresholds at runtime without redeployment.
    Changes take effect immediately for all subsequent verifications.
    Note: In production, persist these to a config DB table for durability.
    """
    settings.gps_tolerance_meters = body.gps_tolerance_meters
    settings.heading_tolerance_degrees = body.heading_tolerance_degrees
    settings.tilt_tolerance_degrees = body.tilt_tolerance_degrees
    settings.landmark_min_matches = body.landmark_min_matches
    settings.landmark_min_inlier_ratio = body.landmark_min_inlier_ratio
    settings.phash_hamming_threshold = body.phash_hamming_threshold
    settings.fusion_auto_pass = body.fusion_auto_pass
    settings.fusion_officer_review = body.fusion_officer_review
    return body
